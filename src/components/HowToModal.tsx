'use client';

import { useState } from 'react';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'gmail' | 'macos' | 'ios';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'gmail', label: 'Gmail' },
  { key: 'macos', label: 'macOS Mail' },
  { key: 'ios', label: 'iOS Mail' },
];

const instructions: Record<TabKey, { steps: string[] }> = {
  gmail: {
    steps: [
      'Click the gear icon in Gmail and select "See all settings"',
      'Scroll down to the "Signature" section',
      'Click "Create new" to add a new signature',
      'In the signature editor, click the formatting toolbar',
      'Paste your copied signature (Cmd+V or Ctrl+V)',
      'The signature should appear with formatting intact',
      'Scroll down and click "Save Changes"',
    ],
  },
  macos: {
    steps: [
      'Open Mail and go to Mail → Settings (or Preferences)',
      'Click the "Signatures" tab',
      'Select an email account on the left',
      'Click the + button to create a new signature',
      'Give your signature a name',
      'In the preview pane on the right, paste your signature',
      'Drag the new signature to your account to assign it',
      'Close Settings - your signature is saved automatically',
    ],
  },
  ios: {
    steps: [
      'Open the Settings app on your iPhone or iPad',
      'Scroll down and tap "Mail"',
      'Tap "Signature" near the bottom',
      'If you have multiple accounts, choose "Per Account" or "All Accounts"',
      'Tap in the text field and clear any existing signature',
      'Paste your signature (tap and hold, then Paste)',
      'Note: iOS Mail has limited HTML support - formatting may vary',
      'Tap back to save',
    ],
  },
};

export default function HowToModal({ isOpen, onClose }: HowToModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('gmail');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[var(--background)] rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            How to Import Your Signature
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-lg hover:bg-[var(--surface)]"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.key
                  ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] -mb-px'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <ol className="space-y-3">
            {instructions[activeTab].steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface)] text-[var(--accent)] text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-[var(--foreground)] pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--surface)] rounded-xl hover:bg-[var(--border)] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
