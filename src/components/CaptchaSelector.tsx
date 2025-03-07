import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    onTurnstileLoad?: () => void;
  }
}

export const CaptchaSelector: React.FC<CaptchaSelectorProps> = ({ onVerify }) => {
  const [captchaType, setCaptchaType] = useState<'hcaptcha' | 'turnstile'>('hcaptcha');
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const turnstileInitialized = useRef(false);
  const scriptLoaded = useRef(false);

  const handleTurnstileVerify = useCallback((token: string) => {
    setIsVerified(true);
    onVerify(token);
  }, [onVerify]);

  const initTurnstile = useCallback(() => {
    if (!window.turnstile || captchaType !== 'turnstile' || turnstileInitialized.current) return;

    const container = document.getElementById('turnstile-container');
    if (!container) return;

    try {
      // Clean up existing widget if any
      if (turnstileWidget && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidget);
        } catch (e) {
          console.error('Failed to remove existing widget:', e);
        }
      }

      // Create new widget
      const widgetId = window.turnstile.render(container, {
        sitekey: config.captcha.turnstile.siteKey,
        callback: handleTurnstileVerify,
        theme: 'light',
        'refresh-expired': 'manual',
        'error-callback': () => {
          console.error('Turnstile encountered an error');
          setIsLoading(false);
        },
        'timeout-callback': () => {
          console.error('Turnstile timed out');
          setIsLoading(false);
        }
      });

      setTurnstileWidget(widgetId);
      turnstileInitialized.current = true;
      setIsLoading(false);
    } catch (e) {
      console.error('Failed to initialize Turnstile:', e);
      setIsLoading(false);
    }
  }, [captchaType, turnstileWidget, handleTurnstileVerify]);

  useEffect(() => {
    if (captchaType === 'turnstile' && !scriptLoaded.current) {
      setIsLoading(true);

      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (existingScript) {
        scriptLoaded.current = true;
        initTurnstile();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptLoaded.current = true;
        // Small delay to ensure Turnstile is fully initialized
        setTimeout(() => {
          initTurnstile();
        }, 100);
      };

      script.onerror = (error) => {
        console.error('Failed to load Turnstile script:', error);
        setIsLoading(false);
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        scriptLoaded.current = false;
      };
    }
  }, [captchaType, initTurnstile]);

  // Reset states when switching captcha type
  useEffect(() => {
    setIsVerified(false);
    turnstileInitialized.current = false;
    if (turnstileWidget && window.turnstile) {
      try {
        window.turnstile.remove(turnstileWidget);
      } catch (e) {
        console.error('Failed to remove widget during type switch:', e);
      }
    }
  }, [captchaType, turnstileWidget]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (turnstileWidget && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidget);
        } catch (e) {
          console.error('Failed to cleanup widget on unmount:', e);
        }
      }
    };
  }, [turnstileWidget]);

  const handleCaptchaTypeChange = (type: 'hcaptcha' | 'turnstile') => {
    setCaptchaType(type);
    setIsVerified(false);
    setIsLoading(false);
    turnstileInitialized.current = false;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleCaptchaTypeChange('hcaptcha')}
          className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
            captchaType === 'hcaptcha' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
          disabled={isLoading}
        >
          <ShieldCheck className="w-4 h-4" />
          hCaptcha
        </button>
        <button
          onClick={() => handleCaptchaTypeChange('turnstile')}
          className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
            captchaType === 'turnstile' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
          disabled={isLoading}
        >
          <ShieldCheck className="w-4 h-4" />
          Turnstile
        </button>
      </div>

      <div className="flex justify-center">
        {captchaType === 'hcaptcha' ? (
          <HCaptcha
            sitekey={config.captcha.hcaptcha.siteKey}
            onVerify={(token) => {
              setIsVerified(true);
              onVerify(token);
            }}
            theme="light"
            size="normal"
          />
        ) : (
          <div 
            id="turnstile-container" 
            className={`min-h-[65px] ${isVerified ? 'opacity-50' : ''}`}
          >
            {isLoading && (
              <div className="flex items-center justify-center h-[65px]">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {isVerified && (
        <div className="text-center text-green-600 dark:text-green-400 font-medium">
          ✓ Verification successful
        </div>
      )}
    </div>
  );
};