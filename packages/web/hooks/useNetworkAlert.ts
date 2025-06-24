'use client';

import { useAccount, useChainId } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export interface NetworkAlertStatus {
  isWrongNetwork: boolean;
  currentChainId: number;
  isConnected: boolean;
  canProceed: boolean;
  shouldShowAlert: boolean;
}

export interface NetworkAlertResult extends NetworkAlertStatus {
  checkNetwork: () => boolean;
  showNetworkWarning: () => void;
}

// ✅ Clear conditions: Support only 2810 and 2818 networks
const SUPPORTED_CHAIN_IDS = [2810, 2818]; // Morph Holesky & Mainnet

export function useNetworkAlert(): NetworkAlertResult {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // ✅ Condition: chainId not equal to 2810 or 2818 = Wrong Network
  const isWrongNetwork = isConnected && !SUPPORTED_CHAIN_IDS.includes(chainId);
  const canProceed = isConnected && !isWrongNetwork;
  const shouldShowAlert = isConnected && isWrongNetwork;

  const networkStatus: NetworkAlertStatus = {
    isWrongNetwork,
    currentChainId: chainId,
    isConnected,
    canProceed,
    shouldShowAlert,
  };

  // Reset warning state when network becomes correct
  useEffect(() => {
    if (!isWrongNetwork) {
      setHasShownWarning(false);
    }
  }, [isWrongNetwork]);

  const showNetworkWarning = useCallback(() => {
    if (isWrongNetwork && !hasShownWarning) {
      toast.error('Please switch to Morph L2', {
        duration: 4000,
        style: {
          background: '#FEF3C7', // Yellow background
          color: '#92400E', // Dark yellow text
          border: '1px solid #F59E0B',
        },
        icon: '⚠️',
      });
      setHasShownWarning(true);
    }
  }, [isWrongNetwork, hasShownWarning]);

  const checkNetwork = useCallback((): boolean => {
    if (!isConnected) {
      return false; // Not connected, can't proceed
    }

    if (isWrongNetwork) {
      showNetworkWarning();
      return false; // Wrong network, can't proceed
    }

    return true; // Correct network, can proceed
  }, [isConnected, isWrongNetwork, showNetworkWarning]);

  // Auto-check network on mount for all pages
  useEffect(() => {
    if (isConnected) {
      checkNetwork();
    }
  }, [isConnected, checkNetwork]);

  return {
    ...networkStatus,
    checkNetwork,
    showNetworkWarning,
  };
} 