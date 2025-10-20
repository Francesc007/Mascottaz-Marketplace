"use client";

export default function Cart({ items, removeFromCart }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="border p-4 rounded shadow-md m-2" style={{ backgroundColor: '#fffaf0' }}>
      <h2 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>Carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index} className="flex justify-between mb-1">
              <span>{item.name}</span>
              <span>${item.price}</span>
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:underline ml-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="font-bold mt-2" style={{ color: '#1e3a8a' }}>Total: ${total}</p>
    </div>
  );
}
