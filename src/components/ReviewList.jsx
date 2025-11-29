"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "../lib/supabaseClient";
import Image from "next/image";
import { PawPrint, User, CheckCircle2, Clock } from "lucide-react";

export default function ReviewList({ sellerId, productId, showForm = false, onReviewSubmitted }) {
  const supabase = useMemo(() => createClient(), []);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    if (sellerId) {
      loadReviews();
    } else {
      setLoading(false);
      setReviews([]);
      setStats({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId, productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Validar que sellerId existe
      if (!sellerId) {
        console.warn("No se proporcionó sellerId para cargar reseñas");
        setReviews([]);
        setStats({
          average: 0,
          total: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
        return;
      }
      
      let query = supabase
        .from("reviews")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (productId) {
        query = query.eq("product_id", productId);
      } else {
        query = query.is("product_id", null);
      }

      const { data, error } = await query;

      if (error) {
        // Si es un error de tabla no encontrada o RLS, solo mostrar warning
        if (error.code === '42P01' || error.code === '42501') {
          console.warn("Tabla reviews no disponible o sin permisos:", error.message);
          setReviews([]);
          setStats({
            average: 0,
            total: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          });
          return;
        }
        console.error("Error cargando reseñas:", error.message || error);
        setReviews([]);
        setStats({
          average: 0,
          total: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
        return;
      }

      // Cargar perfiles de compradores en batch
      if (data && data.length > 0) {
        const buyerIds = [...new Set(data.map(r => r.buyer_id).filter(Boolean))];
        
        if (buyerIds.length > 0) {
          try {
            const { data: profilesData, error: profilesError } = await supabase
              .from("profiles")
              .select("user_id, full_name, avatar_url")
              .in("user_id", buyerIds);

            if (profilesError) {
              console.warn("Error cargando perfiles (continuando sin perfiles):", profilesError.message);
              // Continuar sin perfiles si hay error
              setReviews(data.map(review => ({
                ...review,
                buyerProfile: null,
              })));
            } else {
              const profilesMap = new Map();
              profilesData?.forEach(p => profilesMap.set(p.user_id, p));

              // Enriquecer reviews con datos de perfiles
              const enrichedReviews = data.map(review => ({
                ...review,
                buyerProfile: profilesMap.get(review.buyer_id) || null,
              }));

              setReviews(enrichedReviews);
            }
          } catch (profilesErr) {
            console.warn("Error al cargar perfiles (continuando sin perfiles):", profilesErr);
            // Continuar sin perfiles si hay error
            setReviews(data.map(review => ({
              ...review,
              buyerProfile: null,
            })));
          }
        } else {
          setReviews(data);
        }
      } else {
        setReviews([]);
      }

      // Calcular estadísticas
      if (data && data.length > 0) {
        const total = data.length;
        const sum = data.reduce((acc, r) => acc + (r.rating || 0), 0);
        const average = sum / total;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach((r) => {
          if (r.rating >= 1 && r.rating <= 5) {
            distribution[r.rating]++;
          }
        });

        setStats({
          average: average.toFixed(1),
          total,
          distribution,
        });
      } else {
        setStats({
          average: 0,
          total: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
    } catch (err) {
      console.error("Error inesperado cargando reseñas:", err?.message || err);
      // Asegurar que siempre se establezcan valores por defecto
      setReviews([]);
      setStats({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getBuyerName = (review) => {
    return review.buyerProfile?.full_name || "Comprador";
  };

  const getBuyerAvatar = (review) => {
    return review.buyerProfile?.avatar_url || null;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 text-sm">Cargando reseñas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats.total > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                {stats.average}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <PawPrint
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(parseFloat(stats.average))
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">{stats.total} {stats.total === 1 ? 'reseña' : 'reseñas'}</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.distribution[rating];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                    <PawPrint className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PawPrint className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No hay reseñas aún. ¡Sé el primero en dejar una!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const buyerName = getBuyerName(review);
            const buyerAvatar = getBuyerAvatar(review);
            
            return (
              <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  {buyerAvatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={buyerAvatar}
                        alt={buyerName}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{buyerName}</h4>
                      {review.order_id ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          <Clock className="w-3 h-3" />
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <PawPrint
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

