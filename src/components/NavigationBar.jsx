"use client";

import { useState } from "react";

export default function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);

  const mainCategories = [
    {
      name: "Mascotas",
      hasSubmenu: true,
      subcategories: [
        {
          name: "Perros",
          categories: ["Alimentos", "Juguetes", "Ropa", "Accesorios", "Estética"]
        },
        {
          name: "Gatos", 
          categories: ["Alimentos", "Juguetes", "Ropa", "Accesorios", "Estética"]
        },
        {
          name: "Mamíferos Pequeños",
          categories: ["Alimentos", "Juguetes", "Jaulas", "Sustratos y Camas"]
        },
        {
          name: "Peces",
          categories: ["Alimentos", "Acuarios y Tanques", "Equipamiento", "Decoración"]
        }
      ]
    },
    {
      name: "Servicios",
      hasSubmenu: false
    },
    {
      name: "Farmacia", 
      hasSubmenu: false
    }
  ];

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
    setActiveSubDropdown(null);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  const handleSubMouseEnter = (subIndex) => {
    setActiveSubDropdown(subIndex);
  };

  const handleSubMouseLeave = () => {
    setActiveSubDropdown(null);
  };

  return (
    <nav className="w-full" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-12 py-4">
          {mainCategories.map((category, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-white font-semibold text-lg px-6 py-3 hover:bg-blue-700 rounded-lg transition-all duration-200 min-w-[120px]"
                style={{ backgroundColor: activeDropdown === index ? '#1d4ed8' : 'transparent' }}
              >
                {category.name}
              </button>
              
              {activeDropdown === index && category.hasSubmenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[200px]">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <div
                      key={subIndex}
                      className="relative"
                      onMouseEnter={() => handleSubMouseEnter(subIndex)}
                      onMouseLeave={handleSubMouseLeave}
                    >
                      <div className="px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                        <span className="font-medium">{subcategory.name}</span>
                        <span className="text-gray-400">›</span>
                      </div>
                      
                      {activeSubDropdown === subIndex && (
                        <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[180px]">
                          {subcategory.categories.map((item, itemIndex) => (
                            <a
                              key={itemIndex}
                              href="#"
                              className="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      )}
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
