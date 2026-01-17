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
      <div className="flex items-center gap-4 p-4 bg-[var(--input)] border border-[var(--border)] rounded-2xl">
        <img
          src={logoUrl}
          alt="Uploaded logo"
          className="w-14 h-14 rounded-lg object-cover"
        />
        <div className="flex-1 text-sm text-[var(--muted)]">Logo uploaded</div>
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] bg-white border border-[var(--border)] rounded-xl hover:bg-[var(--border)] transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors
          ${isDragging
            ? 'border-[var(--foreground)] bg-[var(--input)]'
            : 'border-[var(--border)] bg-[var(--input)] hover:border-[var(--muted)]'
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
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-[var(--muted)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-[var(--muted)]">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="text-[var(--muted)]">
              Upload logo <span className="text-[var(--muted)]/70">(square, optional)</span>
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
