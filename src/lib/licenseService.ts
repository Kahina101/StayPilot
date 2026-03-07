import { supabase } from './supabase';

export type LicenseTier = 'standard' | 'pro' | 'premium';

export interface License {
  id: string;
  user_id: string;
  tier: LicenseTier;
  license_key: string;
  purchase_date: string;
  status: 'active' | 'suspended' | 'cancelled';
  frozen_features_date: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceSubscription {
  id: string;
  license_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  is_first_year: boolean;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface LicenseTierInfo {
  tier: LicenseTier;
  name: string;
  perpetual_price: number;
  description: string;
  time_saved_weekly: number;
  max_properties: number;
}

export interface MaintenancePricing {
  tier: LicenseTier;
  first_year_price: number;
  standard_price: number;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  time_saved_description: string;
  available_from_date: string;
}

export interface LicenseInfo {
  license: License | null;
  maintenance: MaintenanceSubscription | null;
  tierInfo: LicenseTierInfo | null;
  maintenancePricing: MaintenancePricing | null;
  hasActiveMaintenance: boolean;
}

export async function getLicenseInfo(userId: string): Promise<LicenseInfo> {
  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (!license) {
    return {
      license: null,
      maintenance: null,
      tierInfo: null,
      maintenancePricing: null,
      hasActiveMaintenance: false,
    };
  }

  const { data: tierInfo } = await supabase
    .from('license_tiers')
    .select('*')
    .eq('tier', license.tier)
    .maybeSingle();

  const { data: maintenancePricing } = await supabase
    .from('maintenance_pricing')
    .select('*')
    .eq('tier', license.tier)
    .maybeSingle();

  const { data: maintenance } = await supabase
    .from('maintenance_subscriptions')
    .select('*')
    .eq('license_id', license.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle();

  return {
    license,
    maintenance: maintenance || null,
    tierInfo: tierInfo || null,
    maintenancePricing: maintenancePricing || null,
    hasActiveMaintenance: !!maintenance && ['active', 'trialing'].includes(maintenance.status),
  };
}

export async function checkFeatureAccess(
  userId: string,
  featureName: string
): Promise<{ hasAccess: boolean; reason?: string }> {
  const licenseInfo = await getLicenseInfo(userId);

  if (!licenseInfo.license) {
    return { hasAccess: false, reason: 'no_license' };
  }

  const { data: feature } = await supabase
    .from('features')
    .select('*, license_features!inner(tier)')
    .eq('name', featureName)
    .maybeSingle();

  if (!feature) {
    return { hasAccess: false, reason: 'feature_not_found' };
  }

  const tierHasFeature = (feature as any).license_features.some(
    (lf: any) => lf.tier === licenseInfo.license!.tier
  );

  if (!tierHasFeature) {
    return { hasAccess: false, reason: 'tier_too_low' };
  }

  if (!licenseInfo.hasActiveMaintenance && licenseInfo.license.frozen_features_date) {
    const featureDate = new Date(feature.available_from_date);
    const frozenDate = new Date(licenseInfo.license.frozen_features_date);

    if (featureDate > frozenDate) {
      return { hasAccess: false, reason: 'maintenance_required' };
    }
  }

  return { hasAccess: true };
}

export async function getAllLicenseTiers(): Promise<LicenseTierInfo[]> {
  const { data } = await supabase
    .from('license_tiers')
    .select('*')
    .order('perpetual_price', { ascending: true });

  return data || [];
}

export async function getAllMaintenancePricing(): Promise<MaintenancePricing[]> {
  const { data } = await supabase
    .from('maintenance_pricing')
    .select('*');

  return data || [];
}

export async function getFeaturesByTier(tier: LicenseTier): Promise<Feature[]> {
  const { data } = await supabase
    .from('license_features')
    .select('features(*)')
    .eq('tier', tier);

  return data?.map((item: any) => item.features) || [];
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  return data?.role === 'admin';
}

export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;

  const generateSegment = () => {
    let segment = '';
    for (let i = 0; i < segmentLength; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  };

  const parts = [];
  for (let i = 0; i < segments; i++) {
    parts.push(generateSegment());
  }

  return `SP-${parts.join('-')}`;
}

export function calculateDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateMonthlySavings(
  firstYearPrice: number,
  standardPrice: number
): number {
  return standardPrice - firstYearPrice;
}

export function calculateTotalSavings(
  firstYearPrice: number,
  standardPrice: number,
  monthsInFirstYear: number
): number {
  return (standardPrice - firstYearPrice) * monthsInFirstYear;
}

export function formatPrice(centimes: number): string {
  return `${(centimes / 100).toFixed(0)}€`;
}

export function formatMonthlyPrice(centimes: number): string {
  return `${(centimes / 100).toFixed(0)}€/mois`;
}
