"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  Star, 
  ArrowLeft, 
  MessageSquare,
  Send,
  StarIcon
} from "lucide-react";

export default function SellerReviewsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    loadReviews();
  }, [supabase]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      try {
        const { data: reviewsData, error } = await supabase
          .from("reviews")
          .select(`
            *,
            product:product_id (
              nombre,
              imagen
            ),
            buyer:buyer_id (
              email
            )
          `)
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          if (error.code === '42P01') {
            setReviews([]);
            setLoading(false);
            return;
          }
          throw error;
        }

        if (reviewsData) {
          setReviews(reviewsData);
          setTotalReviews(reviewsData.length);
          
          if (reviewsData.length > 0) {
            const sum = reviewsData.reduce((acc, review) => acc + (review.rating || 0), 0);
            setAverageRating(sum / reviewsData.length);
          }
        }
      } catch (err) {
        console.log("Tabla reviews no existe aún:", err);
        setReviews([]);
      }
    } catch (err) {
      console.error("Error cargando reseñas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          seller_response: replyText.trim(),
          seller_response_at: new Date().toISOString()
        })
        .eq("id", reviewId);

      if (error) throw error;

      setReplyingTo(null);
      setReplyText("");
      await loadReviews();
    } catch (err) {
      console.error("Error enviando respuesta:", err);
      alert("Error al enviar la respuesta");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reseñas...</p>
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
                <Star className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                Reputación
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        {/* Resumen de Reputación */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-blue)' }}>
                Calificación Promedio
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Distribución</div>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600 w-8">{stars}★</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista de Reseñas */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aún no tienes reseñas
            </h3>
            <p className="text-gray-500">
              Las reseñas de tus clientes aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {review.product?.imagen && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={review.product.imagen}
                          alt={review.product.nombre}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {review.product?.nombre || "Producto"}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      {review.buyer?.email && (
                        <p className="text-sm text-gray-500">
                          Por: {review.buyer.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-700 mb-4 pl-20">{review.comment}</p>
                )}

                {review.seller_response ? (
                  <div className="ml-20 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">Tu respuesta:</span>
                    </div>
                    <p className="text-sm text-blue-800">{review.seller_response}</p>
                    {review.seller_response_at && (
                      <p className="text-xs text-blue-600 mt-2">
                        {new Date(review.seller_response_at).toLocaleDateString('es-MX')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="ml-20 mt-4">
                    {replyingTo === review.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Escribe tu respuesta..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(review.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Send className="w-4 h-4" />
                            Enviar Respuesta
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Responder
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}







