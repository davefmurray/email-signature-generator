'use client';

import { SignatureData } from '@/lib/generateSignatureHtml';
import ImageUpload from './ImageUpload';

interface SignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
}

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  prefix?: string;
}

function InputField({ value, onChange, placeholder, type = 'text', prefix }: InputFieldProps) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${prefix ? 'pl-10' : 'px-5'} pr-5 py-4 bg-[var(--input)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted)] text-base`}
      />
    </div>
  );
}

export default function SignatureForm({ data, onChange }: SignatureFormProps) {
  const updateField = (field: keyof SignatureData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Name + Position */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          value={data.name}
          onChange={(v) => updateField('name', v)}
          placeholder="Your name"
        />
        <InputField
          value={data.title}
          onChange={(v) => updateField('title', v)}
          placeholder="Position"
        />
      </div>

      {/* Row 2: Phone + Twitter */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          value={data.phone}
          onChange={(v) => updateField('phone', v)}
          placeholder="Phone nr (optional)"
          type="tel"
        />
        <InputField
          value={data.twitter}
          onChange={(v) => updateField('twitter', v)}
          placeholder="Twitter handle"
          prefix="@"
        />
      </div>

      {/* Row 3: Company + Website (collapsed into one row) */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          value={data.company}
          onChange={(v) => updateField('company', v)}
          placeholder="Company (optional)"
        />
        <InputField
          value={data.websiteUrl}
          onChange={(v) => updateField('websiteUrl', v)}
          placeholder="Website (optional)"
          type="url"
        />
      </div>

      {/* Logo Upload */}
      <ImageUpload
        logoUrl={data.logoUrl}
        onUpload={(url) => updateField('logoUrl', url)}
        onClear={() => updateField('logoUrl', '')}
      />
    </div>
  );
}
