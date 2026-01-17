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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Email Signature Generator
          </h1>
          <p className="text-[var(--muted)]">
            Create a professional signature for Gmail, macOS Mail, or iOS Mail
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <SignatureForm data={data} onChange={setData} />
          </div>

          {/* Preview Section */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
              <SignaturePreview data={data} />
            </div>

            <CopyButton data={data} disabled={!hasRequiredFields} />

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              How do I import this?
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-[var(--muted)]">
          <p>
            Made with care. Your data stays in your browser.
          </p>
        </footer>
      </div>

      <HowToModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
