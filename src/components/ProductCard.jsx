"use client";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
  <img src={product.image} alt={product.name} width={200} height={200} className="mx-auto block" />
  <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-bold" style={{ color: '#1e3a8a' }}>${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 w-full text-white py-1 rounded hover:opacity-90"
        style={{ backgroundColor: '#3b82f6' }}
      >
        Añadir al carrito
      </button>
    </div>
  );
}
