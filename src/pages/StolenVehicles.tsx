import React, { useState } from 'react';
import { MapPin, Search, Filter, Calendar, Car } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

function StolenVehicles() {
  const [filters, setFilters] = useState({
    make: 'all',
    type: 'all',
    location: 'all',
    status: 'all'
  });

  const vehicles = [
    {
      id: '1',
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      color: 'Preto',
      plate: 'ABC-1234',
      photo: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
      stolenAt: new Date('2024-03-10'),
      location: 'São Paulo, SP',
      description: 'Roubado no estacionamento do shopping',
      status: 'active'
    },
    {
      id: '2',
      make: 'Toyota',
      model: 'Corolla',
      year: 2023,
      color: 'Prata',
      plate: 'XYZ-5678',
      photo: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      stolenAt: new Date('2024-03-09'),
      location: 'Rio de Janeiro, RJ',
      description: 'Roubado durante assalto à mão armada',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Veículos Roubados</h1>
          <Link
            to="/report"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Reportar Roubo
          </Link>
        </div>

        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner size="medium" position="top" />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por placa, modelo, marca..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                <div className="space-y-2">
                  <select
                    value={filters.make}
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todas as Marcas</option>
                    <option value="honda">Honda</option>
                    <option value="toyota">Toyota</option>
                    <option value="volkswagen">Volkswagen</option>
                  </select>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="car">Carro</option>
                    <option value="motorcycle">Moto</option>
                    <option value="truck">Caminhão</option>
                  </select>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todas as Localizações</option>
                    <option value="sp">São Paulo</option>
                    <option value="rj">Rio de Janeiro</option>
                  </select>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="recovered">Recuperados</option>
                  </select>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={vehicle.photo}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <Car className="h-4 w-4 mr-1" />
                    Roubado
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h3>
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(vehicle.stolenAt, "d 'de' MMMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div>Placa: {vehicle.plate}</div>
                  <div>Cor: {vehicle.color}</div>
                </div>
                <p className="text-gray-600 mb-4">{vehicle.description}</p>
                <Link
                  to={`/case/${vehicle.id}`}
                  className="block w-full bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Ad */}
        <div className="mt-8">
          <AdBanner size="medium" position="content" />
        </div>
      </div>
    </div>
  );
}

export default StolenVehicles;