import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';
import {
  getAllLicenseTiers,
  getAllMaintenancePricing,
  formatPrice,
  formatMonthlyPrice,
  LicenseTier,
  LicenseTierInfo,
  MaintenancePricing,
} from '../lib/licenseService';

export function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tier, setTier] = useState<LicenseTier | null>(
    (location.state?.tier as LicenseTier) || null
  );
  const [withMaintenance, setWithMaintenance] = useState(true);
  const [tierInfo, setTierInfo] = useState<LicenseTierInfo | null>(null);
  const [maintenancePricing, setMaintenancePricing] = useState<MaintenancePricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout', tier } });
      return;
    }

    async function fetchData() {
      if (!tier) {
        navigate('/pricing');
        return;
      }

      try {
        const [tiers, pricing] = await Promise.all([
          getAllLicenseTiers(),
          getAllMaintenancePricing(),
        ]);

        const selectedTier = tiers.find((t) => t.tier === tier);
        const selectedPricing = pricing.find((p) => p.tier === tier);

        if (!selectedTier) {
          navigate('/pricing');
          return;
        }

        setTierInfo(selectedTier);
        setMaintenancePricing(selectedPricing || null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tier, user, navigate]);

  const handleCheckout = async () => {
    if (!user || !tierInfo) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripeCheckout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            tier: tierInfo.tier,
            withMaintenance,
            userId: user.id,
            userEmail: user.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Une erreur est survenue lors du paiement');
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!tierInfo) return 0;
    return tierInfo.perpetual_price / 100;
  };

  const calculateFirstYearTotal = () => {
    if (!tierInfo || !maintenancePricing || !withMaintenance) return calculateTotal();
    const license = tierInfo.perpetual_price / 100;
    const maintenance = (maintenancePricing.first_year_price / 100) * 12;
    return license + maintenance;
  };

  const calculateSavings = () => {
    if (!maintenancePricing || !withMaintenance) return 0;
    return ((maintenancePricing.standard_price - maintenancePricing.first_year_price) / 100) * 12;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!tierInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux offres
        </button>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Finaliser votre commande</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Votre licence</h2>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Licence {tierInfo.name}
                      </h3>
                      <p className="text-sm text-slate-600">{tierInfo.description}</p>
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                      {formatPrice(tierInfo.perpetual_price)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Licence perpétuelle - Valide à vie</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Options de maintenance
                </h2>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      checked={!withMaintenance}
                      onChange={() => setWithMaintenance(false)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">Licence seule</div>
                      <p className="text-sm text-slate-600 mt-1">
                        Accès à vie aux fonctionnalités actuelles. Vous pourrez ajouter la
                        maintenance plus tard.
                      </p>
                    </div>
                  </label>

                  {maintenancePricing && (
                    <label className="flex items-start gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        checked={withMaintenance}
                        onChange={() => setWithMaintenance(true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">
                            Avec maintenance
                          </span>
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Recommandé
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-lg font-bold text-blue-700">
                            {formatMonthlyPrice(maintenancePricing.first_year_price)}
                          </span>
                          <span className="text-sm line-through text-slate-400">
                            {formatMonthlyPrice(maintenancePricing.standard_price)}
                          </span>
                          <span className="text-xs font-semibold text-green-700">
                            -50% an 1
                          </span>
                        </div>
                        <ul className="text-sm text-slate-700 space-y-1 mb-3">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            Accès à toutes les nouvelles fonctionnalités
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            Support prioritaire
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            Mises à jour de sécurité
                          </li>
                        </ul>
                        <p className="text-xs text-slate-600">
                          Puis {formatMonthlyPrice(maintenancePricing.standard_price)} après 12
                          mois. Annulable à tout moment.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Récapitulatif</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-slate-700">
                    <span>Licence {tierInfo.name}</span>
                    <span className="font-semibold">
                      {formatPrice(tierInfo.perpetual_price)}
                    </span>
                  </div>

                  {withMaintenance && maintenancePricing && (
                    <div className="text-sm text-slate-600">
                      <div className="flex justify-between mb-1">
                        <span>Maintenance (mois 1-12)</span>
                        <span>{formatMonthlyPrice(maintenancePricing.first_year_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Puis à partir du mois 13</span>
                        <span>{formatMonthlyPrice(maintenancePricing.standard_price)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Aujourd'hui</span>
                    <span>{formatPrice(tierInfo.perpetual_price)}</span>
                  </div>

                  {withMaintenance && maintenancePricing && (
                    <>
                      <div className="text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Total première année</span>
                          <span className="font-semibold">
                            {calculateFirstYearTotal().toFixed(0)}€
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-green-900">
                          Vous économisez {calculateSavings().toFixed(0)}€
                        </p>
                        <p className="text-xs text-green-700">la première année de maintenance</p>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    'Procéder au paiement'
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Paiement sécurisé par Stripe
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
