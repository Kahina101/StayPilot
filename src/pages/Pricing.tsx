import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, TrendingUp, Star, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  getAllLicenseTiers,
  getAllMaintenancePricing,
  formatPrice,
  formatMonthlyPrice,
  LicenseTierInfo,
  MaintenancePricing,
} from '../lib/licenseService';

interface PricingTier extends LicenseTierInfo {
  maintenancePricing?: MaintenancePricing;
}

export function Pricing() {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(50);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const [tierData, maintenanceData] = await Promise.all([
          getAllLicenseTiers(),
          getAllMaintenancePricing(),
        ]);

        const combined = tierData.map((tier) => ({
          ...tier,
          maintenancePricing: maintenanceData.find((m) => m.tier === tier.tier),
        }));

        setTiers(combined);
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPricing();
  }, []);

  const calculateROI = (tier: PricingTier, months: number) => {
    const timeSavedValue = tier.time_saved_weekly * 4 * months * hourlyRate;
    const licenseCost = tier.perpetual_price / 100;
    const maintenanceCost = tier.maintenancePricing
      ? (tier.maintenancePricing.first_year_price / 100) * Math.min(months, 12) +
        (tier.maintenancePricing.standard_price / 100) * Math.max(0, months - 12)
      : 0;
    const totalCost = licenseCost + maintenanceCost;
    return timeSavedValue - totalCost;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Star className="w-6 h-6" />;
      case 'pro':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'from-amber-500 to-orange-600';
      case 'pro':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-green-500 to-emerald-600';
    }
  };

  const getFeaturesByTier = (tier: string) => {
    const standardFeatures = [
      'Synchronisation Airbnb et Booking.com',
      'Messagerie centralisée multi-plateformes',
      'Automatisations basiques de communication',
      'Gestion des réservations centralisée',
      'Rapports basiques mensuels',
      'Notifications mobiles en temps réel',
    ];

    const proFeatures = [
      ...standardFeatures,
      'Synchronisation 15+ plateformes',
      'Gestion d\'équipe et assignation des tâches',
      'Automatisations avancées check-in/out',
      'Analytics détaillés et prévisions',
      'Application mobile iOS et Android',
      'Prix dynamique basé sur la demande',
      'Coordination automatique du ménage',
    ];

    const premiumFeatures = [
      ...proFeatures,
      'API personnalisée pour intégrations',
      'Account manager dédié',
      'Analytics prédictifs avec IA',
      'Interface en marque blanche',
      'Support prioritaire sous 1h',
      'Permissions avancées multi-équipes',
      'Intégrations sur mesure',
      'Optimisation revenus algorithmique',
    ];

    switch (tier) {
      case 'premium':
        return premiumFeatures;
      case 'pro':
        return proFeatures;
      default:
        return standardFeatures;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choisissez l'offre qui correspond à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const features = getFeaturesByTier(tier.tier);
            const isPro = tier.tier === 'pro';
            const isPremium = tier.tier === 'premium';

            const displayName = tier.tier === 'standard' ? 'Solo' :
                              tier.tier === 'pro' ? 'Professionnel' :
                              'Entreprise';

            const subtitle = tier.tier === 'standard' ? 'Pour les propriétaires indépendants' :
                           tier.tier === 'pro' ? 'Pour les conciergeries en croissance' :
                           'Pour les grandes conciergeries';

            return (
              <div
                key={tier.tier}
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  isPro ? 'bg-gradient-to-br from-blue-600 to-teal-400 text-white' : 'bg-white'
                }`}
              >
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isPro ? 'text-white' : 'text-slate-900'}`}>
                    {displayName}
                  </h3>
                  <p className={`text-sm mb-8 ${isPro ? 'text-blue-100' : 'text-slate-600'}`}>
                    {subtitle}
                  </p>

                  <div className="mb-8">
                    {isPremium ? (
                      <div>
                        <div className={`text-5xl font-bold mb-2 text-slate-900`}>
                          Sur mesure
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className={`flex items-baseline gap-1 mb-2 ${isPro ? 'text-white' : 'text-slate-900'}`}>
                          <span className="text-5xl font-bold">
                            {(tier.perpetual_price / 100).toFixed(0)}€
                          </span>
                          <span className="text-lg">/mois</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {features.slice(0, tier.tier === 'standard' ? 6 : tier.tier === 'pro' ? 8 : 9).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isPro ? 'text-white' : 'text-green-600'
                        }`} />
                        <span className={`text-sm ${isPro ? 'text-white' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => isPremium ? navigate('/contact') : navigate('/checkout', { state: { tier: tier.tier } })}
                    className={`w-full ${
                      isPro
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : isPremium
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isPremium ? 'Nous contacter' : 'Commencer'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
