import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  property_id: string;
  property_title: string;
  owner_id: string;
  participant_id: string;
  last_message_at: string;
  unread_count?: number;
  last_message?: {
    content: string;
    sender_id: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchConversations();
  }, [user, navigate]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`owner_id.eq.${user.id},participant_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Fetch last message and unread count for each conversation
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          return {
            ...conv,
            last_message: lastMsg || undefined,
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast.error('Error al cargar conversaciones');
    } finally {
      setLoading(false);
    }
  };

  const getOtherUserRole = (conv: Conversation) => {
    return conv.owner_id === user?.id ? 'Interesado' : 'Propietario';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando conversaciones...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mensajes - Inmobiliaria</title>
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Mensajes</h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
          </div>

          {conversations.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No tienes mensajes</h2>
              <p className="text-muted-foreground mb-4">
                Cuando alguien te contacte sobre una propiedad, aparecerá aquí
              </p>
              <Button onClick={() => navigate('/')}>
                Explorar propiedades
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/mensajes/${conv.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{conv.property_title}</h3>
                        <Badge variant="outline">{getOtherUserRole(conv)}</Badge>
                        {(conv.unread_count ?? 0) > 0 && (
                          <Badge variant="default">{conv.unread_count} nuevo{conv.unread_count !== 1 && 's'}</Badge>
                        )}
                      </div>
                      {conv.last_message && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {conv.last_message.sender_id === user?.id && 'Tú: '}
                          {conv.last_message.content}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(conv.last_message_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
