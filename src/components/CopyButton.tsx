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
        w-full px-6 py-3.5 rounded-full font-medium transition-all duration-200
        ${disabled
          ? 'bg-[var(--border)] text-[var(--muted)] cursor-not-allowed'
          : copied
            ? 'bg-green-600 text-white'
            : 'bg-[var(--accent)] text-[var(--surface)] hover:opacity-90 active:scale-[0.98]'
        }
      `}
    >
      {copied ? 'Copied!' : 'Copy Signature'}
    </button>
  );
}
