import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bell, 
  Share2, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Flag, 
  ChevronLeft,
  Phone,
  Mail,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdBanner from '../components/AdBanner';
import Comments from '../components/Comments';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCaseDetails();
  }, [id]);

  async function loadCaseDetails() {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      const { data, error: supabaseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        throw new Error('Case not found');
      }

      setCaseData(data);
    } catch (error: any) {
      console.error('Error loading case:', error);
      setError(error.message || 'Erro ao carregar detalhes do caso');
      toast.error('Erro ao carregar detalhes do caso. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  const shareCase = () => {
    if (navigator.share) {
      navigator.share({
        title: 'VigiaApp - Caso #' + id,
        text: caseData?.title,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do caso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar caso</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadCaseDetails()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Caso não encontrado</h2>
          <p className="text-gray-600 mb-4">O caso que você está procurando não existe ou foi removido.</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
          >
            Voltar para Alertas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Bell className="h-6 w-6" />
              <h1 className="text-2xl font-bold">VigiaApp</h1>
            </Link>
            <button
              onClick={shareCase}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Share2 className="h-5 w-5" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <AdBanner size="medium" position="top" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Voltar para Alertas</span>
          </Link>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="font-medium">Caso Ativo - Última atualização há 2 dias</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80"
                alt="Vehicle"
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Veículo Roubado
                </span>
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Honda Civic Preto</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Informações do Veículo</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <span className="font-medium w-32">Placa:</span>
                      ABC-1234
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="font-medium w-32">Ano:</span>
                      2022
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="font-medium w-32">Cor:</span>
                      Preto
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="font-medium w-32">Chassi:</span>
                      9BWHE21JX24060831
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Detalhes da Ocorrência</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>08 de Março de 2024</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Por volta das 22:30</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>Av. Paulista, 1000 - São Paulo, SP</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Descrição do Caso</h2>
                <p className="text-gray-600">
                  Veículo roubado durante assalto à mão armada. Possui pequeno amassado na porta traseira direita
                  e adesivo da concessionária no vidro traseiro. Qualquer informação é importante.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Galeria de Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80"
                alt="Vehicle Front"
                className="rounded-lg w-full h-40 object-cover cursor-pointer hover:opacity-90"
              />
              <img
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=300&q=80"
                alt="Vehicle Back"
                className="rounded-lg w-full h-40 object-cover cursor-pointer hover:opacity-90"
              />
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80"
                alt="Vehicle Side"
                className="rounded-lg w-full h-40 object-cover cursor-pointer hover:opacity-90"
              />
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80"
                alt="Vehicle Interior"
                className="rounded-lg w-full h-40 object-cover cursor-pointer hover:opacity-90"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contatos de Emergência
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <span className="font-medium w-32">Polícia:</span>
                  190
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="font-medium w-32">Família:</span>
                  (11) 98765-4321
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                Enviar Informação
              </h2>
              <p className="text-gray-600 mb-4">
                Tem alguma informação sobre este caso? Envie de forma segura e anônima.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Reportar Informação
              </button>
            </div>
          </div>

          <div className="my-8">
            <AdBanner size="medium" position="content" />
          </div>

          <Comments caseId={id} />

          <div className="mt-8">
            <AdBanner size="medium" position="content" />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 VigiaApp. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CaseDetails;