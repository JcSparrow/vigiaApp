import React, { useState } from 'react';
import { Heart, Coffee, DollarSign, Shield } from 'lucide-react';

export default function DonationPanel() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const donationAmounts = [
    { value: 10, icon: Coffee, label: 'Café' },
    { value: 25, icon: Heart, label: 'Apoio' },
    { value: 50, icon: Shield, label: 'Protetor' }
  ];

  const handleDonate = () => {
    const amount = selectedAmount || Number(customAmount);
    // Implement payment processing here
    console.log('Processing donation:', amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-2">Apoie o VigiaApp</h2>
        <p className="text-gray-600">
          Sua contribuição ajuda a manter nossa plataforma funcionando e auxilia mais pessoas a encontrarem seus entes queridos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {donationAmounts.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setSelectedAmount(value)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedAmount === value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Icon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="font-medium">R$ {value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Outro valor
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Digite um valor personalizado"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={handleDonate}
        disabled={!selectedAmount && !customAmount}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
      >
        Contribuir Agora
      </button>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Pagamento processado de forma segura via PIX ou cartão de crédito.</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/76/Pix_logo.svg" alt="PIX" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
        </div>
      </div>
    </div>
  );
}