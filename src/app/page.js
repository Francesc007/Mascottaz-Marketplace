"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import DailyDeals from "../components/DailyDeals";
import CommunityGallery from "../components/CommunityGallery";
import useCartStore from "../store/cartStore";

export default function Home() {
  const { addItem } = useCartStore();

  const addToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="flex-1">
        <NavigationBar />
        
        <DailyDeals addToCart={addToCart} />
        
        <CommunityGallery />
      </main>

      <Footer />
    </div>
  );
}
