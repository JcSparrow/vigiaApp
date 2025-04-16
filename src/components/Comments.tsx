import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ThumbsUp, Flag, MessageCircle, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: number;
  is_official: boolean;
  user: {
    name: string;
    role: string;
  };
}

interface CommentsProps {
  caseId: string;
}

export default function Comments({ caseId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'likes'>('recent');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    loadComments();
  }, [caseId, sortBy]);

  async function loadComments() {
    try {
      const { data, error } = await supabase
        .from('case_comments')
        .select(`
          *,
          user:users(name, role)
        `)
        .eq('case_id', caseId)
        .order(sortBy === 'recent' ? 'created_at' : 'likes', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Erro ao carregar comentários');
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para comentar');
      return;
    }
    if (newComment.length > 300) {
      toast.error('O comentário deve ter no máximo 300 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('case_comments')
        .insert({
          case_id: caseId,
          content: newComment,
          user_id: user.id
        });

      if (error) throw error;
      
      setNewComment('');
      loadComments();
      toast.success('Comentário publicado com sucesso');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Erro ao publicar comentário');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLikeComment(commentId: string) {
    if (!user) {
      toast.error('Você precisa estar logado para curtir comentários');
      return;
    }

    try {
      const { error } = await supabase.rpc('increment_comment_likes', {
        comment_id: commentId
      });

      if (error) throw error;
      loadComments();
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Erro ao curtir comentário');
    }
  }

  async function handleReportComment(commentId: string) {
    if (!user) {
      toast.error('Você precisa estar logado para denunciar comentários');
      return;
    }

    try {
      const { error } = await supabase
        .from('comment_reports')
        .insert({
          comment_id: commentId,
          reporter_id: user.id
        });

      if (error) throw error;
      toast.success('Comentário denunciado com sucesso');
    } catch (error) {
      console.error('Error reporting comment:', error);
      toast.error('Erro ao denunciar comentário');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Comentários ({comments.length})
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'likes')}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="recent">Mais Recentes</option>
          <option value="likes">Mais Curtidos</option>
        </select>
      </div>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={300}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {newComment.length}/300 caracteres
            </span>
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-600">
            Você precisa estar logado para comentar.{' '}
            <a href="/auth" className="text-blue-600 hover:text-blue-800">
              Fazer login
            </a>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">{comment.user.name}</span>
                {comment.is_official && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    <Shield className="h-3 w-3 mr-1" />
                    Oficial
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(comment.created_at), "d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{comment.content}</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="text-gray-500 hover:text-blue-600 flex items-center"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{comment.likes}</span>
              </button>
              <button
                onClick={() => handleReportComment(comment.id)}
                className="text-gray-500 hover:text-red-600 flex items-center"
              >
                <Flag className="h-4 w-4 mr-1" />
                <span>Denunciar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}