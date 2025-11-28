"use client";

import { useState, useRef } from "react";
import { Camera, Save, X } from "lucide-react";
import ProfileStorageService from "../../lib/profile/storage";

export default function BannerUpload({ 
  bannerUrl, 
  bannerPosition = 0,
  onBannerUpdate,
  userId 
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(bannerPosition);
  const [tempPosition, setTempPosition] = useState(bannerPosition);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await ProfileStorageService.uploadBanner(file, userId);
    
    if (result.success) {
      setPosition(0);
      setTempPosition(0);
      setHasUnsavedChanges(false);
      onBannerUpdate({
        banner_url: result.url,
        banner_position: 0
      });
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartY(e.clientY);
    setStartPosition(tempPosition);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const deltaY = e.clientY - startY;
    const newPosition = Math.max(-50, Math.min(50, startPosition + (deltaY / 5)));
    setTempPosition(newPosition);
    setHasUnsavedChanges(newPosition !== position);
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  const handleSavePosition = () => {
    setPosition(tempPosition);
    setHasUnsavedChanges(false);
    setDragging(false); // Asegurar que se detenga el arrastre
    onBannerUpdate({
      banner_url: bannerUrl,
      banner_position: tempPosition
    });
  };

  const handleCancelPosition = () => {
    setTempPosition(position);
    setHasUnsavedChanges(false);
  };

  return (
    <div 
      className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-200 rounded-t-xl"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {bannerUrl ? (
        <div
          className={`absolute inset-0 ${hasUnsavedChanges ? 'cursor-move' : 'cursor-default'}`}
          style={{
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: `center ${tempPosition}%`,
            backgroundRepeat: 'no-repeat'
          }}
          onMouseDown={hasUnsavedChanges ? handleMouseDown : undefined}
        >
          {dragging && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-gray-800 font-semibold">Ajustando posición...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
          <p className="text-gray-600">Sin banner</p>
        </div>
      )}

      {/* Botones de guardar/cancelar y cámara cuando hay cambios sin guardar */}
      {hasUnsavedChanges && !dragging ? (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleCancelPosition}
            className="bg-gray-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleSavePosition}
            className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      ) : (
        /* Botón de subir/cambiar banner */
        <label className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors cursor-pointer z-10">
          <Camera className="w-5 h-5 text-gray-700" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Subiendo banner...</p>
          </div>
        </div>
      )}
    </div>
  );
}



