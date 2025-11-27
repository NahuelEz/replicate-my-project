-- Crear tabla de conversaciones
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  property_title TEXT NOT NULL,
  owner_id UUID NOT NULL,
  participant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(property_id, owner_id, participant_id)
);

-- Crear tabla de mensajes
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_conversations_owner ON public.conversations(owner_id);
CREATE INDEX idx_conversations_participant ON public.conversations(participant_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- Habilitar RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas para conversations
CREATE POLICY "Usuarios pueden ver sus conversaciones"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() = owner_id OR auth.uid() = participant_id);

CREATE POLICY "Usuarios pueden crear conversaciones"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() = participant_id);

CREATE POLICY "Usuarios pueden actualizar sus conversaciones"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid() = owner_id OR auth.uid() = participant_id);

-- Políticas para messages
CREATE POLICY "Usuarios pueden ver mensajes de sus conversaciones"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.owner_id = auth.uid() OR conversations.participant_id = auth.uid())
    )
  );

CREATE POLICY "Usuarios pueden enviar mensajes en sus conversaciones"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.owner_id = auth.uid() OR conversations.participant_id = auth.uid())
    )
  );

CREATE POLICY "Usuarios pueden marcar como leídos sus mensajes"
  ON public.messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.owner_id = auth.uid() OR conversations.participant_id = auth.uid())
    )
  );

-- Trigger para actualizar last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_timestamp();

-- Trigger para updated_at en conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();