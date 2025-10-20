"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import NavigationBar from "../components/NavigationBar";
import FloatingCart from "../components/FloatingCart";
import AuthButton from "../components/AuthButton";

export default function Home() {
  const products = [
    { id: 1, name: "Comida para perro", description: "Sabor pollo 1kg", price: 120, image: "/comida para perro.jpg" },
    { id: 2, name: "Juguete para gato", description: "Pelota con cascabel", price: 80, image: "/juguete para gato.jpg" },
    { id: 3, name: "Jaula para hámster", description: "Incluye ruedas y accesorios", price: 250, image: "/jaula para hamster.jpg" },
  ];

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };
  const removeFromCart = (index) => setCartItems(cartItems.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">

        <NavigationBar />

        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </div>

        <FloatingCart items={cartItems} removeFromCart={removeFromCart} />
        <AuthButton />
      </main>

      <Footer />
    </div>
  );
}
