import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { tier, withMaintenance, userId, userEmail } = await req.json();

    const validTiers = ["standard", "pro", "premium"];
    if (!tier || !validTiers.includes(tier)) {
      return new Response(
        JSON.stringify({ error: "Invalid tier. Must be standard, pro, or premium." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!userId || !userEmail) {
      return new Response(
        JSON.stringify({ error: "User ID and email are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe secret key not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingLicense } = await supabase
      .from("licenses")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (existingLicense) {
      return new Response(
        JSON.stringify({ error: "User already has an active license." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const licensePriceIds: Record<string, string | undefined> = {
      standard: Deno.env.get("STRIPE_PRICE_LICENSE_STANDARD"),
      pro: Deno.env.get("STRIPE_PRICE_LICENSE_PRO"),
      premium: Deno.env.get("STRIPE_PRICE_LICENSE_PREMIUM"),
    };

    const maintenanceFirstYearPriceIds: Record<string, string | undefined> = {
      standard: Deno.env.get("STRIPE_PRICE_MAINTENANCE_STANDARD_YEAR1"),
      pro: Deno.env.get("STRIPE_PRICE_MAINTENANCE_PRO_YEAR1"),
      premium: Deno.env.get("STRIPE_PRICE_MAINTENANCE_PREMIUM_YEAR1"),
    };

    const maintenanceStandardPriceIds: Record<string, string | undefined> = {
      standard: Deno.env.get("STRIPE_PRICE_MAINTENANCE_STANDARD"),
      pro: Deno.env.get("STRIPE_PRICE_MAINTENANCE_PRO"),
      premium: Deno.env.get("STRIPE_PRICE_MAINTENANCE_PREMIUM"),
    };

    const licensePriceId = licensePriceIds[tier];
    if (!licensePriceId) {
      return new Response(
        JSON.stringify({ error: `License price ID for tier "${tier}" is not configured.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:5173";
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: licensePriceId, quantity: 1 },
    ];

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: withMaintenance ? "subscription" : "payment",
      customer_email: userEmail,
      line_items: lineItems,
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/checkout?checkout=cancelled`,
      metadata: {
        user_id: userId,
        tier: tier,
        with_maintenance: withMaintenance ? "true" : "false",
        purchase_date: new Date().toISOString(),
      },
    };

    if (withMaintenance) {
      const firstYearPriceId = maintenanceFirstYearPriceIds[tier];
      const standardPriceId = maintenanceStandardPriceIds[tier];

      if (!firstYearPriceId || !standardPriceId) {
        return new Response(
          JSON.stringify({ error: `Maintenance price IDs for tier "${tier}" are not configured.` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      sessionParams.subscription_data = {
        metadata: {
          user_id: userId,
          tier: tier,
          is_first_year: "true",
        },
      };

      sessionParams.metadata!.maintenance_first_year_price_id = firstYearPriceId;
      sessionParams.metadata!.maintenance_standard_price_id = standardPriceId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout error:", error);

    await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )
      .from("error_logs")
      .insert({
        error_type: "stripe_checkout_error",
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
