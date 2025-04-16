import React from 'react';
import { Building2, Shield, Users, ExternalLink } from 'lucide-react';

export default function PartnershipsPanel() {
  const partners = [
    {
      name: 'Polícia Civil',
      type: 'Segurança',
      icon: Shield,
      description: 'Parceria oficial para agilizar investigações e buscas.'
    },
    {
      name: 'ONG Busca & Proteção',
      type: 'ONG',
      icon: Users,
      description: 'Suporte em buscas e apoio às famílias.'
    },
    {
      name: 'Detran-SP',
      type: 'Governo',
      icon: Building2,
      description: 'Integração com banco de dados de veículos.'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Parceiros Institucionais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partners.map((partner) => {
          const Icon = partner.icon;
          return (
            <div key={partner.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Icon className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="font-medium">{partner.name}</h3>
              </div>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                {partner.type}
              </span>
              <p className="text-gray-600 text-sm">
                {partner.description}
              </p>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center">
                Saiba mais
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Torne-se um Parceiro</h3>
        <p className="text-gray-600 mb-4">
          Interessado em contribuir com nossa causa? Entre em contato para discutir possibilidades de parceria.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Propor Parceria
        </button>
      </div>
    </div>
  );
}