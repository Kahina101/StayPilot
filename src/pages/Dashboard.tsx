import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '../components/ui';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  FolderKanban,
  ArrowRight,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react';

const quickStats = [
  {
    label: 'Revenus ce mois',
    value: '24 500 €',
    change: '+12,5%',
    icon: TrendingUp,
  },
  {
    label: 'Taux occupation',
    value: '87%',
    change: '+5,2%',
    icon: FolderKanban,
  },
  {
    label: 'Note moyenne',
    value: '4.8/5',
    change: '+0,2',
    icon: CheckCircle2,
  },
  {
    label: 'Logements actifs',
    value: '32',
    change: '+4',
    icon: Users,
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'Nouvelle reservation - Appartement Lyon Centre',
    time: 'Il y a 2 heures',
    icon: CheckCircle2,
  },
  {
    id: 2,
    action: 'Paiement recu - 1 850 €',
    time: 'Il y a 5 heures',
    icon: TrendingUp,
  },
  {
    id: 3,
    action: 'Nouveau locataire verifie et approuve',
    time: 'Hier',
    icon: Users,
  },
  {
    id: 4,
    action: 'Rapport mensuel genere avec succes',
    time: 'Il y a 2 jours',
    icon: BarChart3,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Check-out appartement Marseille',
    dueDate: 'Aujourd\'hui, 14h00',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Visite technique studio Paris 15',
    dueDate: 'Demain, 10h00',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Renouvellement bail - M. Durand',
    dueDate: '18 mars',
    priority: 'high',
  },
  {
    id: 4,
    title: 'Rapport trimestriel proprietaires',
    dueDate: '20 mars',
    priority: 'low',
  },
];


export function Dashboard() {
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur';
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const hour = new Date().getHours();
  let greeting = 'Bonjour';
  if (hour >= 18) greeting = 'Bonsoir';
  else if (hour < 6) greeting = 'Bonne nuit';

  return (
    <AppLayout
      title="Tableau de bord"
      description={`${greeting}, ${displayName}. Voici un apercu de votre activite.`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 hover:shadow-medium transition-all group">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-primary-blue/10 group-hover:shadow-soft transition-all`}>
                  <stat.icon className="w-5 h-5 text-primary-blue" />
                </div>
              </div>
              <p className="text-2xl font-bold text-primary-blue">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <p className="text-xs text-primary-green mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Activity className="w-5 h-5 text-primary-blue" />
              Activite recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:shadow-soft transition-all">
                    <activity.icon className="w-4 h-4 text-primary-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full">
                Voir toute l'activite
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5 text-orange-600" />
              Taches a venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-white border border-orange-200 hover:border-orange-300 hover:shadow-soft transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {task.title}
                    </p>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Faible'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-orange-200">
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="w-full">
                  Voir tous les projets
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Acces rapides</CardTitle>
            <CardDescription className="text-gray-600">
              Raccourcis vers les fonctionnalites principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Analytiques', href: '/analytics', icon: BarChart3 },
                { label: 'Projets', href: '/projects', icon: FolderKanban },
                { label: 'Equipe', href: '/team', icon: Users },
                { label: 'Parametres', href: '/settings', icon: Activity },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white hover:shadow-soft transition-all group border border-purple-200"
                >
                  <item.icon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-900">{item.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Informations du compte</CardTitle>
            <CardDescription className="text-gray-600">
              Details de votre profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <dt className="text-gray-600">Nom</dt>
                <dd className="font-medium text-gray-900">
                  {profile?.full_name || 'Non renseigne'}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <dt className="text-gray-600">Email</dt>
                <dd className="font-medium text-gray-900">{user?.email}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <dt className="text-gray-600">Membre depuis</dt>
                <dd className="font-medium text-gray-900">{createdAt}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-gray-600">Statut</dt>
                <dd className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                  Actif
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
