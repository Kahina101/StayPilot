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
      'Gestion simple des tâches',
      'Un utilisateur',
      'Support par email',
      'Jusqu\'à 5 logements',
      'Synchronisation Airbnb & Booking',
      'Messagerie centralisée',
      'Automatisations basiques',
    ];

    const proFeatures = [
      'Gestion multi-utilisateurs',
      'Automatisation des tâches',
      'Rapports avancés',
      'Intégrations API',
      'Toutes les plateformes',
      'Gestion d\'équipe',
      'Support prioritaire',
      'Formation initiale incluse',
    ];

    const premiumFeatures = [
      'Personnalisations sur mesure',
      'Gestion multi-sites',
      'KPI personnalisés',
      'Formations dédiées',
      'Support VIP 7j/7',
      'Account manager dédié',
      'Consolidation des données',
      'Workflows personnalisables',
      'Alertes personnalisées',
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

            const displayName = tier.tier === 'standard' ? 'Starter' :
                              tier.tier === 'pro' ? 'Pro' :
                              'Premium';

            const subtitle = tier.tier === 'standard' ? 'Pour les propriétaires indépendants' :
                           tier.tier === 'pro' ? 'Pour les conciergeries en croissance' :
                           'Solution sur mesure et évolutive';

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

                  <div className="mb-6">
                    {isPremium ? (
                      <div>
                        <div className={`text-5xl font-bold mb-2 text-slate-900`}>
                          Sur mesure
                        </div>
                        <p className={`text-sm text-slate-600`}>Contactez-nous pour un devis</p>
                      </div>
                    ) : (
                      <div>
                        <div className={`flex items-baseline gap-1 mb-2 ${isPro ? 'text-white' : 'text-slate-900'}`}>
                          <span className="text-5xl font-bold">
                            {(tier.perpetual_price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€
                          </span>
                        </div>
                        <p className={`text-sm mb-4 ${isPro ? 'text-blue-100' : 'text-slate-600'}`}>
                          Licence unique
                        </p>
                        {tier.maintenancePricing && (
                          <div className={`text-lg ${isPro ? 'text-white' : 'text-slate-900'}`}>
                            <span className="font-semibold">
                              {(tier.maintenancePricing.first_year_price / 100).toFixed(0)}€/mois
                            </span>
                            <p className={`text-sm mt-1 ${isPro ? 'text-blue-100' : 'text-slate-600'}`}>
                              Maintenance mensuelle
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    {features.map((feature, index) => (
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

        <div className="max-w-4xl mx-auto space-y-8 mt-16">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pourquoi choisir Pro ?</h2>
            <p className="text-slate-700 leading-relaxed">
              La licence Pro inclut toutes les fonctionnalités essentielles : gestion multi-utilisateurs,
              automatisation des tâches, rapports avancés et intégrations API. La licence Premium va plus loin :
              elle offre une personnalisation sur mesure, un support VIP dédié, une gestion multi-sites, et des
              analyses avancées avec alertes personnalisées. <strong>Optez pour Premium si vous avez besoin d'une
              solution sur mesure, évolutive et de support ultra-réactif.</strong>
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Premium : La solution complète</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              La licence Premium inclut tout de la Pro, mais en plus, elle permet une <strong>personnalisation
              sur mesure de vos workflows</strong>, une gestion multi-sites avec consolidation des données,
              un tableau de bord sur mesure avec des KPI spécifiques à votre activité, ainsi qu'un accompagnement
              dédié avec un gestionnaire de compte.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Vous avez aussi des sessions de formation personnalisées et un <strong>support direct prioritaire,
              disponible 7 jours sur 7.</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Récapitulatif des offres</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-bold text-lg text-slate-900 mb-3">Offre A - Starter</h3>
                <p className="text-3xl font-bold text-slate-900 mb-2">2 500 €</p>
                <p className="text-sm text-slate-600 mb-3">Licence unique</p>
                <p className="text-xl font-semibold text-blue-600 mb-2">79 €/mois</p>
                <p className="text-sm text-slate-600">Maintenance mensuelle</p>
              </div>

              <div className="text-center bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl p-6 text-white transform scale-105">
                <h3 className="font-bold text-lg mb-3">Offre B - Pro</h3>
                <p className="text-3xl font-bold mb-2">5 000 €</p>
                <p className="text-sm text-blue-100 mb-3">Licence unique</p>
                <p className="text-xl font-semibold mb-2">149 €/mois</p>
                <p className="text-sm text-blue-100 mb-3">Maintenance mensuelle</p>
                <div className="bg-white/20 rounded-lg px-3 py-1 inline-block">
                  <p className="text-xs font-medium">Formation initiale incluse</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg text-slate-900 mb-3">Offre C - Premium</h3>
                <p className="text-3xl font-bold text-slate-900 mb-2">9 000 €</p>
                <p className="text-sm text-slate-600 mb-3">Licence unique</p>
                <p className="text-xl font-semibold text-blue-600 mb-2">299 €/mois</p>
                <p className="text-sm text-slate-600 mb-3">Maintenance mensuelle</p>
                <div className="bg-amber-100 border border-amber-300 rounded-lg px-3 py-1 inline-block">
                  <p className="text-xs font-medium text-amber-900">Support prioritaire + personnalisations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
