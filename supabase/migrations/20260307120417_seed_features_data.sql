/*
  # Seed des fonctionnalités avec focus sur les gains

  1. Données insérées
    - Fonctionnalités Standard (automatisation de base)
    - Fonctionnalités Pro (gestion avancée et équipes)
    - Fonctionnalités Premium (excellence opérationnelle)
    
  2. Associations
    - Mappage des fonctionnalités par tier de licence
*/

-- Insert features for Standard tier
INSERT INTO features (name, description, time_saved_description, available_from_date)
VALUES 
  ('airbnb_booking_sync', 'Synchronisation Airbnb et Booking.com', 'Synchronisation automatique des calendriers pour éviter les double-réservations - Gain: 3h/semaine', '2026-01-01'),
  ('centralized_messaging', 'Messagerie centralisée', 'Tous vos messages au même endroit pour répondre rapidement - Gain: 2h/semaine', '2026-01-01'),
  ('basic_automation', 'Automatisations basiques', 'Messages de bienvenue et instructions automatiques - Gain: 2h/semaine', '2026-01-01'),
  ('reservation_management', 'Gestion des réservations', 'Tableau de bord centralisé pour toutes vos réservations - Gain: 1h/semaine', '2026-01-01'),
  ('basic_reporting', 'Rapports basiques', 'Statistiques d''occupation et revenus mensuels - Gain: 1h/semaine', '2026-01-01'),
  ('mobile_notifications', 'Notifications mobiles', 'Alertes en temps réel pour les nouvelles réservations - Gain: 1h/semaine', '2026-01-01')
ON CONFLICT (name) DO NOTHING;

-- Insert features for Pro tier
INSERT INTO features (name, description, time_saved_description, available_from_date)
VALUES 
  ('all_platforms_sync', 'Synchronisation toutes plateformes', 'Connectez VRBO, Expedia, et 15+ autres plateformes - Gain: 5h/semaine', '2026-01-01'),
  ('team_management', 'Gestion d''équipe', 'Assignez des tâches et suivez les performances de votre équipe - Gain: 3h/semaine', '2026-01-01'),
  ('advanced_automation', 'Automatisations avancées', 'Workflows personnalisés pour check-in/check-out automatiques - Gain: 4h/semaine', '2026-01-01'),
  ('detailed_analytics', 'Rapports détaillés', 'Analytics avancés avec prévisions de revenus - Gain: 2h/semaine', '2026-01-01'),
  ('mobile_app', 'Application mobile complète', 'Gérez tout depuis votre smartphone iOS/Android - Gain: 3h/semaine', '2026-01-01'),
  ('dynamic_pricing', 'Prix dynamique', 'Optimisation automatique des tarifs selon la demande - Gain: 2h/semaine + 15% revenus', '2026-01-01'),
  ('cleaning_coordination', 'Coordination ménage', 'Planification automatique avec vos équipes de nettoyage - Gain: 3h/semaine', '2026-01-01')
ON CONFLICT (name) DO NOTHING;

-- Insert features for Premium tier
INSERT INTO features (name, description, time_saved_description, available_from_date)
VALUES 
  ('custom_api', 'API personnalisée', 'Intégrez avec vos outils métier existants - Gain: Automatisation complète', '2026-01-01'),
  ('dedicated_account_manager', 'Account manager dédié', 'Support prioritaire et conseils stratégiques personnalisés - Gain: Expertise illimitée', '2026-01-01'),
  ('predictive_analytics', 'Analytics prédictifs', 'IA pour prévoir la demande et optimiser votre stratégie - Gain: +25% revenus', '2026-01-01'),
  ('white_label', 'Marque blanche', 'Interface personnalisée à vos couleurs pour vos clients - Gain: Image de marque premium', '2026-01-01'),
  ('priority_support', 'Support prioritaire', 'Réponse garantie sous 1h pendant heures ouvrées - Gain: Zéro temps d''arrêt', '2026-01-01'),
  ('advanced_permissions', 'Permissions avancées', 'Contrôle granulaire des accès pour grandes équipes - Gain: Sécurité et conformité', '2026-01-01'),
  ('custom_integrations', 'Intégrations sur mesure', 'Développement d''intégrations spécifiques à vos besoins - Gain: Workflows parfaits', '2026-01-01'),
  ('revenue_optimization', 'Optimisation revenus', 'Algorithmes avancés pour maximiser votre chiffre d''affaires - Gain: +30% revenus', '2026-01-01')
ON CONFLICT (name) DO NOTHING;

-- Associate features with Standard tier
INSERT INTO license_features (tier, feature_id)
SELECT 'standard', id FROM features
WHERE name IN (
  'airbnb_booking_sync',
  'centralized_messaging',
  'basic_automation',
  'reservation_management',
  'basic_reporting',
  'mobile_notifications'
)
ON CONFLICT (tier, feature_id) DO NOTHING;

-- Associate features with Pro tier (includes Standard features)
INSERT INTO license_features (tier, feature_id)
SELECT 'pro', id FROM features
WHERE name IN (
  'airbnb_booking_sync',
  'centralized_messaging',
  'basic_automation',
  'reservation_management',
  'basic_reporting',
  'mobile_notifications',
  'all_platforms_sync',
  'team_management',
  'advanced_automation',
  'detailed_analytics',
  'mobile_app',
  'dynamic_pricing',
  'cleaning_coordination'
)
ON CONFLICT (tier, feature_id) DO NOTHING;

-- Associate features with Premium tier (includes all features)
INSERT INTO license_features (tier, feature_id)
SELECT 'premium', id FROM features
ON CONFLICT (tier, feature_id) DO NOTHING;