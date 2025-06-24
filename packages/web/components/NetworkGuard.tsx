'use client';

import { useNetworkGuard } from '../hooks/useNetworkGuard';
import { AlertTriangle, CheckCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from 'ui';
import { useEffect } from 'react';

interface NetworkGuardProps {
  showBanner?: boolean;
  showInline?: boolean;
  autoAttempt?: boolean;
  blockActions?: boolean;
  onNetworkChange?: (isCorrect: boolean) => void;
}

export function NetworkGuard({ 
  showBanner = true, 
  showInline = false,
  autoAttempt = false,
  blockActions = false,
  onNetworkChange 
}: NetworkGuardProps) {
  const { 
    isCorrectChain, 
    isConnected, 
    currentChainId, 
    targetChainId,
    canProceed,
    ensureNetwork, 
    switchToMorph,
    isLoading,
    error 
  } = useNetworkGuard();

  // Notify parent component of network changes
  useEffect(() => {
    onNetworkChange?.(isCorrectChain);
  }, [isCorrectChain, onNetworkChange]);

  // Auto-attempt network switch if enabled
  useEffect(() => {
    if (autoAttempt && isConnected && !isCorrectChain) {
      ensureNetwork();
    }
  }, [autoAttempt, isConnected, isCorrectChain, ensureNetwork]);

  if (!isConnected) {
    if (!showInline) return null;
    
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
        <WifiOff className="h-4 w-4" />
        <span>Wallet not connected</span>
      </div>
    );
  }

  if (isCorrectChain) {
    if (!showInline) return null;
    
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
        <CheckCircle className="h-4 w-4" />
        <span>Connected to Morph L2</span>
      </div>
    );
  }

  // Wrong network state
  const NetworkWarning = () => (
    <div className="flex flex-col gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Wrong Network Detected</span>
      </div>
      
      <div className="text-sm text-yellow-700 dark:text-yellow-300">
        <p className="mb-2">
          PayLink requires Morph L2 network. You're currently on chain {currentChainId}.
        </p>
        <p className="text-xs">
          Please switch to Morph Holesky Testnet (Chain ID: {targetChainId}) to continue.
        </p>
      </div>

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={switchToMorph}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Switching Network...
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              Switch to Morph L2
            </>
          )}
        </Button>

        <div className="text-xs text-yellow-600 dark:text-yellow-400">
          💡 If the switch fails, the network will be added to your wallet automatically.
        </div>
      </div>
    </div>
  );

  // Banner display (global warning)
  if (showBanner) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Wrong Network: Please switch to Morph L2 to use PayLink
              </span>
            </div>
            <div className="hidden sm:block">
              <Button
                onClick={switchToMorph}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Switching...
                  </>
                ) : (
                  'Switch Network'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline display (detailed warning)
  if (showInline) {
    return <NetworkWarning />;
  }

  return null;
}

// Export hook for external use
export { useNetworkGuard }; 