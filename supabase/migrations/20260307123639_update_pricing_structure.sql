/*
  # Update Pricing Structure

  1. Updates
    - Update license_tiers table with new pricing:
      - Standard: 2,500€ perpetual license
      - Pro: 5,000€ perpetual license  
      - Premium: 9,000€ perpetual license
    - Update maintenance_pricing table with new monthly maintenance fees:
      - Standard: 79€/month
      - Pro: 149€/month
      - Premium: 299€/month
    - Update descriptions to match new business model
*/

-- Update Standard tier
UPDATE license_tiers
SET 
  perpetual_price = 250000,
  name = 'Starter',
  description = 'Pour les propriétaires indépendants',
  max_properties = 5,
  time_saved_weekly = 5
WHERE tier = 'standard';

-- Update Pro tier
UPDATE license_tiers
SET 
  perpetual_price = 500000,
  name = 'Pro',
  description = 'Pour les conciergeries en croissance',
  max_properties = 50,
  time_saved_weekly = 15
WHERE tier = 'pro';

-- Update Premium tier
UPDATE license_tiers
SET 
  perpetual_price = 900000,
  name = 'Premium',
  description = 'Pour les grandes conciergeries',
  max_properties = 999,
  time_saved_weekly = 40
WHERE tier = 'premium';

-- Update maintenance pricing
UPDATE maintenance_pricing
SET 
  first_year_price = 7900,
  standard_price = 7900
WHERE tier = 'standard';

UPDATE maintenance_pricing
SET 
  first_year_price = 14900,
  standard_price = 14900
WHERE tier = 'pro';

UPDATE maintenance_pricing
SET 
  first_year_price = 29900,
  standard_price = 29900
WHERE tier = 'premium';