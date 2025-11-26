"use client";

import { useParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import NavigationBar from "../../../../components/NavigationBar";

export default function CategoryPage() {
  const params = useParams();
  const animal = params.animal;
  const subcategoria = params.subcategoria;

  // Mapeo de categorías disponibles
  const categoryData = {
    "perros": {
      "alimentos": ["Alimento Seco", "Alimento Húmedo", "Snacks y Premios", "Alimento para Cachorros", "Alimento para Adultos", "Alimento para Seniors", "Alimento Especializado"],
      "juguetes": ["Pelotas", "Mordedores", "Juguetes Interactivos", "Juguetes de Tira y Afloja", "Juguetes para Masticar", "Juguetes de Plástico", "Juguetes de Tela"],
      "accesorios": ["Collares", "Correas", "Arneses", "Placas de Identificación", "Bolsas para Excremento", "Comederos y Bebederos", "Camas y Casas"],
      "ropa": ["Sweaters y Abrigos", "Vestidos y Disfraces", "Camisetas", "Chalecos", "Gorros y Accesorios", "Ropa para Lluvia"],
      "salud-y-cuidado": ["Shampoo y Acondicionador", "Cepillos y Peines", "Cortauñas", "Cuidado Dental", "Suplementos", "Medicamentos", "Primeros Auxilios"],
      "viaje-y-transporte": ["Transportadoras", "Cinturones para Auto", "Bolsos Transportadores", "Accesorios de Viaje"]
    },
    "gatos": {
      "alimentos": ["Alimento Seco", "Alimento Húmedo", "Snacks y Premios", "Alimento para Gatitos", "Alimento para Adultos", "Alimento para Seniors", "Alimento Especializado"],
      "juguetes": ["Varitas y Plumeros", "Ratones de Juguete", "Pelotas", "Juguetes Interactivos", "Rascadores", "Túneles", "Juguetes con Hierba Gatera"],
      "accesorios": ["Areneros", "Arena y Sustratos", "Collares", "Placas de Identificación", "Comederos y Bebederos", "Camas y Casas", "Rascadores y Postes"],
      "ropa": ["Sweaters", "Vestidos y Disfraces", "Chalecos", "Gorros", "Ropa para Lluvia"],
      "salud-y-cuidado": ["Shampoo y Acondicionador", "Cepillos y Peines", "Cortauñas", "Cuidado Dental", "Suplementos", "Medicamentos", "Primeros Auxilios"],
      "viaje-y-transporte": ["Transportadoras", "Bolsos Transportadores", "Accesorios de Viaje"]
    }
  };

  const getCategoryName = (slug) => {
    const names = {
      "perros": "Perros",
      "gatos": "Gatos",
      "alimentos": "Alimentos",
      "juguetes": "Juguetes",
      "accesorios": "Accesorios",
      "ropa": "Ropa",
      "salud-y-cuidado": "Salud y Cuidado",
      "viaje-y-transporte": "Viaje y Transporte"
    };
    return names[slug] || slug;
  };

  const categories = categoryData[animal]?.[subcategoria] || [];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      <NavigationBar />
      
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-2 md:px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {getCategoryName(animal)} - {getCategoryName(subcategoria)}
          </h1>
          <p className="text-lg text-gray-600">
            Explora nuestras opciones en {getCategoryName(subcategoria).toLowerCase()} para {getCategoryName(animal).toLowerCase()}
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category}
                </h3>
                <p className="text-gray-600 text-sm">
                  Ver productos en {category}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">
              No hay categorías disponibles en este momento.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}



