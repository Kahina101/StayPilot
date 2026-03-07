import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getLicenseInfo,
  checkFeatureAccess,
  isUserAdmin,
  LicenseInfo,
} from '../lib/licenseService';

export function useLicense() {
  const { user } = useAuth();
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLicense() {
      if (!user) {
        setLicenseInfo(null);
        setLoading(false);
        return;
      }

      try {
        const info = await getLicenseInfo(user.id);
        setLicenseInfo(info);
      } catch (error) {
        console.error('Error fetching license:', error);
        setLicenseInfo(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLicense();
  }, [user]);

  return { licenseInfo, loading };
}

export function useLicenseAccess(featureName: string) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setHasAccess(false);
        setReason('not_authenticated');
        setLoading(false);
        return;
      }

      try {
        const result = await checkFeatureAccess(user.id, featureName);
        setHasAccess(result.hasAccess);
        setReason(result.reason);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
        setReason('error');
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [user, featureName]);

  return { hasAccess, reason, loading };
}

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const admin = await isUserAdmin(user.id);
        setIsAdmin(admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}
