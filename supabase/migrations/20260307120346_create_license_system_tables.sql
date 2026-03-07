/*
  # Système de licences perpétuelles avec maintenance progressive

  1. Nouvelles Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, enum: 'user', 'admin')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `license_tiers`
      - `id` (uuid, primary key)
      - `tier` (text, unique: 'standard', 'pro', 'premium')
      - `name` (text)
      - `perpetual_price` (integer, en centimes)
      - `description` (text)
      - `time_saved_weekly` (integer, en heures)
      - `max_properties` (integer)
      - `created_at` (timestamptz)
    
    - `maintenance_pricing`
      - `id` (uuid, primary key)
      - `tier` (text, référence à license_tiers.tier)
      - `first_year_price` (integer, en centimes par mois)
      - `standard_price` (integer, en centimes par mois)
      - `created_at` (timestamptz)
    
    - `licenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `tier` (text, référence à license_tiers.tier)
      - `license_key` (text, unique)
      - `purchase_date` (timestamptz)
      - `status` (text, enum: 'active', 'suspended', 'cancelled')
      - `frozen_features_date` (timestamptz, nullable)
      - `stripe_payment_intent_id` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `maintenance_subscriptions`
      - `id` (uuid, primary key)
      - `license_id` (uuid, foreign key to licenses)
      - `stripe_subscription_id` (text, unique)
      - `stripe_customer_id` (text)
      - `status` (text)
      - `is_first_year` (boolean)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `license_id` (uuid, foreign key to licenses, nullable)
      - `payment_type` (text: 'license_purchase', 'maintenance_payment', 'maintenance_reactivation')
      - `amount` (integer, en centimes)
      - `currency` (text)
      - `stripe_payment_id` (text)
      - `stripe_invoice_id` (text, nullable)
      - `status` (text)
      - `payment_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `features`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `time_saved_description` (text)
      - `available_from_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `license_features`
      - `id` (uuid, primary key)
      - `tier` (text, référence à license_tiers.tier)
      - `feature_id` (uuid, foreign key to features)
      - `created_at` (timestamptz)
    
    - `notification_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `notification_type` (text)
      - `sent_at` (timestamptz)
      - `metadata` (jsonb)
    
    - `error_logs`
      - `id` (uuid, primary key)
      - `error_type` (text)
      - `error_message` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `audit_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `action` (text)
      - `target_user_id` (uuid, nullable)
      - `details` (jsonb)
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Policies restrictives pour chaque table
    - Les utilisateurs voient uniquement leurs données
    - Les admins voient toutes les données
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create license_tiers table
CREATE TABLE IF NOT EXISTS license_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text UNIQUE NOT NULL CHECK (tier IN ('standard', 'pro', 'premium')),
  name text NOT NULL,
  perpetual_price integer NOT NULL,
  description text NOT NULL,
  time_saved_weekly integer NOT NULL,
  max_properties integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE license_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view license tiers"
  ON license_tiers FOR SELECT
  TO authenticated
  USING (true);

-- Create maintenance_pricing table
CREATE TABLE IF NOT EXISTS maintenance_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL,
  first_year_price integer NOT NULL,
  standard_price integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tier)
);

ALTER TABLE maintenance_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view maintenance pricing"
  ON maintenance_pricing FOR SELECT
  TO authenticated
  USING (true);

-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier text NOT NULL,
  license_key text UNIQUE NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  frozen_features_date timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own licenses"
  ON licenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all licenses"
  ON licenses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create maintenance_subscriptions table
CREATE TABLE IF NOT EXISTS maintenance_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid REFERENCES licenses(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  status text NOT NULL,
  is_first_year boolean DEFAULT true,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own maintenance subscriptions"
  ON maintenance_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.id = maintenance_subscriptions.license_id
      AND licenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all maintenance subscriptions"
  ON maintenance_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  license_id uuid REFERENCES licenses(id) ON DELETE SET NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('license_purchase', 'maintenance_payment', 'maintenance_reactivation')),
  amount integer NOT NULL,
  currency text DEFAULT 'eur',
  stripe_payment_id text NOT NULL,
  stripe_invoice_id text,
  status text NOT NULL,
  payment_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  time_saved_description text NOT NULL,
  available_from_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view features"
  ON features FOR SELECT
  TO authenticated
  USING (true);

-- Create license_features table
CREATE TABLE IF NOT EXISTS license_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL,
  feature_id uuid REFERENCES features(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tier, feature_id)
);

ALTER TABLE license_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view license features"
  ON license_features FOR SELECT
  TO authenticated
  USING (true);

-- Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_type text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notification logs"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  error_message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_maintenance_subscriptions_license_id ON maintenance_subscriptions(license_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_subscriptions_stripe_subscription_id ON maintenance_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_license_id ON payments(license_id);
CREATE INDEX IF NOT EXISTS idx_license_features_tier ON license_features(tier);

-- Insert license tiers data
INSERT INTO license_tiers (tier, name, perpetual_price, description, time_saved_weekly, max_properties)
VALUES 
  ('standard', 'Standard', 150000, 'Gérez jusqu''à 10 logements sans embaucher - Automatisation basique pour économiser du temps', 10, 10),
  ('pro', 'Pro', 300000, 'Passez à 30 logements avec la même équipe - Outils avancés pour une gestion optimale', 20, 30),
  ('premium', 'Premium', 900000, 'Devenez le gestionnaire de prestige - Excellence opérationnelle et croissance illimitée', 40, 999)
ON CONFLICT (tier) DO NOTHING;

-- Insert maintenance pricing data
INSERT INTO maintenance_pricing (tier, first_year_price, standard_price)
VALUES 
  ('standard', 6000, 12000),
  ('pro', 12000, 24000),
  ('premium', 23000, 46000)
ON CONFLICT (tier) DO NOTHING;