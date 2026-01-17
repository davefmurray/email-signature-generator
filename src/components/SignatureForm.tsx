'use client';

import { SignatureData } from '@/lib/generateSignatureHtml';
import ImageUpload from './ImageUpload';

interface SignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

function InputField({ label, value, onChange, placeholder, type = 'text', required = false }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)]"
          required={required}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label={`Clear ${label}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function SignatureForm({ data, onChange }: SignatureFormProps) {
  const updateField = (field: keyof SignatureData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5 animate-stagger">
      <ImageUpload
        logoUrl={data.logoUrl}
        onUpload={(url) => updateField('logoUrl', url)}
        onClear={() => updateField('logoUrl', '')}
      />

      <InputField
        label="Name"
        value={data.name}
        onChange={(v) => updateField('name', v)}
        placeholder="John Doe"
        required
      />

      <InputField
        label="Title"
        value={data.title}
        onChange={(v) => updateField('title', v)}
        placeholder="Software Engineer"
      />

      <InputField
        label="Company"
        value={data.company}
        onChange={(v) => updateField('company', v)}
        placeholder="Acme Inc."
      />

      <InputField
        label="Phone"
        value={data.phone}
        onChange={(v) => updateField('phone', v)}
        placeholder="+1 (555) 123-4567"
        type="tel"
      />

      <InputField
        label="Twitter / X"
        value={data.twitter}
        onChange={(v) => updateField('twitter', v)}
        placeholder="johndoe"
      />

      <InputField
        label="Website URL"
        value={data.websiteUrl}
        onChange={(v) => updateField('websiteUrl', v)}
        placeholder="https://example.com"
        type="url"
      />
    </div>
  );
}
