import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Clock, Copy, Check, Calendar, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Alert } from './ui';
import { useLicense } from '../hooks/useLicense';
import {
  formatPrice,
  formatMonthlyPrice,
  calculateDaysRemaining,
  calculateMonthlySavings,
} from '../lib/licenseService';

export function LicenseManagement() {
  const navigate = useNavigate();
  const { licenseInfo, loading } = useLicense();
  const [copied, setCopied] = useState(false);

  const handleCopyLicenseKey = () => {
    if (licenseInfo?.license?.license_key) {
      navigator.clipboard.writeText(licenseInfo.license.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleManageMaintenance = async () => {
    const { data: { session } } = await (await import('../lib/supabase')).supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!licenseInfo?.license) {
    return (
      <Card className="border-2 border-dashed border-slate-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Aucune licence active
          </CardTitle>
          <CardDescription>
            Vous n'avez pas encore de licence. Consultez nos offres pour démarrer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/pricing')}>
            Découvrir les offres
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { license, maintenance, tierInfo, maintenancePricing, hasActiveMaintenance } = licenseInfo;
  const daysRemaining = maintenance?.current_period_end
    ? calculateDaysRemaining(maintenance.current_period_end)
    : 0;
  const isFirstYear = maintenance?.is_first_year || false;

  const monthlySavings =
    isFirstYear && maintenancePricing
      ? calculateMonthlySavings(maintenancePricing.first_year_price, maintenancePricing.standard_price)
      : 0;

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Ma licence
          </CardTitle>
          <CardDescription>
            Informations sur votre licence perpétuelle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-600 mb-1">Type de licence</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-lg font-semibold ${getTierBadgeColor(
                    license.tier
                  )}`}
                >
                  {tierInfo?.name || license.tier}
                </span>
                {license.tier === 'premium' && (
                  <span className="text-xs text-amber-600 font-medium">Gestionnaire de Prestige</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Statut</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Check className="w-3.5 h-3.5 mr-1" />
                Active
              </span>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Clé de licence</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-slate-100 rounded font-mono text-sm">
                {license.license_key}
              </code>
              <button
                onClick={handleCopyLicenseKey}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Copier la clé"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Date d'achat</p>
              <p className="font-medium text-slate-900">
                {new Date(license.purchase_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            {tierInfo && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Logements max</p>
                <p className="font-medium text-slate-900">
                  {tierInfo.max_properties === 999 ? 'Illimité' : tierInfo.max_properties}
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-1">Licence perpétuelle</p>
            <p className="text-xs text-blue-700">
              Votre licence reste valide à vie. Toutes les fonctionnalités disponibles au moment de
              l'achat restent accessibles pour toujours.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Maintenance
          </CardTitle>
          <CardDescription>
            Accès aux nouvelles fonctionnalités et support prioritaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasActiveMaintenance && maintenance ? (
            <>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Statut de la maintenance</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg font-semibold bg-green-600 text-white">
                    <Check className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
                {isFirstYear && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg font-semibold bg-orange-500 text-white">
                    <Clock className="w-4 h-4 mr-1" />
                    Tarif promotionnel
                  </span>
                )}
              </div>

              {isFirstYear && maintenancePricing && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-orange-900 mb-1">
                        Vous payez {formatMonthlyPrice(maintenancePricing.first_year_price)} au lieu
                        de {formatMonthlyPrice(maintenancePricing.standard_price)}
                      </p>
                      <p className="text-sm text-orange-700 mb-2">
                        Économies: {formatMonthlyPrice(monthlySavings)} pendant{' '}
                        {Math.ceil(daysRemaining / 30)} mois restants
                      </p>
                      <p className="text-xs text-orange-600">
                        Le tarif standard de {formatMonthlyPrice(maintenancePricing.standard_price)}{' '}
                        s'appliquera après le{' '}
                        {new Date(
                          new Date(maintenance.current_period_start).getTime() +
                            365 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isFirstYear && maintenancePricing && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-1">Tarif standard actif</p>
                  <p className="text-sm text-blue-700">
                    Vous payez actuellement {formatMonthlyPrice(maintenancePricing.standard_price)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Prochain paiement
                  </p>
                  <p className="font-medium text-slate-900">
                    {new Date(maintenance.current_period_end).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Montant</p>
                  <p className="font-medium text-slate-900">
                    {maintenancePricing &&
                      formatMonthlyPrice(
                        isFirstYear
                          ? maintenancePricing.first_year_price
                          : maintenancePricing.standard_price
                      )}
                  </p>
                </div>
              </div>

              <Button variant="outline" fullWidth onClick={handleManageMaintenance}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Gérer ma maintenance
              </Button>
            </>
          ) : (
            <>
              {license.frozen_features_date && (
                <Alert variant="warning">
                  <AlertCircle className="w-4 h-4" />
                  <div className="ml-2">
                    <p className="font-medium">Maintenance inactive</p>
                    <p className="text-sm mt-1">
                      Votre licence reste valide à vie. Les fonctionnalités ajoutées après le{' '}
                      {new Date(license.frozen_features_date).toLocaleDateString('fr-FR')}{' '}
                      nécessitent la maintenance.
                    </p>
                  </div>
                </Alert>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-900 mb-2">
                  Souscrivez à la maintenance pour accéder à:
                </p>
                <ul className="space-y-1 text-sm text-slate-700 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Toutes les nouvelles fonctionnalités
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
                {maintenancePricing && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                    <p className="text-sm font-semibold text-green-900">
                      Tarif promotionnel: {formatMonthlyPrice(maintenancePricing.first_year_price)}
                    </p>
                    <p className="text-xs text-green-700">
                      50% de réduction pendant 12 mois, puis{' '}
                      {formatMonthlyPrice(maintenancePricing.standard_price)}
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={() =>
                  navigate('/checkout', { state: { tier: license.tier, maintenanceOnly: true } })
                }
                fullWidth
              >
                Souscrire à la maintenance
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 mb-1">Besoin d'un upgrade ?</h4>
              <p className="text-sm text-slate-600 mb-4">
                Pour upgrader votre licence vers un tier supérieur, contactez-nous. Nous gérerons
                votre transition de manière transparente.
              </p>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Demander un upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
