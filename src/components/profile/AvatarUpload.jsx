"use client";

import { useState, useRef } from "react";
import { Camera, User } from "lucide-react";
import ProfileStorageService from "../../lib/profile/storage";

export default function AvatarUpload({ 
  avatarUrl, 
  onAvatarUpdate,
  userId 
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await ProfileStorageService.uploadAvatar(file, userId);
    
    if (result.success) {
      onAvatarUpdate({
        avatar_url: result.url
      });
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <User className="w-16 h-16 text-blue-600" />
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
        <Camera className="w-4 h-4" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}




