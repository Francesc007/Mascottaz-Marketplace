"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export default function PostalCodeInput() {
  const [postalCode, setPostalCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Cargar código postal guardado del localStorage
    const savedPostalCode = localStorage.getItem("postalCode");
    if (savedPostalCode) {
      setPostalCode(savedPostalCode);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postalCode.trim().length >= 5) {
      localStorage.setItem("postalCode", postalCode.trim());
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length <= 5) {
      setPostalCode(value);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-600" />
        <input
          type="text"
          value={postalCode}
          onChange={handleChange}
          placeholder="CP"
          maxLength={5}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: '#fff' }}
          autoFocus
          onBlur={handleSubmit}
        />
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
    >
      <MapPin className="w-4 h-4 text-gray-600" />
      <span className="text-gray-700">
        {postalCode || "Código Postal"}
      </span>
    </button>
  );
}

