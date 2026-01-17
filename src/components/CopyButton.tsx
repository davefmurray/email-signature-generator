'use client';

import { useState } from 'react';
import { SignatureData, generateSignatureHtml } from '@/lib/generateSignatureHtml';

interface CopyButtonProps {
  data: SignatureData;
  disabled?: boolean;
}

export default function CopyButton({ data, disabled }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const html = generateSignatureHtml(data);

    try {
      // Try to copy as rich HTML using Clipboard API with HTML MIME type
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([html], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([clipboardItem]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback to plain text copy
      try {
        await navigator.clipboard.writeText(html);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={disabled || copied}
      className={`
        w-full px-6 py-3 rounded-xl font-medium transition-all duration-200
        ${disabled
          ? 'bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed'
          : copied
            ? 'bg-green-600 text-white'
            : 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98]'
        }
      `}
    >
      {copied ? (
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Signature HTML
        </span>
      )}
    </button>
  );
}
