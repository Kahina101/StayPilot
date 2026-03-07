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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Choisissez votre croissance
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Une licence perpétuelle. Des économies de temps mesurables. Une croissance sans limites.
          </p>

          <div className="inline-block bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">
                Votre taux horaire:
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                max="500"
              />
              <span className="text-sm text-slate-600">€/heure</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => {
            const roi12Months = calculateROI(tier, 12);
            const features = getFeaturesByTier(tier.tier);
            const isPremium = tier.tier === 'premium';

            return (
              <Card
                key={tier.tier}
                className={`relative ${
                  isPremium ? 'ring-2 ring-amber-500 shadow-2xl scale-105' : ''
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Gestionnaire de Prestige
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${getTierColor(
                      tier.tier
                    )} text-white mb-4`}
                  >
                    {getTierIcon(tier.tier)}
                    <span className="font-semibold">{tier.name}</span>
                  </div>

                  <p className="text-slate-600 mb-6 min-h-[3rem]">{tier.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-900">
                        {formatPrice(tier.perpetual_price)}
                      </span>
                      <span className="text-slate-600">une fois</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Licence perpétuelle - À vie</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-900">
                        Économisez {tier.time_saved_weekly}h/semaine
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Gérez jusqu'à {tier.max_properties === 999 ? 'illimité' : tier.max_properties} logements
                    </p>
                  </div>

                  {tier.maintenancePricing && (
                    <div className="border border-slate-200 rounded-lg p-4 mb-6">
                      <p className="text-sm font-semibold text-slate-900 mb-2">
                        Maintenance optionnelle
                      </p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatMonthlyPrice(tier.maintenancePricing.first_year_price)}
                        </span>
                        <span className="text-sm line-through text-slate-400">
                          {formatMonthlyPrice(tier.maintenancePricing.standard_price)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        Première année - 50% de réduction
                      </p>
                      <p className="text-xs text-slate-500">
                        Puis {formatMonthlyPrice(tier.maintenancePricing.standard_price)}
                      </p>
                      <div className="mt-2 bg-green-50 border border-green-200 rounded px-2 py-1">
                        <p className="text-xs font-medium text-green-700">
                          Économisez{' '}
                          {formatPrice(
                            (tier.maintenancePricing.standard_price -
                              tier.maintenancePricing.first_year_price) *
                              12
                          )}{' '}
                          la 1ère année
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      ROI sur 12 mois
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      +{roi12Months.toFixed(0)}€
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Temps gagné valorisé à {hourlyRate}€/h
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate('/checkout', { state: { tier: tier.tier } })}
                    variant={isPremium ? 'primary' : 'outline'}
                    className={`w-full mb-6 ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                        : ''
                    }`}
                  >
                    Commencer avec {tier.name}
                  </Button>

                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            Modèle transparent et prévisible
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Licence perpétuelle
              </h3>
              <p className="text-slate-600 mb-4">
                Vous achetez votre licence une seule fois et elle reste valide à vie. Aucun
                abonnement forcé, aucune surprise.
              </p>
              <p className="text-slate-600">
                Toutes les fonctionnalités disponibles au moment de l'achat restent accessibles
                pour toujours, même sans maintenance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Maintenance optionnelle
              </h3>
              <p className="text-slate-600 mb-4">
                La maintenance vous donne accès aux nouvelles fonctionnalités et au support
                prioritaire. Tarif promotionnel la première année pour faciliter votre démarrage.
              </p>
              <p className="text-slate-600">
                Vous pouvez annuler et réactiver quand vous voulez. Chaque réactivation bénéficie
                du tarif promotionnel pour 12 mois.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Besoin d'un upgrade ?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Vous pouvez upgrader votre licence à tout moment. Contactez-nous et nous gérerons
            votre transition en toute transparence.
          </p>
          <Button
            onClick={() => navigate('/contact')}
            variant="outline"
            className="bg-white text-blue-600 hover:bg-slate-50"
          >
            Contactez-nous
          </Button>
        </div>
      </div>
    </div>
  );
}
