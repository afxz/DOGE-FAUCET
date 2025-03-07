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
      render: (container: string | HTMLElement, options: any) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export const CaptchaSelector: React.FC<CaptchaSelectorProps> = ({ onVerify }) => {
  const [captchaType, setCaptchaType] = useState<'hcaptcha' | 'turnstile'>('hcaptcha');
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null);

  const initTurnstile = useCallback(() => {
    if (window.turnstile && captchaType === 'turnstile') {
      if (turnstileWidget) {
        window.turnstile.reset(turnstileWidget);
      } else {
        window.turnstile.render('#turnstile-container', {
          sitekey: config.captcha.turnstile.siteKey,
          callback: onVerify,
          theme: 'light'
        });
      }
    }
  }, [captchaType, onVerify, turnstileWidget]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = initTurnstile;

    return () => {
      document.head.removeChild(script);
    };
  }, [initTurnstile]);

  useEffect(() => {
    if (captchaType === 'turnstile') {
      initTurnstile();
    }
  }, [captchaType, initTurnstile]);

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
          <div id="turnstile-container"></div>
        )}
      </div>
    </div>
  );
};