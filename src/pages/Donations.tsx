import React from 'react';
import { Heart, Shield, Users, DollarSign } from 'lucide-react';
import DonationPanel from '../components/DonationPanel';
import PartnershipsPanel from '../components/PartnershipsPanel';

function Donations() {
  const impactStats = [
    {
      icon: Users,
      value: '15,789',
      label: 'Pessoas Ajudadas',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      value: '1,234',
      label: 'Casos Resolvidos',
      color: 'text-green-600'
    },
    {
      icon: Heart,
      value: '890',
      label: 'Doadores Ativos',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Apoie Nossa Causa</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua contribuição ajuda a manter nossa plataforma funcionando e auxilia mais pessoas
            a encontrarem seus entes queridos e recuperarem seus bens.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform"
              >
                <Icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Donation Panel */}
          <div className="lg:col-span-2">
            <DonationPanel />
          </div>

          {/* Partnerships Panel */}
          <div>
            <PartnershipsPanel />
          </div>
        </div>

        {/* How We Use Donations */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Como Utilizamos as Doações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Infraestrutura</h3>
              <p className="text-gray-600">
                Manutenção dos servidores e desenvolvimento de novas funcionalidades
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Suporte</h3>
              <p className="text-gray-600">
                Equipe dedicada para moderar conteúdo e auxiliar usuários
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Segurança</h3>
              <p className="text-gray-600">
                Investimento em ferramentas de proteção e verificação de dados
              </p>
            </div>
          </div>
        </div>

        {/* Transparency Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Transparência</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Nos comprometemos com a total transparência no uso das doações. Mensalmente,
              publicamos relatórios detalhando como os recursos foram utilizados.
            </p>
            <div className="flex justify-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Ver Relatórios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donations;