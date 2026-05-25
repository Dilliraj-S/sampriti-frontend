"use client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { uploadApi } from "@/services/api.client";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadApi.upload(file);
    if (url) onChange(url);
    setUploading(false);
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="flex items-center gap-3">
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Paste image URL or upload" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black text-sm" />
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 text-sm whitespace-nowrap">
          {uploading ? "..." : "Upload"}
        </button>
        {value && <button type="button" onClick={() => onChange("")} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
      </div>
      {value && <img src={value} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-lg border border-gray-200" />}
    </div>
  );
}