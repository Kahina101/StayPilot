import { ReactNode } from 'react';
import { useLicenseAccess } from '../hooks/useLicense';
import { Alert } from './ui/Alert';
import { Spinner } from './ui/Spinner';

interface FeatureGateProps {
  featureName: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ featureName, children, fallback }: FeatureGateProps) {
  const { hasAccess, reason, loading } = useLicenseAccess(featureName);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    let message = 'Accès refusé à cette fonctionnalité.';
    let title = 'Accès limité';

    switch (reason) {
      case 'no_license':
        title = 'Licence requise';
        message = 'Cette fonctionnalité nécessite une licence active. Consultez nos offres pour démarrer.';
        break;
      case 'tier_too_low':
        title = 'Upgrade nécessaire';
        message = 'Cette fonctionnalité est disponible uniquement avec une licence supérieure. Contactez-nous pour un upgrade.';
        break;
      case 'maintenance_required':
        title = 'Maintenance requise';
        message = 'Cette fonctionnalité a été ajoutée après votre dernière période de maintenance. Réactivez la maintenance pour y accéder.';
        break;
      case 'not_authenticated':
        title = 'Authentification requise';
        message = 'Veuillez vous connecter pour accéder à cette fonctionnalité.';
        break;
    }

    return (
      <div className="p-6">
        <Alert variant="warning" title={title}>
          {message}
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
