import React, { useState, useRef } from 'react';
import { config } from '../config/settings';
import { CaptchaSelector } from './CaptchaSelector';
import { ClaimTimer } from './ClaimTimer';
import { useClaimTimer } from '../hooks/useClaimTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowRight, Coins, Gift, AlertCircle } from 'lucide-react';

export const ClaimForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { canClaim, recordClaim, timeLeft, claimsToday } = useClaimTimer();

  const handleClaim = async () => {
    if (!canClaim || !captchaToken || !address) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://faucetpay.io/api/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: config.faucetpay.apiKey,
          to: address,
          amount: config.faucetpay.minAmount,
          currency: config.faucetpay.currency,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        setSuccess(`Successfully sent ${config.faucetpay.minAmount} DOGE!`);
        recordClaim();
        audioRef.current?.play();
      } else {
        setError(data.message || 'Failed to process claim');
      }
    } catch (err) {
      setError('Failed to connect to FaucetPay API');
    }

    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-center mb-6 space-x-2">
        <Coins className="w-8 h-8 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Claim Your DOGE
        </h2>
      </div>
      
      <ClaimTimer />

      <motion.div 
        className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6 flex items-start space-x-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Gift className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        <div>
          <p className="text-yellow-700 dark:text-yellow-300 font-medium">Available Reward</p>
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">
            {config.faucetpay.minAmount} DOGE per claim
          </p>
        </div>
      </motion.div>
      
      <div className="space-y-6">
        <div className="relative">
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused 
                ? '0 0 20px rgba(255, 198, 27, 0.3)' 
                : '0 0 0 rgba(255, 198, 27, 0)'
            }}
            className="relative rounded-lg overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-yellow-500" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="block w-full pl-10 pr-12 py-3 border-2 border-yellow-500 
                       rounded-lg bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white placeholder-gray-400
                       focus:outline-none focus:border-yellow-600
                       transition-all duration-200 ease-in-out"
              placeholder="Enter your FaucetPay DOGE address"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ArrowRight className="h-5 w-5 text-yellow-500" />
            </div>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: isFocused ? 1 : 0 }}
            className="absolute -bottom-6 left-0 right-0 text-center text-sm text-yellow-600 dark:text-yellow-400"
          >
            Make sure to enter your correct FaucetPay DOGE address
          </motion.div>
        </div>

        <div className="mt-8">
          <CaptchaSelector onVerify={(token) => setCaptchaToken(token)} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClaim}
          disabled={!canClaim || !captchaToken || !address || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                     transition-colors duration-200 flex items-center justify-center space-x-2
                     ${canClaim && captchaToken && address && !loading
                       ? 'bg-yellow-500 hover:bg-yellow-600'
                       : 'bg-gray-400 cursor-not-allowed'}`}
        >
          <Coins className="w-5 h-5" />
          <span>{loading ? 'Claiming...' : 'Claim DOGE Now!'}</span>
        </motion.button>

        {(!address || !captchaToken) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <AlertCircle className="w-4 h-4" />
            <span>
              {!address 
                ? 'Enter your DOGE address to claim'
                : 'Complete the captcha to continue'}
            </span>
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded"
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-4 rounded flex items-center space-x-2"
            >
              <div className="flex-shrink-0">
                <Coins className="w-5 h-5 text-green-500" />
              </div>
              <div>{success}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center items-center space-x-2"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <span className="text-gray-600 dark:text-gray-400">Processing claim...</span>
          </motion.div>
        )}
      </div>

      <audio ref={audioRef} src={config.sounds.claim} preload="auto" />
    </motion.div>
  );
};