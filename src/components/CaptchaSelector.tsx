import React, { useState } from 'react';
import { config } from '../config/settings';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import ReCAPTCHA from 'react-google-recaptcha';

interface CaptchaSelectorProps {
  onVerify: (token: string) => void;
}

export const CaptchaSelector: React.FC<CaptchaSelectorProps> = ({ onVerify }) => {
  const [captchaType, setCaptchaType] = useState<'google' | 'hcaptcha'>('google');

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCaptchaType('google')}
          className={`px-4 py-2 rounded ${
            captchaType === 'google' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Google ReCAPTCHA
        </button>
        <button
          onClick={() => setCaptchaType('hcaptcha')}
          className={`px-4 py-2 rounded ${
            captchaType === 'hcaptcha' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          hCaptcha
        </button>
      </div>

      <div className="flex justify-center">
        {captchaType === 'google' ? (
          <ReCAPTCHA
            sitekey={config.captcha.google.siteKey}
            onChange={(token) => token && onVerify(token)}
          />
        ) : (
          <HCaptcha
            sitekey={config.captcha.hcaptcha.siteKey}
            onVerify={(token) => onVerify(token)}
          />
        )}
      </div>
    </div>
  );
};