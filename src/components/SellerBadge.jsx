"use client";

import { useState } from "react";
import { PawPrint } from "lucide-react";

export default function SellerBadge({ verified }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!verified) return null;

  return (
    <div 
      className="relative inline-flex items-center gap-1 px-2 py-1 rounded-full border border-blue-200 bg-blue-50 cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <PawPrint className="w-3 h-3 text-blue-600" />
      <span className="text-[11px] font-semibold text-blue-700">
        Vendedor verificado
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          Vendedor verificado por Mascottaz — INE y comprobante revisados
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}


