import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

interface CaseVerificationProps {
  caseId: string;
  status: string;
}

export default function CaseVerification({ caseId, status }: CaseVerificationProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [evidence, setEvidence] = useState('');

  const statusColors = {
    unverified: 'bg-gray-100 text-gray-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    false_info: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    unverified: AlertTriangle,
    in_review: Shield,
    verified: CheckCircle,
    false_info: XCircle
  };

  const StatusIcon = statusIcons[status as keyof typeof statusIcons];

  async function requestVerification() {
    try {
      setIsRequesting(true);
      const { error } = await supabase
        .from('case_verifications')
        .insert({
          case_id: caseId,
          verification_type: 'official',
          evidence
        });

      if (error) throw error;
      toast.success('Solicitação de verificação enviada');
      setEvidence('');
    } catch (error) {
      toast.error('Erro ao solicitar verificação');
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Verificação do Caso
        </h2>
        <span className={`px-3 py-1 rounded-full flex items-center ${statusColors[status as keyof typeof statusColors]}`}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {status === 'unverified' && 'Não Verificado'}
          {status === 'in_review' && 'Em Análise'}
          {status === 'verified' && 'Verificado'}
          {status === 'false_info' && 'Informação Falsa'}
        </span>
      </div>

      {status === 'unverified' && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Solicite a verificação oficial deste caso fornecendo evidências ou documentos relevantes.
          </p>

          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Descreva as evidências ou forneça links para documentos oficiais..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />

          <button
            onClick={requestVerification}
            disabled={isRequesting || !evidence}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Shield className="h-5 w-5 mr-2" />
            {isRequesting ? 'Enviando...' : 'Solicitar Verificação'}
          </button>
        </div>
      )}

      {status === 'in_review' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-800">
            Este caso está sendo analisado por nossa equipe de moderação.
            Atualizaremos o status assim que possível.
          </p>
        </div>
      )}

      {status === 'verified' && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-green-800">
            Este caso foi verificado oficialmente por nossa equipe de moderação.
            Todas as informações foram confirmadas.
          </p>
        </div>
      )}

      {status === 'false_info' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-800">
            Este caso foi marcado como informação falsa após análise da nossa equipe.
            O caso será removido em breve.
          </p>
        </div>
      )}
    </div>
  );
}