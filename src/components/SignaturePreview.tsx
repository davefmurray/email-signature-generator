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
    <div
      className={`
        relative rounded-2xl p-6 min-h-[180px] transition-colors duration-300 border border-[var(--border)]
        ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}
      `}
    >
      {/* Theme Toggle - positioned top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      </div>

      {/* Signature Content */}
      <div className="pr-16">
        {hasContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={isDark ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[140px]">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[var(--muted)]'}`}>
              Fill in the form to see your signature
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
