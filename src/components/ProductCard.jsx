"use client";

import Image from "next/image";

export default function ProductCard({ product, addToCart }) {
  const imageUrl = product.imagen || product.image || "/placeholder-product.jpg";
  const productName = product.nombre || product.name;
  const productDescription = product.descripcion || product.description;
  const productPrice = product.precio || product.price;

  return (
    <div className="border p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h2 className="font-bold text-lg mb-2">{productName}</h2>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{productDescription}</p>
      <p className="font-bold text-xl mb-3" style={{ color: 'var(--brand-blue)' }}>
        ${productPrice?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </p>
      {addToCart && (
        <button
          onClick={() => addToCart(product)}
          className="w-full text-white py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          style={{ backgroundColor: 'var(--brand-blue)' }}
        >
          Añadir al carrito
        </button>
      )}
    </div>
  );
}
