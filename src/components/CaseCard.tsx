import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, parseISO, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Heart, Share2, Eye, ThumbsUp, AlertTriangle, Car, Package, Clock, FileCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface CaseCardProps {
  id: string;
  type: 'person' | 'vehicle' | 'item';
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  commentsCount: number;
  supportCount: number;
  status: 'active' | 'resolved';
  onSupport: () => void;
  onShare: () => void;
  onClaimItem?: () => void;
}

export default function CaseCard({
  id,
  type,
  title,
  description,
  image,
  date,
  location,
  commentsCount,
  supportCount,
  status,
  onSupport,
  onShare,
  onClaimItem
}: CaseCardProps) {
  const { user } = useAuth();
  const [countdown, setCountdown] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);

  useEffect(() => {
    if (!date || typeof date !== 'string') return;

    try {
      const parsedDate = parseISO(date);
      if (isNaN(parsedDate.getTime())) return;

      // Format the occurrence date
      setFormattedDate(format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }));

      // Update countdown every second
      const updateCountdown = () => {
        const secondsDiff = Math.abs(differenceInSeconds(new Date(), parsedDate));
        const hours = Math.floor(secondsDiff / 3600);
        const minutes = Math.floor((secondsDiff % 3600) / 60);
        const seconds = secondsDiff % 60;
        
        setCountdown(
          `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`
        );
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    } catch (e) {
      console.error('Error parsing date:', e);
    }
  }, [date]);

  const handleSupport = () => {
    if (!user) {
      toast.error('Faça login para apoiar este caso');
      return;
    }
    onSupport();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `VigiaApp - ${title}`,
        text: description,
        url: window.location.origin + '/case/' + id
      });
    } else {
      onShare();
    }
  };

  const handleClaimItem = () => {
    if (!user) {
      toast.error('Faça login para reivindicar este item');
      return;
    }
    setShowClaimForm(true);
  };

  const TypeIcon = {
    person: AlertTriangle,
    vehicle: Car,
    item: Package
  }[type];

  const typeColors = {
    person: 'bg-red-100 text-red-800',
    vehicle: 'bg-blue-100 text-blue-800',
    item: 'bg-green-100 text-green-800'
  }[type];

  const typeLabels = {
    person: 'Desaparecimento',
    vehicle: 'Veículo Roubado',
    item: 'Objeto Perdido'
  }[type];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeColors}`}>
            <TypeIcon className="h-4 w-4 mr-1" />
            {typeLabels}
          </span>
        </div>
        {status === 'active' && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <Eye className="h-4 w-4 mr-1" />
              Caso Ativo
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Ocorrido em: {formattedDate}</span>
          </div>
          <div className="font-mono bg-gray-100 px-2 py-1 rounded">
            Tempo decorrido: {countdown}
          </div>
          <div>{location}</div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link
              to={`/case/${id}#comments`}
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{commentsCount}</span>
            </Link>
            <div className="flex items-center text-gray-600">
              <Heart className="h-4 w-4 mr-1" />
              <span>{supportCount} pessoas estão contigo</span>
            </div>
          </div>
        </div>

        {type === 'item' ? (
          // Lost & Found specific actions
          <div className="grid grid-cols-3 gap-2">
            <Link
              to={`/case/${id}#comments`}
              className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Informações
            </Link>

            <button
              onClick={handleClaimItem}
              className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <FileCheck className="h-4 w-4 mr-1" />
              É Meu
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </button>
          </div>
        ) : (
          // Default actions for other case types
          <div className="grid grid-cols-3 gap-2">
            <Link
              to={`/case/${id}#comments`}
              className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Informações
            </Link>

            <button
              onClick={handleSupport}
              className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Apoiar
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </button>
          </div>
        )}

        {/* Claim Form Modal */}
        {showClaimForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Reivindicar Item</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (onClaimItem) onClaimItem();
                setShowClaimForm(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descreva características específicas do item
                    </label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quando e onde você perdeu o item?
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowClaimForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}