import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = 4;
  const segmentLength = 4;

  const generateSegment = () => {
    let segment = "";
    for (let i = 0; i < segmentLength; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  };

  const parts = [];
  for (let i = 0; i < segments; i++) {
    parts.push(generateSegment());
  }

  return `SP-${parts.join("-")}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!stripeSecretKey || !webhookSecret) {
      return new Response(
        JSON.stringify({ error: "Stripe credentials not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook signature verification failed.";
      await supabase.from("error_logs").insert({
        error_type: "webhook_signature_failed",
        error_message: message,
        metadata: { body: body.substring(0, 500) },
      });
      return new Response(
        JSON.stringify({ error: message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing webhook event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const tier = session.metadata?.tier;
      const withMaintenance = session.metadata?.with_maintenance === "true";

      if (!userId || !tier) {
        console.error("Missing metadata in checkout session:", session.id);
        await supabase.from("error_logs").insert({
          error_type: "checkout_missing_metadata",
          error_message: "User ID or tier missing from checkout session",
          metadata: { session_id: session.id, metadata: session.metadata },
        });
        return new Response(JSON.stringify({ error: "Missing metadata" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const licenseKey = generateLicenseKey();

      const { data: license, error: licenseError } = await supabase
        .from("licenses")
        .insert({
          user_id: userId,
          tier: tier,
          license_key: licenseKey,
          purchase_date: new Date().toISOString(),
          status: "active",
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .select()
        .single();

      if (licenseError || !license) {
        console.error("Error creating license:", licenseError);
        await supabase.from("error_logs").insert({
          error_type: "license_creation_failed",
          error_message: licenseError?.message || "Unknown error",
          metadata: { user_id: userId, tier, session_id: session.id },
        });
        return new Response(JSON.stringify({ error: "Failed to create license" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: paymentError } = await supabase.from("payments").insert({
        user_id: userId,
        license_id: license.id,
        payment_type: "license_purchase",
        amount: session.amount_total || 0,
        currency: session.currency || "eur",
        stripe_payment_id: session.payment_intent as string,
        status: "succeeded",
        payment_date: new Date().toISOString(),
      });

      if (paymentError) {
        console.error("Error recording payment:", paymentError);
      }

      if (withMaintenance && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const { error: maintenanceError } = await supabase
          .from("maintenance_subscriptions")
          .insert({
            license_id: license.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            is_first_year: true,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

        if (maintenanceError) {
          console.error("Error creating maintenance subscription:", maintenanceError);
          await supabase.from("error_logs").insert({
            error_type: "maintenance_creation_failed",
            error_message: maintenanceError.message,
            metadata: { license_id: license.id, subscription_id: subscription.id },
          });
        }
      }

      console.log(`License created: ${licenseKey} for user ${userId}`);
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.subscription) {
        const { data: maintenance } = await supabase
          .from("maintenance_subscriptions")
          .select("*, licenses(user_id, id)")
          .eq("stripe_subscription_id", invoice.subscription)
          .single();

        if (maintenance) {
          await supabase
            .from("maintenance_subscriptions")
            .update({
              current_period_start: new Date(invoice.period_start * 1000).toISOString(),
              current_period_end: new Date(invoice.period_end * 1000).toISOString(),
              status: "active",
            })
            .eq("id", maintenance.id);

          await supabase.from("payments").insert({
            user_id: (maintenance.licenses as any).user_id,
            license_id: (maintenance.licenses as any).id,
            payment_type: "maintenance_payment",
            amount: invoice.amount_paid,
            currency: invoice.currency,
            stripe_payment_id: invoice.payment_intent as string,
            stripe_invoice_id: invoice.id,
            status: "succeeded",
            payment_date: new Date().toISOString(),
          });

          console.log(`Maintenance payment recorded for subscription: ${invoice.subscription}`);
        }
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.subscription) {
        const { data: maintenance } = await supabase
          .from("maintenance_subscriptions")
          .select("id")
          .eq("stripe_subscription_id", invoice.subscription)
          .single();

        if (maintenance) {
          await supabase
            .from("maintenance_subscriptions")
            .update({ status: "past_due" })
            .eq("id", maintenance.id);

          console.log(`Maintenance subscription marked as past_due: ${invoice.subscription}`);
        }
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: maintenance } = await supabase
        .from("maintenance_subscriptions")
        .select("*, licenses(id, user_id)")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (maintenance) {
        const updates: any = {
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        };

        const currentPriceId = subscription.items.data[0]?.price.id;
        const firstYearPriceId = Deno.env.get(`STRIPE_PRICE_MAINTENANCE_${(maintenance.licenses as any).tier?.toUpperCase()}_YEAR1`);

        if (currentPriceId && firstYearPriceId && currentPriceId !== firstYearPriceId) {
          updates.is_first_year = false;
        }

        await supabase
          .from("maintenance_subscriptions")
          .update(updates)
          .eq("id", maintenance.id);

        if (subscription.status === "canceled") {
          await supabase
            .from("licenses")
            .update({ frozen_features_date: new Date().toISOString() })
            .eq("id", (maintenance.licenses as any).id);

          console.log(`License frozen due to maintenance cancellation: ${(maintenance.licenses as any).id}`);
        }

        console.log(`Maintenance subscription updated: ${subscription.id}`);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: maintenance } = await supabase
        .from("maintenance_subscriptions")
        .select("*, licenses(id)")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (maintenance) {
        await supabase
          .from("maintenance_subscriptions")
          .update({ status: "canceled" })
          .eq("id", maintenance.id);

        await supabase
          .from("licenses")
          .update({ frozen_features_date: new Date().toISOString() })
          .eq("id", (maintenance.licenses as any).id);

        console.log(`Maintenance subscription deleted and license frozen: ${subscription.id}`);
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("error_logs").insert({
      error_type: "webhook_processing_error",
      error_message: error instanceof Error ? error.message : "Unknown error",
      metadata: { stack: error instanceof Error ? error.stack : null },
    });

    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
