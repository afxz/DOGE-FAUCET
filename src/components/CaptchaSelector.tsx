import React, { useState, useCallback } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';
import { SvgCaptcha } from './SvgCaptcha';

interface CaptchaSelectorProps {
  onVerify: (token: string) => void;
}

export const CaptchaSelector: React.FC<CaptchaSelectorProps> = ({ onVerify }) => {
  const [mathProblem, setMathProblem] = useState(() => ({
    a: Math.ceil(Math.random() * 10),
    b: Math.ceil(Math.random() * 10)
  }));
  const [mathAnswer, setMathAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [captchaType, setCaptchaType] = useState<'math' | 'svg'>('math');
  
  const generateMathProblem = useCallback(() => {
    const a = Math.ceil(Math.random() * 10);
    const b = Math.ceil(Math.random() * 10);
    setMathProblem({ a, b });
    setMathAnswer('');
    setIsVerified(false);
  }, []);

  const handleMathVerify = () => {
    const isCorrect = parseInt(mathAnswer) === (mathProblem.a + mathProblem.b);
    if (isCorrect) {
      setIsVerified(true);
      const token = `math_${Date.now()}_${mathProblem.a}_${mathProblem.b}`;
      onVerify(token);
    } else {
      setIsVerified(false);
      generateMathProblem();
      setMathAnswer('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCaptchaType('math')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
            ${captchaType === 'math'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          <Calculator className="w-5 h-5" />
          Math Captcha
        </button>
        <button
          onClick={() => setCaptchaType('svg')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
            ${captchaType === 'svg'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          <ShieldCheck className="w-5 h-5" />
          SVG Captcha
        </button>
      </div>

      {captchaType === 'math' ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4 text-yellow-500">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="text-center mb-4">
                <span className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  What is {mathProblem.a} + {mathProblem.b}?
                </span>
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  className="w-24 px-3 py-2 text-lg border rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-gray-100
                           border-gray-300 dark:border-gray-600
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Answer"
                  disabled={isVerified}
                />
                <button
                  onClick={handleMathVerify}
                  disabled={!mathAnswer || isVerified}
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
      ) : (
        <SvgCaptcha onVerify={onVerify} />
      )}
    </div>
  );
};