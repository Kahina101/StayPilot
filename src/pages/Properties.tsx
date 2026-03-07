import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent, Button } from '../components/ui';
import { Plus, Search, Filter, MoreVertical, CreditCard as Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const propertiesData = [
  {
    id: 1,
    photo: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    name: 'Appartement Lyon Centre',
    owner: 'Sophie Lavandier',
    address: '15 Rue de la République, 69002 Lyon',
    linen: 'Kit Standard',
    keyBox: 'B-042',
  },
  {
    id: 2,
    photo: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    name: 'Studio Paris 15',
    owner: 'Alexandre Beaumont',
    address: '28 Avenue de Suffren, 75015 Paris',
    linen: 'Kit Premium',
    keyBox: 'A-018',
  },
  {
    id: 3,
    photo: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    name: 'Villa Nice Riviera',
    owner: 'Camille Deveraux',
    address: '42 Promenade des Anglais, 06000 Nice',
    linen: 'Kit Luxe',
    keyBox: 'C-125',
  },
  {
    id: 4,
    photo: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    name: 'Loft Bordeaux Centre',
    owner: 'Marc Fontaine',
    address: '8 Cours de l\'Intendance, 33000 Bordeaux',
    linen: 'Kit Standard',
    keyBox: 'D-089',
  },
  {
    id: 5,
    photo: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    name: 'T2 Marseille Vieux-Port',
    owner: 'Isabelle Moreau',
    address: '12 Quai du Port, 13002 Marseille',
    linen: 'Kit Standard',
    keyBox: 'E-203',
  },
];

export function Properties() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AppLayout
      title="Logements"
      description="Gérez l'ensemble de vos propriétés"
      actions={
        <Button className="bg-primary-blue hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau logement
        </Button>
      }
    >
      <Card className="bg-white border-gray-200">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un logement..."
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Photo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Logement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nom propriétaire</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Adresse</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Linge</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Boîtier</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {propertiesData.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4">
                      <img
                        src={property.photo}
                        alt={property.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{property.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{property.owner}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 text-sm">{property.address}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {property.linen}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {property.keyBox}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-primary-blue" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Affichage de {propertiesData.length} logements
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
