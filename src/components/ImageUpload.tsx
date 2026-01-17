'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  logoUrl: string;
  onUpload: (url: string) => void;
  onClear: () => void;
}

export default function ImageUpload({ logoUrl, onUpload, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      setIsUploading(false);
      return;
    }

    // Validate square dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      if (img.width !== img.height) {
        setError(`Image must be square. Yours is ${img.width}x${img.height}px`);
        setIsUploading(false);
        return;
      }

      // Upload the file
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const { url } = await response.json();
        onUpload(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Failed to load image');
      setIsUploading(false);
    };

    img.src = objectUrl;
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file);
    }
  }, [validateAndUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [validateAndUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (logoUrl) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Logo
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={logoUrl}
              alt="Uploaded logo"
              className="w-16 h-16 rounded-lg object-cover border border-[var(--border)]"
            />
          </div>
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--foreground)]">
        Logo
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragging
            ? 'border-[var(--accent)] bg-[var(--accent)]/5'
            : 'border-[var(--border)] hover:border-[var(--accent)]'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-8 w-8 text-[var(--accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-[var(--muted)]">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <div className="text-sm">
              <span className="text-[var(--accent)] font-medium">Click to upload</span>
              <span className="text-[var(--muted)]"> or drag and drop</span>
            </div>
            <span className="text-xs text-[var(--muted)]">Square images only (e.g., 200x200)</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
