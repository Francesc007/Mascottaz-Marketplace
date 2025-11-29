"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "../../lib/supabaseClient";
import Image from "next/image";
import { Send, Loader2, User } from "lucide-react";

export default function Conversation({ conversationId, currentUserId, otherUserId, otherUserName, otherUserAvatar, productId, productName }) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      subscribeToMessages();
    }

    return () => {
      if (conversationId) {
        supabase.removeAllChannels();
      }
    };
  }, [conversationId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error cargando mensajes:", error);
        return;
      }

      setMessages(data || []);

      // Marcar mensajes como leídos
      if (data && data.length > 0) {
        const unreadIds = data
          .filter(m => m.receiver_id === currentUserId && !m.is_read)
          .map(m => m.id);

        if (unreadIds.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in("id", unreadIds);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
            // Marcar como leído si es para el usuario actual
            if (payload.new.receiver_id === currentUserId) {
              supabase
                .from("messages")
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq("id", payload.new.id);
            }
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      // Determinar si el remitente es vendedor
      const { data: vendorCheck } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", currentUserId)
        .single();

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          message: messageText,
          product_id: productId || null,
          is_read: false,
          is_seller_message: !!vendorCheck,
        })
        .select()
        .single();

      if (error) {
        console.error("Error enviando mensaje:", error);
        setNewMessage(messageText); // Restaurar el mensaje si falla
      } else {
        setMessages((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Error:", err);
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--brand-blue)' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header de la conversación */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          {otherUserAvatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={otherUserAvatar}
                alt={otherUserName}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{otherUserName}</h3>
            {productName && (
              <p className="text-xs text-gray-500">Sobre: {productName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No hay mensajes aún. ¡Envía el primero!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.created_at)}
                    {isOwn && message.is_read && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

