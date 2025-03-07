import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface SvgCaptchaProps {
  onVerify: (token: string) => void;
}

export const SvgCaptcha: React.FC<SvgCaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateRandomText = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise (random dots)
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Add lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw each character with slight rotation
    const chars = text.split('');
    const charWidth = canvas.width / (chars.length + 2);
    chars.forEach((char, i) => {
      const x = charWidth * (i + 1.5);
      const y = canvas.height / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.5);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  };

  const generateCaptcha = () => {
    const newText = generateRandomText();
    setCaptchaText(newText);
    drawCaptcha(newText);
    setUserInput('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsVerified(true);
      onVerify(`canvas_${Date.now()}_${captchaText}`);
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
          
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-600">
            <canvas
              ref={canvasRef}
              width={200}
              height={60}
              className="w-full"
            />
          </div>

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