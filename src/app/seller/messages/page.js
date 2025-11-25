"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  MessageSquare, 
  ArrowLeft, 
  Send,
  User,
  Package,
  Mail,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function SellerMessagesPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [supabase]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation, supabase]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id (
            id,
            email
          ),
          product:product_id (
            id,
            nombre,
            imagen
          )
        `)
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando mensajes:", error);
        if (error.code === '42P01') {
          setConversations([]);
          setLoading(false);
          return;
        }
        throw error;
      }

      if (messagesData) {
        const grouped = {};
        messagesData.forEach((msg) => {
          const convId = msg.conversation_id;
          if (!grouped[convId]) {
            grouped[convId] = {
              id: convId,
              sender: msg.sender,
              product: msg.product,
              lastMessage: msg,
              unreadCount: 0,
              messages: []
            };
          }
          grouped[convId].messages.push(msg);
          if (!msg.is_read) {
            grouped[convId].unreadCount++;
          }
        });
        setConversations(Object.values(grouped));
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id (
            id,
            email
          )
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (messagesData) {
        setMessages(messagesData);

        const unreadIds = messagesData
          .filter(m => !m.is_read && m.receiver_id === user.id)
          .map(m => m.id);

        if (unreadIds.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in("id", unreadIds);
        }
      }
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      const { error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          receiver_id: conversation.lastMessage.sender_id,
          product_id: conversation.product?.id || null,
          message: newMessage.trim(),
          is_seller_message: true,
          is_read: false
        });

      if (error) throw error;

      setNewMessage("");
      await loadMessages(selectedConversation);
      await loadConversations();
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert("Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <header className="shadow-sm" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/MASCOTTAZ.png"
                  alt="Mascottaz logo"
                  width={300}
                  height={100}
                  className="h-[90px] w-[300px] object-contain"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-between py-3 px-8" style={{ backgroundColor: 'var(--interaction-blue)' }}>
          <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/seller/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <MessageSquare className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                Mensajes y Preguntas
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--brand-blue)' }}>
                  Conversaciones
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No tienes mensajes aún</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 text-left border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        selectedConversation === conv.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {conv.sender?.email || 'Cliente'}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          {conv.product && (
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              Sobre: {conv.product.nombre}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(conv.lastMessage.created_at).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
                <div className="p-4 border-b border-gray-200">
                  {(() => {
                    const conv = conversations.find(c => c.id === selectedConversation);
                    return (
                      <div>
                        <p className="font-semibold text-gray-900">
                          {conv?.sender?.email || 'Cliente'}
                        </p>
                        {conv?.product && (
                          <p className="text-sm text-gray-500">
                            Pregunta sobre: {conv.product.nombre}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_seller_message ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.is_seller_message
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.is_seller_message ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.created_at).toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Escribe tu respuesta..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-500">
                  Elige una conversación de la lista para ver los mensajes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





