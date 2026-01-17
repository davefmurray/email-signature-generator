'use client';

import { SignatureData, generateSignatureHtml } from '@/lib/generateSignatureHtml';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

interface SignaturePreviewProps {
  data: SignatureData;
}

export default function SignaturePreview({ data }: SignaturePreviewProps) {
  const [isDark, setIsDark] = useState(false);
  const html = generateSignatureHtml(data);

  const hasContent = data.name || data.title || data.company || data.phone || data.twitter || data.logoUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[var(--foreground)]">Preview</h2>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      </div>

      <div
        className={`
          rounded-xl p-6 border border-[var(--border)] min-h-[160px] transition-colors duration-300
          ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}
        `}
      >
        {hasContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={isDark ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[120px]">
            <p className="text-[var(--muted)] text-sm">
              Fill in the form to see your signature
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
