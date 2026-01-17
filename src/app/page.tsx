'use client';

import { useState } from 'react';
import SignatureForm from '@/components/SignatureForm';
import SignaturePreview from '@/components/SignaturePreview';
import CopyButton from '@/components/CopyButton';
import HowToModal from '@/components/HowToModal';
import { SignatureData } from '@/lib/generateSignatureHtml';

const initialData: SignatureData = {
  name: '',
  title: '',
  company: '',
  phone: '',
  twitter: '',
  websiteUrl: '',
  logoUrl: '',
};

export default function Home() {
  const [data, setData] = useState<SignatureData>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasRequiredFields = data.name.trim().length > 0;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Create your email signature
          </h1>
          <p className="text-[var(--muted)]">
            Fill in your details and copy it to your email client
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <SignatureForm data={data} onChange={setData} />
        </div>

        {/* Preview Section */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <SignaturePreview data={data} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CopyButton data={data} disabled={!hasRequiredFields} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-full font-medium bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
          >
            How to import?
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-[var(--muted)]">
          <p>Your data stays in your browser.</p>
        </footer>
      </div>

      <HowToModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
