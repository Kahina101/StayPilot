import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent, Button } from '../components/ui';
import { Plus, Search, Filter, Calendar, User, Home } from 'lucide-react';
import { useState } from 'react';

const reservationsData = [
  {
    id: 1,
    property: 'Appartement Lyon Centre',
    guest: 'Marie Dubois',
    checkIn: '2026-03-10',
    checkOut: '2026-03-15',
    status: 'confirmed',
    price: '850€',
    platform: 'Airbnb',
  },
  {
    id: 2,
    property: 'Studio Paris 15',
    guest: 'Jean Martin',
    checkIn: '2026-03-12',
    checkOut: '2026-03-18',
    status: 'pending',
    price: '1,200€',
    platform: 'Booking.com',
  },
  {
    id: 3,
    property: 'Villa Nice Riviera',
    guest: 'Thomas Bernard',
    checkIn: '2026-03-14',
    checkOut: '2026-03-21',
    status: 'confirmed',
    price: '2,500€',
    platform: 'Airbnb',
  },
  {
    id: 4,
    property: 'Loft Bordeaux Centre',
    guest: 'Sophie Rousseau',
    checkIn: '2026-03-16',
    checkOut: '2026-03-20',
    status: 'confirmed',
    price: '980€',
    platform: 'Abritel',
  },
  {
    id: 5,
    property: 'T2 Marseille Vieux-Port',
    guest: 'Pierre Leroy',
    checkIn: '2026-03-18',
    checkOut: '2026-03-25',
    status: 'pending',
    price: '1,150€',
    platform: 'Booking.com',
  },
];

export function Reservations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = {
      confirmed: 'Confirmée',
      pending: 'En attente',
      cancelled: 'Annulée',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AppLayout
      title="Réservations"
      description="Gérez toutes vos réservations"
      actions={
        <Button className="bg-primary-blue hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle réservation
        </Button>
      }
    >
      <Card className="bg-white border-gray-200">
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une réservation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Logement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Voyageur</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plateforme</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prix</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservationsData.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{reservation.property}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{reservation.guest}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">
                        {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">
                        {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {reservation.platform}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{reservation.price}</span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Affichage de {reservationsData.length} réservations
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                Précédent
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
