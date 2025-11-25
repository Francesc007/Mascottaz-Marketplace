"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import DailyDeals from "../components/DailyDeals";
import CommunityGallery from "../components/CommunityGallery";
import FloatingCart from "../components/FloatingCart";
import AuthButton from "../components/AuthButton";

export default function Home() {
  const [cartItems, setCartItems] = useState([]);

  const removeFromCart = (index) => setCartItems(cartItems.filter((_, i) => i !== index));

  const addToCart = (product) => {
    setCartItems([...cartItems, {
      id: product.id,
      name: product.nombre || product.name,
      description: product.descripcion || product.description,
      price: product.precio || product.price,
      image: product.imagen || product.image
    }]);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header cartItems={cartItems} />

      <main className="flex-1">
        <NavigationBar />
        
        <DailyDeals addToCart={addToCart} />
        
        <CommunityGallery />
        
        <FloatingCart items={cartItems} removeFromCart={removeFromCart} />
      </main>

      <Footer />
    </div>
  );
}
