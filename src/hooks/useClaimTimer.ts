import { useState, useEffect } from 'react';
import { config } from '../config/settings';

export const useClaimTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [claimsToday, setClaimsToday] = useState(0);

  useEffect(() => {
    const lastClaim = localStorage.getItem('lastClaim');
    const claims = Number(localStorage.getItem('claimsToday') || '0');
    const today = new Date().toDateString();
    const lastClaimDate = localStorage.getItem('lastClaimDate');

    if (lastClaimDate !== today) {
      localStorage.setItem('claimsToday', '0');
      setClaimsToday(0);
    } else {
      setClaimsToday(claims);
    }

    if (lastClaim) {
      const timePassed = Date.now() - Number(lastClaim);
      const timeLeftMs = Math.max(0, config.faucetpay.timerMinutes * 60 * 1000 - timePassed);
      setTimeLeft(Math.ceil(timeLeftMs / 1000));
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const recordClaim = () => {
    localStorage.setItem('lastClaim', Date.now().toString());
    localStorage.setItem('lastClaimDate', new Date().toDateString());
    const newClaims = claimsToday + 1;
    localStorage.setItem('claimsToday', newClaims.toString());
    setClaimsToday(newClaims);
    setTimeLeft(config.faucetpay.timerMinutes * 60);
  };

  const canClaim = timeLeft === 0 && claimsToday < config.faucetpay.maxClaimsPerDay;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft: formatTime(timeLeft),
    claimsToday,
    canClaim,
    recordClaim,
  };
};