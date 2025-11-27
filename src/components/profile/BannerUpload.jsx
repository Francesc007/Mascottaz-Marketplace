"use client";

import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
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
  const [startY, setStartY] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await ProfileStorageService.uploadBanner(file, userId);
    
    if (result.success) {
      onBannerUpdate({
        banner_url: result.url,
        banner_position: position
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
    setStartPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const deltaY = e.clientY - startY;
    const newPosition = Math.max(-50, Math.min(50, startPosition + (deltaY / 5)));
    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      onBannerUpdate({
        banner_url: bannerUrl,
        banner_position: position
      });
    }
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
          className="absolute inset-0 cursor-move"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: `center ${position}%`,
            backgroundRepeat: 'no-repeat'
          }}
          onMouseDown={handleMouseDown}
        >
          {dragging && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <p className="text-white font-semibold">Ajustando posición...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
          <p className="text-gray-600">Sin banner</p>
        </div>
      )}

      {/* Botón de subir/cambiar banner */}
      <label className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
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

      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Subiendo banner...</p>
          </div>
        </div>
      )}
    </div>
  );
}

