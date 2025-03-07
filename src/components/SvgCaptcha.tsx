import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import svgCaptcha from 'svg-captcha';

interface SvgCaptchaProps {
  onVerify: (token: string) => void;
}

export const SvgCaptcha: React.FC<SvgCaptchaProps> = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState({ data: '', text: '' });
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const newCaptcha = svgCaptcha.create({
      size: 6,
      noise: 2,
      color: true,
      background: '#ffffff',
    });
    setCaptcha(newCaptcha);
    setUserInput('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput.toLowerCase() === captcha.text.toLowerCase()) {
      setIsVerified(true);
      onVerify(`svg_${Date.now()}_${captcha.text}`);
    } else {
      setIsVerified(false);
      setUserInput('');
      generateCaptcha();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Enter the text shown below
            </span>
            <button
              onClick={generateCaptcha}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={isVerified}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          <div 
            className="mb-4 p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-600"
            dangerouslySetInnerHTML={{ __html: captcha.data }}
          />

          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-3 py-2 text-lg border rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 
                       bg-gray-50 dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100
                       border-gray-300 dark:border-gray-600
                       placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter captcha text"
              disabled={isVerified}
            />
            <button
              onClick={handleVerify}
              disabled={!userInput || isVerified}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md 
                       hover:bg-yellow-600 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200
                       font-medium"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      {isVerified && (
        <div className="text-center text-green-600 dark:text-green-400 font-medium">
          ✓ Verification successful
        </div>
      )}
    </div>
  );
};