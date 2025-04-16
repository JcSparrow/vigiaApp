import React, { useState } from 'react';
import { Car, Users, Search, Filter, Share2, MapPin, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import DonationPanel from '../components/DonationPanel';
import CaseCarousel from '../components/CaseCarousel';
import ImpactCounters from '../components/ImpactCounters';

const recentCases = {
  missing: [
    {
      id: '1',
      type: 'person',
      title: 'João Silva - Desaparecido',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80',
      location: 'São Paulo, SP',
      urgency: 'high' as const
    },
    {
      id: '2',
      type: 'person',
      title: 'Maria Santos - Desaparecida',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      location: 'Rio de Janeiro, RJ',
      urgency: 'high' as const
    },
    {
      id: '3',
      type: 'person',
      title: 'Pedro Oliveira - Desaparecido',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      location: 'Belo Horizonte, MG',
      urgency: 'medium' as const
    }
  ],
  vehicles: [
    {
      id: '4',
      type: 'vehicle',
      title: 'Honda Civic Preto - ABC-1234',
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
      location: 'São Paulo, SP',
      urgency: 'high' as const
    },
    {
      id: '5',
      type: 'vehicle',
      title: 'Toyota Corolla Prata - XYZ-5678',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      location: 'Rio de Janeiro, RJ',
      urgency: 'medium' as const
    },
    {
      id: '6',
      type: 'vehicle',
      title: 'Volkswagen Gol Branco - DEF-9012',
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      location: 'Curitiba, PR',
      urgency: 'high' as const
    }
  ],
  items: [
    {
      id: '7',
      type: 'item',
      title: 'Documentos Perdidos - RG e CNH',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80',
      location: 'São Paulo, SP',
      urgency: 'medium' as const
    },
    {
      id: '8',
      type: 'item',
      title: 'Mochila Escolar Perdida',
      image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80',
      location: 'Campinas, SP',
      urgency: 'low' as const
    },
    {
      id: '9',
      type: 'item',
      title: 'Carteira com Documentos',
      image: 'https://images.unsplash.com/photo-1627128625466-721958b01688?auto=format&fit=crop&w=800&q=80',
      location: 'Santos, SP',
      urgency: 'medium' as const
    }
  ]
};

function HomePage() {
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    location: 'all'
  });

  const shareAlert = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'VigiaApp - ' + title,
        text: `Confira este alerta no VigiaApp: ${title}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Ad Banner */}
      <div className="bg-white py-4 shadow-sm">
        <AdBanner size="medium" position="top" />
      </div>

      {/* Search Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar alertas por placa, modelo ou localização..."
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
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
                      <option value="all">Todos os Tipos</option>
                      <option value="vehicle">Veículos</option>
                      <option value="person">Pessoas</option>
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
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Impact Counters */}
        <ImpactCounters />

        {/* Recent Cases Carousels */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Alertas Recentes</h2>
            <div className="text-sm text-gray-500">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Pessoas Desaparecidas</h3>
                <Link to="/missing-persons" className="text-blue-600 hover:text-blue-800">
                  Ver Todos →
                </Link>
              </div>
              <CaseCarousel cases={recentCases.missing} title="" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Veículos Roubados</h3>
                <Link to="/stolen-vehicles" className="text-blue-600 hover:text-blue-800">
                  Ver Todos →
                </Link>
              </div>
              <CaseCarousel cases={recentCases.vehicles} title="" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Perdidos & Achados</h3>
                <Link to="/lost-and-found" className="text-blue-600 hover:text-blue-800">
                  Ver Todos →
                </Link>
              </div>
              <CaseCarousel cases={recentCases.items} title="" />
            </div>
          </div>
        </div>

        {/* Mid-content Ad */}
        <div className="mb-8">
          <AdBanner size="medium" position="content" />
        </div>

        {/* Become a Partner Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Torne-se um Parceiro</h2>
          <p className="text-gray-600 mb-6">
            Interessado em contribuir com nossa causa? Entre em contato para discutir possibilidades de parceria.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Propor Parceria
          </button>
        </div>

        {/* Donation Panel */}
        <div className="mb-8">
          <DonationPanel />
        </div>
      </div>
    </div>
  );
}

export default HomePage;