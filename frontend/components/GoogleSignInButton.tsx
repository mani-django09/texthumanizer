'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({
  onError,
  onSuccess,
  referralCode,
}: {
  onError?: (message: string) => void;
  onSuccess?: () => void;
  referralCode?: string;
}) {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return;

    const initialize = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential, referralCode);
            onSuccess?.();
          } catch (err) {
            onError?.(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.');
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      });
    };

    if (window.google) {
      initialize();
      return;
    }

    const existing = document.getElementById('google-identity-script');
    if (existing) {
      existing.addEventListener('load', initialize);
      return () => existing.removeEventListener('load', initialize);
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initialize;
    document.body.appendChild(script);
  }, [loginWithGoogle, onError, onSuccess, referralCode]);

  if (!GOOGLE_CLIENT_ID) return null;

  return <div ref={buttonRef} className="flex justify-center" />;
}
