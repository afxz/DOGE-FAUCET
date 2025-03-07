import React from 'react';
import { useClaimTimer } from '../hooks/useClaimTimer';
import { config } from '../config/settings';

export const ClaimTimer: React.FC = () => {
  const { timeLeft, claimsToday } = useClaimTimer();

  return (
    <div className="text-center mb-6">
      <div className="text-2xl font-bold mb-2">
        {timeLeft === '0:00' ? (
          <span className="text-green-500">Ready to Claim!</span>
        ) : (
          <span className="text-blue-500">{timeLeft}</span>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Claims today: {claimsToday} / {config.faucetpay.maxClaimsPerDay}
      </div>
    </div>
  );
};