import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface ImageUploadZoneProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ImageUploadZone({ label, value, onChange, className }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // In a real app, you would upload the file to a server and get the URL back.
    // For now, we'll just create a local object URL to preview it.
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
        {label}
      </label>
      <div
        className={cn(
          "relative group cursor-pointer flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden bg-gray-50 dark:bg-white/5",
          isDragging 
            ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10" 
            : "border-gray-200 dark:border-white/10 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-white/10",
          value && "border-solid border-gray-200 dark:border-white/10"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !value && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {value ? (
          <div className="relative w-full h-full group">
            <Image src={value} alt={label} fill className="object-contain p-2" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-500 hover:scale-110 transition-all"
                title={isRtl ? "تغيير الصورة" : "Change Image"}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-white rounded-full text-red-500 hover:text-red-600 hover:scale-110 transition-all"
                title={isRtl ? "إزالة الصورة" : "Remove Image"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors">
            <div className="w-12 h-12 mb-3 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold mb-1">
              {isRtl ? 'انقر أو اسحب وأفلت' : 'Click or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isRtl ? 'SVG, PNG, JPG أو GIF (بحد أقصى 2 ميجابايت)' : 'SVG, PNG, JPG or GIF (max. 2MB)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
