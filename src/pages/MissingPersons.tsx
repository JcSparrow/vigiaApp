import React, { useState } from 'react';
import { MapPin, Search, Filter, Calendar, AlertTriangle } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

function MissingPersons() {
  const [filters, setFilters] = useState({
    gender: 'all',
    ageRange: 'all',
    location: 'all',
    status: 'all'
  });

  const missingPersons = [
    {
      id: '1',
      name: 'João Silva',
      age: 25,
      photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80',
      lastSeen: new Date('2024-03-10'),
      location: 'São Paulo, SP',
      description: 'Visto pela última vez no centro da cidade',
      status: 'active',
      gender: 'male'
    },
    {
      id: '2',
      name: 'Maria Santos',
      age: 17,
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      lastSeen: new Date('2024-03-09'),
      location: 'Rio de Janeiro, RJ',
      description: 'Desapareceu a caminho da escola',
      status: 'active',
      gender: 'female'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pessoas Desaparecidas</h1>
          <Link
            to="/report"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Reportar Desaparecimento
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
                placeholder="Buscar por nome, idade, local..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todos os Gêneros</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                  </select>
                  <select
                    value={filters.ageRange}
                    onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todas as Idades</option>
                    <option value="child">Criança (0-12)</option>
                    <option value="teen">Adolescente (13-17)</option>
                    <option value="adult">Adulto (18+)</option>
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
                    <option value="resolved">Resolvidos</option>
                  </select>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        {/* Missing Persons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPersons.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Urgente
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{person.name}</h3>
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(person.lastSeen, "d 'de' MMMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{person.location}</span>
                  </div>
                  <div>Idade: {person.age} anos</div>
                </div>
                <p className="text-gray-600 mb-4">{person.description}</p>
                <Link
                  to={`/case/${person.id}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
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

export default MissingPersons;