import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent, Button } from '../components/ui';
import { Plus, Calendar, CheckSquare, Square, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  property?: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Ajouter boîte à clé demain',
    description: 'Installation nouvelle boîte à clé pour Appartement Lyon Centre',
    dueDate: '2026-03-08',
    priority: 'high',
    completed: false,
    property: 'Appartement Lyon Centre',
  },
  {
    id: 2,
    title: 'Appeler serrurier pour le logement',
    description: 'Problème de serrure à réparer au Studio Paris 15',
    dueDate: '2026-03-09',
    priority: 'high',
    completed: false,
    property: 'Studio Paris 15',
  },
  {
    id: 3,
    title: 'Renouveler stock de linge',
    description: 'Commander 5 kits premium pour les nouvelles réservations',
    dueDate: '2026-03-10',
    priority: 'medium',
    completed: false,
  },
  {
    id: 4,
    title: 'Inspection mensuelle Villa Nice',
    description: 'Vérification complète de la propriété et des équipements',
    dueDate: '2026-03-12',
    priority: 'medium',
    completed: true,
    property: 'Villa Nice Riviera',
  },
  {
    id: 5,
    title: 'Envoi factures propriétaires',
    description: 'Rapport mensuel et reversement pour tous les propriétaires',
    dueDate: '2026-03-15',
    priority: 'low',
    completed: false,
  },
];

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    const labels = {
      high: 'Urgent',
      medium: 'Normal',
      low: 'Faible',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  const filteredTasks = showCompleted ? tasks : tasks.filter(task => !task.completed);

  return (
    <AppLayout
      title="Tâches"
      description="Gérez votre pense-bête et vos rappels"
      actions={
        <Button className="bg-primary-blue hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
            />
            <span className="text-sm text-gray-700">Afficher les tâches terminées</span>
          </label>
        </div>
        <div className="text-sm text-gray-600">
          {tasks.filter(t => !t.completed).length} tâche(s) en cours
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`bg-white border-gray-200 transition-all ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <CardContent>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-primary-green" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 hover:text-primary-blue transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className={`text-lg font-semibold ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getPriorityBadge(task.priority)}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {task.property && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {task.property}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="bg-white border-gray-200">
          <CardContent>
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune tâche
              </h3>
              <p className="text-gray-600">
                {showCompleted
                  ? 'Vous n\'avez aucune tâche pour le moment'
                  : 'Toutes vos tâches sont terminées !'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
