"use client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { uploadApi } from "@/services/api.client";

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function GalleryUpload({ images, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadApi.upload(file);
    if (url) onChange([...images, url]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt={`Gallery ${i + 1}`} className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
            <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X size={12} /></button>
          </div>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="h-16 w-16 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50 bg-gray-50">
          {uploading ? <span className="text-xs text-gray-400">...</span> : <ImageIcon size={20} className="text-gray-400" />}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
    </div>
  );
}
