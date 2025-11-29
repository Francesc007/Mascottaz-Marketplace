"use client";

import { useState, useMemo } from "react";
import { createClient } from "../lib/supabaseClient";
import { PawPrint, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import useAuthStore from "../store/authStore";

export default function ReviewForm({ sellerId, productId, onReviewSubmitted }) {
  const supabase = useMemo(() => createClient(), []);
  const { user, isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError("Debes iniciar sesión para dejar una reseña");
      return;
    }

    if (rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    if (!text.trim()) {
      setError("Por favor escribe un comentario");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      // Verificar si el usuario ya dejó una reseña para este vendedor/producto
      let existingReview = null;
      if (productId) {
        const { data: existing } = await supabase
          .from("reviews")
          .select("id")
          .eq("buyer_id", user.id)
          .eq("product_id", productId)
          .single();
        existingReview = existing;
      } else if (sellerId) {
        const { data: existing } = await supabase
          .from("reviews")
          .select("id")
          .eq("buyer_id", user.id)
          .eq("seller_id", sellerId)
          .is("product_id", null)
          .single();
        existingReview = existing;
      }

      if (existingReview) {
        setError("Ya has dejado una reseña para este vendedor/producto");
        setSubmitting(false);
        return;
      }

      // Verificar si el comprador es verificado (por ahora permitimos todos, pero marcamos como "unverified" si no hay orden)
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("seller_id", sellerId)
        .limit(1)
        .single();

      const isVerified = !!ordersData;

      // Obtener vendor_id si existe
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", sellerId)
        .single();

      const reviewData = {
        seller_id: sellerId,
        buyer_id: user.id,
        rating: rating,
        comment: text.trim(),
        product_id: productId || null,
        vendor_id: vendorData?.id || null,
        order_id: ordersData?.id || null, // Si hay orden, la reseña está verificada
      };

      const { data, error: insertError } = await supabase
        .from("reviews")
        .insert([reviewData])
        .select()
        .single();

      if (insertError) {
        console.error("Error insertando reseña:", insertError);
        setError(insertError.message || "Error al enviar la reseña");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setRating(0);
      setText("");
      setHoverRating(0);
      
      if (onReviewSubmitted) {
        onReviewSubmitted(data);
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error:", err);
      setError("Error inesperado al enviar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800 text-sm">
          <a href="/" className="underline font-medium">Inicia sesión</a> para dejar una reseña
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800 text-sm">¡Reseña enviada exitosamente!</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <PawPrint
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating === 1 && "Muy malo"}
              {rating === 2 && "Malo"}
              {rating === 3 && "Regular"}
              {rating === 4 && "Bueno"}
              {rating === 5 && "Excelente"}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Comparte tu experiencia con este vendedor..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{text.length}/500 caracteres</p>
      </div>

      <button
        type="submit"
        disabled={submitting || rating === 0 || !text.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Reseña"
        )}
      </button>
    </form>
  );
}

