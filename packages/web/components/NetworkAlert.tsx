'use client';

import { useNetworkAlert } from '../hooks/useNetworkAlert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from 'ui';
import { useNetworkGuard } from '../hooks/useNetworkGuard';

interface NetworkAlertProps {
  showButton?: boolean;
  className?: string;
}

export function NetworkAlert({ showButton = false, className = '' }: NetworkAlertProps) {
  const { isWrongNetwork, isConnected, currentChainId } = useNetworkAlert();
  const { switchToMorph, isLoading } = useNetworkGuard();

  if (!isConnected) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs ${className}`}>
        <WifiOff className="h-3 w-3" />
        <span>Not Connected</span>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Orange Warning Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs animate-pulse">
          <AlertTriangle className="h-3 w-3" />
          <span>Wrong Network</span>
          <span className="text-xs opacity-75">({currentChainId})</span>
        </div>
        
        {/* Switch Button (optional) */}
        {showButton && (
          <Button
            onClick={switchToMorph}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="text-xs h-7 bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40"
          >
            {isLoading ? 'Switching...' : 'Switch to Morph'}
          </Button>
        )}
      </div>
    );
  }

  // Correct network
  return (
    <div className={`flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs ${className}`}>
      <Wifi className="h-3 w-3" />
      <span>Morph L2</span>
    </div>
  );
}

// Enhanced Network Badge for Navbar
export function NetworkBadge() {
  const { isWrongNetwork, isConnected, currentChainId } = useNetworkAlert();
  
  // Chain name mapping
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    2810: 'Morph Holesky',
    2818: 'Morph Mainnet',
    11155111: 'Sepolia',
    137: 'Polygon',
    56: 'BSC',
  };
  
  const chainName = chainNames[currentChainId] || `Chain ${currentChainId}`;
  
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
        <WifiOff className="h-3 w-3" />
        <span>Disconnected</span>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs animate-pulse">
        <AlertTriangle className="h-3 w-3" />
        <span>{chainName}</span>
        <span className="text-[10px] opacity-75">⚠️</span>
      </div>
    );
  }

  // Correct network - Green badge
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
      <Wifi className="h-3 w-3" />
      <span>{chainName}</span>
    </div>
  );
}

// Export hook for external use
export { useNetworkAlert }; 