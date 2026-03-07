import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { LicenseManagement } from '../components/LicenseManagement';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Alert } from '../components/ui';
import {
  User,
  Shield,
  Save,
  AlertTriangle,
  LogOut,
  Trash2,
  Bell,
  X,
} from 'lucide-react';

export function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const { error } = await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') return;
    setShowDeleteModal(false);
  };

  return (
    <AppLayout
      title="Parametres"
      description="Gerez votre compte et vos preferences."
    >
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations du profil
            </CardTitle>
            <CardDescription>
              Mettez a jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-6">
                Profil mis a jour avec succes !
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName || 'Avatar'}
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    label="URL de l'avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://exemple.com/avatar.jpg"
                    hint="Entrez l'URL d'une image pour votre avatar"
                  />
                </div>
              </div>

              <Input
                label="Nom complet"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jean Dupont"
              />

              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                hint="L'email ne peut pas etre modifie"
              />

              <div className="flex justify-end">
                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos preferences de notification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Notifications par email', description: 'Recevoir des mises a jour par email', defaultChecked: true },
                { label: 'Alertes de securite', description: 'Etre notifie des connexions suspectes', defaultChecked: true },
                { label: 'Newsletter', description: 'Recevoir notre newsletter mensuelle', defaultChecked: false },
                { label: 'Mises a jour produit', description: 'Etre informe des nouvelles fonctionnalites', defaultChecked: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.defaultChecked}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Securite
            </CardTitle>
            <CardDescription>
              Informations sur la securite de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <dt className="text-slate-600">Methode de connexion</dt>
                <dd className="font-medium text-slate-900">
                  {user?.app_metadata?.provider === 'google' ? 'Google' : 'Email / Mot de passe'}
                </dd>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <dt className="text-slate-600">Derniere connexion</dt>
                <dd className="font-medium text-slate-900">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-slate-600">ID du compte</dt>
                <dd className="font-mono text-sm text-slate-500 truncate max-w-[250px]">
                  {user?.id}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <LicenseManagement />

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Session
            </CardTitle>
            <CardDescription>
              Gerez votre session active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Deconnectez-vous de votre compte sur cet appareil.
            </p>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Se deconnecter
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Zone de danger
            </CardTitle>
            <CardDescription className="text-red-600">
              Actions irreversibles sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg border border-red-200">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Supprimer mon compte</h4>
                  <p className="text-sm text-slate-600 mt-1 mb-4">
                    Cette action est irreversible. Toutes vos donnees seront definitivement supprimees.
                  </p>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Supprimer votre compte ?
              </h3>
              <p className="text-slate-600 mt-2">
                Cette action est irreversible. Toutes vos donnees, projets et historique seront definitivement supprimes.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tapez <span className="font-bold text-red-600">SUPPRIMER</span> pour confirmer
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="SUPPRIMER"
              />
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={deleteConfirmation !== 'SUPPRIMER'}
                onClick={handleDeleteAccount}
              >
                Supprimer definitivement
              </Button>
              <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
