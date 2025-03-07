import React, { useState, useEffect, useCallback } from 'react';
import { config } from '../config/settings';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ShieldCheck } from 'lucide-react';

interface CaptchaSelectorProps {
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const CaptchaSelector: React.FC<CaptchaSelectorProps> = ({ onVerify }) => {
  const [captchaType, setCaptchaType] = useState<'hcaptcha' | 'turnstile'>('hcaptcha');
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null);

  const initTurnstile = useCallback(() => {
    if (window.turnstile && captchaType === 'turnstile') {
      const container = document.getElementById('turnstile-container');
      if (!container) return;

      if (turnstileWidget) {
        try {
          window.turnstile.reset(turnstileWidget);
        } catch (e) {
          console.error('Failed to reset Turnstile widget:', e);
        }
      } else {
        try {
          const widgetId = window.turnstile.render(container, {
            sitekey: config.captcha.turnstile.siteKey,
            callback: onVerify,
            theme: 'light',
            'refresh-expired': 'auto'
          });
          setTurnstileWidget(widgetId);
        } catch (e) {
          console.error('Failed to render Turnstile widget:', e);
        }
      }
    }
  }, [captchaType, onVerify, turnstileWidget]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    script.defer = true;
    
    // Define the onload callback
    window.onTurnstileLoad = initTurnstile;
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.onTurnstileLoad;
    };
  }, [initTurnstile]);

  useEffect(() => {
    if (captchaType === 'turnstile') {
      initTurnstile();
    }
  }, [captchaType, initTurnstile]);

  // Cleanup Turnstile widget when component unmounts
  useEffect(() => {
    return () => {
      if (turnstileWidget && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidget);
        } catch (e) {
          console.error('Failed to remove Turnstile widget:', e);
        }
      }
    };
  }, [turnstileWidget]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCaptchaType('hcaptcha')}
          className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
            captchaType === 'hcaptcha' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          hCaptcha
        </button>
        <button
          onClick={() => setCaptchaType('turnstile')}
          className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
            captchaType === 'turnstile' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Turnstile
        </button>
      </div>

      <div className="flex justify-center">
        {captchaType === 'hcaptcha' ? (
          <HCaptcha
            sitekey={config.captcha.hcaptcha.siteKey}
            onVerify={onVerify}
            theme="light"
            size="normal"
          />
        ) : (
          <div id="turnstile-container" className="min-h-[65px]"></div>
        )}
      </div>
    </div>
  );
};