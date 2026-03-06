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
    label: 'Projets actifs',
    value: '12',
    change: '+2 ce mois',
    icon: FolderKanban,
    color: 'bg-electric-violet/20 text-electric-violet',
  },
  {
    label: 'Membres equipe',
    value: '8',
    change: '+1 cette semaine',
    icon: Users,
    color: 'bg-electric-violet/20 text-electric-violet',
  },
  {
    label: 'Taches terminees',
    value: '47',
    change: '+12 cette semaine',
    icon: CheckCircle2,
    color: 'bg-deep-blue/50 text-white',
  },
  {
    label: 'Taux completion',
    value: '78%',
    change: '+5% vs mois dernier',
    icon: TrendingUp,
    color: 'bg-electric-violet/20 text-electric-violet',
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'Projet "Refonte site" mis a jour',
    time: 'Il y a 2 heures',
    icon: FolderKanban,
  },
  {
    id: 2,
    action: 'Marie Dupont a rejoint l\'equipe',
    time: 'Il y a 5 heures',
    icon: Users,
  },
  {
    id: 3,
    action: 'Tache "Design maquettes" terminee',
    time: 'Hier',
    icon: CheckCircle2,
  },
  {
    id: 4,
    action: 'Nouveau rapport analytique disponible',
    time: 'Il y a 2 jours',
    icon: BarChart3,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Reunion equipe produit',
    dueDate: 'Aujourd\'hui, 14h00',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Revue de code sprint 12',
    dueDate: 'Demain, 10h00',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Livraison maquettes v2',
    dueDate: '18 fevrier',
    priority: 'high',
  },
  {
    id: 4,
    title: 'Point client mensuel',
    dueDate: '20 fevrier',
    priority: 'low',
  },
];

const priorityColors = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-white/10 text-white/60',
};

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
          <Card key={stat.label} className="hover:shadow-glow transition-all group">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.color} group-hover:shadow-neon transition-all`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-white/60 mt-1">{stat.label}</p>
              <p className="text-xs text-electric-violet mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activite recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="p-2 glass-effect rounded-lg group-hover:shadow-neon-sm transition-all">
                    <activity.icon className="w-4 h-4 text-electric-violet" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-white/50">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-electric-violet/20">
              <Button variant="ghost" size="sm" className="w-full">
                Voir toute l'activite
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Taches a venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-electric-violet/20 hover:border-electric-violet/50 hover:shadow-neon-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {task.title}
                    </p>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                      {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Faible'}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-electric-violet/20">
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
        <Card>
          <CardHeader>
            <CardTitle>Acces rapides</CardTitle>
            <CardDescription>
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
                  className="flex items-center gap-3 p-4 rounded-xl glass-effect hover:shadow-neon transition-all group"
                >
                  <item.icon className="w-5 h-5 text-electric-violet group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white">{item.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Details de votre profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between py-2 border-b border-electric-violet/20">
                <dt className="text-white/60">Nom</dt>
                <dd className="font-medium text-white">
                  {profile?.full_name || 'Non renseigne'}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-electric-violet/20">
                <dt className="text-white/60">Email</dt>
                <dd className="font-medium text-white">{user?.email}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-electric-violet/20">
                <dt className="text-white/60">Membre depuis</dt>
                <dd className="font-medium text-white">{createdAt}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-white/60">Statut</dt>
                <dd className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-electric-violet/20 text-electric-violet shadow-neon-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-violet shadow-neon-sm animate-glow-pulse" />
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
