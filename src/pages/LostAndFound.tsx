import React, { useState } from 'react';
import { MapPin, Search, Filter, Plus } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function LostAndFound() {
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    location: 'all'
  });

  const items = [
    {
      id: '1',
      title: 'Carteira encontrada',
      description: 'Encontrada na Praça da República',
      location: 'São Paulo, SP',
      createdAt: new Date('2024-03-10'),
      type: 'found'
    },
    {
      id: '2',
      title: 'Documentos perdidos',
      description: 'RG e CPF perdidos no centro',
      location: 'Rio de Janeiro, RJ',
      createdAt: new Date('2024-03-09'),
      type: 'lost'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Perdidos e Achados</h1>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Publicar Item
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por tipo, localização..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="lost">Perdidos</option>
                    <option value="found">Encontrados</option>
                  </select>
                  <select
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="all">Todas as Datas</option>
                    <option value="today">Hoje</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
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
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  item.type === 'found' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.type === 'found' ? 'Encontrado' : 'Perdido'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{item.location}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Publicado em {format(item.createdAt, "d 'de' MMMM", { locale: ptBR })}
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Entrar em contato
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LostAndFound;