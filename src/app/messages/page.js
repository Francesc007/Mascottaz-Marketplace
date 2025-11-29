"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Conversation from "../../components/Messages/Conversation";
import { MessageSquare, ArrowLeft, User, Package, Mail, Loader2 } from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const { isAuthenticated, user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }
    loadConversations();
  }, [isAuthenticated, user, supabase]);

  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    const sellerId = searchParams.get("sellerId");
    const productId = searchParams.get("productId");

    if (conversationId) {
      loadConversationDetails(conversationId);
    } else if (sellerId && productId) {
      createOrLoadConversation(sellerId, productId);
    }
  }, [searchParams, supabase, user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      if (!user) return;

      // Obtener todas las conversaciones donde el usuario es sender o receiver
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*, products:product_id(nombre, imagen)")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando conversaciones:", error);
        return;
      }

      // Agrupar por conversation_id
      const conversationsMap = new Map();
      
      for (const message of messagesData || []) {
        const convId = message.conversation_id;
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!conversationsMap.has(convId)) {
          conversationsMap.set(convId, {
            id: convId,
            otherUserId,
            lastMessage: message,
            unreadCount: 0,
            product: message.products,
          });
        } else {
          const conv = conversationsMap.get(convId);
          if (new Date(message.created_at) > new Date(conv.lastMessage.created_at)) {
            conv.lastMessage = message;
          }
          if (message.receiver_id === user.id && !message.is_read) {
            conv.unreadCount++;
          }
        }
      }

      // Cargar información de los otros usuarios
      const conversationsArray = Array.from(conversationsMap.values());
      const userIds = [...new Set(conversationsArray.map(c => c.otherUserId))];
      
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      const { data: vendorsData } = await supabase
        .from("vendors")
        .select("user_id, business_name, avatar_url")
        .in("user_id", userIds);

      const profilesMap = new Map();
      profilesData?.forEach(p => profilesMap.set(p.user_id, { name: p.full_name, avatar: p.avatar_url }));
      vendorsData?.forEach(v => {
        if (!profilesMap.has(v.user_id)) {
          profilesMap.set(v.user_id, { name: v.business_name, avatar: v.avatar_url });
        }
      });

      const conversationsWithUsers = conversationsArray.map(conv => ({
        ...conv,
        otherUserName: profilesMap.get(conv.otherUserId)?.name || "Usuario",
        otherUserAvatar: profilesMap.get(conv.otherUserId)?.avatar || null,
      }));

      setConversations(conversationsWithUsers);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetails = async (conversationId) => {
    try {
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*, products:product_id(id, nombre, imagen)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (messagesData) {
        const otherUserId = messagesData.sender_id === user.id ? messagesData.receiver_id : messagesData.sender_id;
        await loadOtherUserInfo(otherUserId);
        if (messagesData.product_id) {
          setProduct(messagesData.products);
        }
        setSelectedConversation(conversationId);
      }
    } catch (err) {
      console.error("Error cargando detalles:", err);
    }
  };

  const createOrLoadConversation = async (sellerId, productId) => {
    try {
      // Buscar si ya existe una conversación
      const { data: existing } = await supabase
        .from("messages")
        .select("conversation_id")
        .eq("sender_id", user.id)
        .eq("receiver_id", sellerId)
        .eq("product_id", productId)
        .limit(1)
        .single();

      let conversationId;
      if (existing?.conversation_id) {
        conversationId = existing.conversation_id;
      } else {
        // Crear nueva conversación
        conversationId = crypto.randomUUID();
        const { data: productData } = await supabase
          .from("products")
          .select("nombre, imagen")
          .eq("id", productId)
          .single();

        if (productData) {
          setProduct(productData);
        }
      }

      await loadOtherUserInfo(sellerId);
      setSelectedConversation(conversationId);
      router.replace(`/messages?conversationId=${conversationId}`);
    } catch (err) {
      console.error("Error creando conversación:", err);
    }
  };

  const loadOtherUserInfo = async (otherUserId) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", otherUserId)
        .single();

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("business_name, avatar_url")
        .eq("user_id", otherUserId)
        .single();

      setOtherUser({
        id: otherUserId,
        name: vendorData?.business_name || profileData?.full_name || "Usuario",
        avatar: vendorData?.avatar_url || profileData?.avatar_url || null,
      });
    } catch (err) {
      console.error("Error cargando info del usuario:", err);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ minHeight: '600px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Lista de conversaciones */}
            <div className="border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} />
                  Mensajes
                </h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--brand-blue)' }} />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No tienes conversaciones aún</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv.id);
                        setOtherUser({
                          id: conv.otherUserId,
                          name: conv.otherUserName,
                          avatar: conv.otherUserAvatar,
                        });
                        router.replace(`/messages?conversationId=${conv.id}`);
                      }}
                      className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation === conv.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {conv.otherUserAvatar ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={conv.otherUserAvatar}
                              alt={conv.otherUserName}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.otherUserName}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.message || ""}</p>
                          {conv.product && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <Package className="w-3 h-3" />
                              <span className="truncate">{conv.product.nombre}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Área de conversación */}
            <div className="lg:col-span-2">
              {selectedConversation && otherUser ? (
                <Conversation
                  conversationId={selectedConversation}
                  currentUserId={user.id}
                  otherUserId={otherUser.id}
                  otherUserName={otherUser.name}
                  otherUserAvatar={otherUser.avatar}
                  productId={product?.id}
                  productName={product?.nombre}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Selecciona una conversación para comenzar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

