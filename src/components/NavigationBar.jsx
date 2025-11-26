"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();
  const navRef = useRef(null);

  const mainCategories = [
    {
      name: "Perros",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Alimentos",
          categories: ["Alimento Seco", "Alimento Húmedo", "Snacks y Premios", "Alimento para Cachorros", "Alimento para Adultos", "Alimento para Seniors", "Alimento Especializado"]
        },
        {
          name: "Juguetes",
          categories: ["Pelotas", "Mordedores", "Juguetes Interactivos", "Juguetes de Tira y Afloja", "Juguetes para Masticar", "Juguetes de Plástico", "Juguetes de Tela"]
        },
        {
          name: "Accesorios",
          categories: ["Collares", "Correas", "Arneses", "Placas de Identificación", "Bolsas para Excremento", "Comederos y Bebederos", "Camas y Casas"]
        },
        {
          name: "Ropa",
          categories: ["Sweaters y Abrigos", "Vestidos y Disfraces", "Camisetas", "Chalecos", "Gorros y Accesorios", "Ropa para Lluvia"]
        },
        {
          name: "Salud y Cuidado",
          categories: ["Shampoo y Acondicionador", "Cepillos y Peines", "Cortauñas", "Cuidado Dental", "Suplementos", "Medicamentos", "Primeros Auxilios"]
        },
        {
          name: "Viaje y Transporte",
          categories: ["Transportadoras", "Cinturones para Auto", "Bolsos Transportadores", "Accesorios de Viaje"]
        }
      ]
    },
    {
      name: "Gatos",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Alimentos",
          categories: ["Alimento Seco", "Alimento Húmedo", "Snacks y Premios", "Alimento para Gatitos", "Alimento para Adultos", "Alimento para Seniors", "Alimento Especializado"]
        },
        {
          name: "Juguetes",
          categories: ["Varitas y Plumeros", "Ratones de Juguete", "Pelotas", "Juguetes Interactivos", "Rascadores", "Túneles", "Juguetes con Hierba Gatera"]
        },
        {
          name: "Accesorios",
          categories: ["Areneros", "Arena y Sustratos", "Collares", "Placas de Identificación", "Comederos y Bebederos", "Camas y Casas", "Rascadores y Postes"]
        },
        {
          name: "Ropa",
          categories: ["Sweaters", "Vestidos y Disfraces", "Chalecos", "Gorros", "Ropa para Lluvia"]
        },
        {
          name: "Salud y Cuidado",
          categories: ["Shampoo y Acondicionador", "Cepillos y Peines", "Cortauñas", "Cuidado Dental", "Suplementos", "Medicamentos", "Primeros Auxilios"]
        },
        {
          name: "Viaje y Transporte",
          categories: ["Transportadoras", "Bolsos Transportadores", "Accesorios de Viaje"]
        }
      ]
    },
    {
      name: "Mamíferos Pequeños",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Próximamente",
          categories: []
        }
      ]
    },
    {
      name: "Peces",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Próximamente",
          categories: []
        }
      ]
    },
    {
      name: "Aves",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Próximamente",
          categories: []
        }
      ]
    },
    {
      name: "Reptiles",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Próximamente",
          categories: []
        }
      ]
    },
    {
      name: "Servicios",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Próximamente",
          categories: []
        }
      ]
    }
  ];

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const handleCategoryClick = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleSubcategoryClick = (categoryName, subcategoryName, categories) => {
    if (subcategoryName === "Próximamente" || categories.length === 0) {
      return;
    }
    
    // Navegar a la página de categoría con los parámetros
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const subcategorySlug = subcategoryName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/categoria/${categorySlug}/${subcategorySlug}`);
    setActiveDropdown(null);
  };

  return (
    <nav className="w-full" style={{ backgroundColor: 'var(--interaction-blue)' }} ref={navRef}>
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
        <div className="flex justify-between items-center py-4">
          {mainCategories.map((category, index) => (
            <div
              key={index}
              className="relative"
            >
              <button
                onClick={() => handleCategoryClick(index)}
                className="text-gray-700 font-semibold text-xl md:text-2xl px-6 py-3 hover:bg-blue-100 rounded-lg transition-all duration-200 min-w-[140px]"
                style={{ 
                  backgroundColor: activeDropdown === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  color: 'var(--brand-blue)'
                }}
              >
                {category.name}
              </button>
              
              {activeDropdown === index && category.hasSubmenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[240px]">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleSubcategoryClick(category.name, subcategory.name, subcategory.categories)}
                      className={`px-5 py-4 text-gray-700 cursor-pointer transition-colors duration-200 ${
                        subcategory.name === "Próximamente" || subcategory.categories.length === 0
                          ? 'opacity-60 cursor-not-allowed'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-semibold text-lg">{subcategory.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
