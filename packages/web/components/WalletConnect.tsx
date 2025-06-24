'use client';

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { Button } from 'ui';
import { formatAddress } from 'ui';
import { Wallet, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { morphHolesky, morphMainnet } from '../lib/wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [showConnectors, setShowConnectors] = useState(false);

  const supportedChains = [morphHolesky, morphMainnet];
  const currentChain = supportedChains.find(chain => chain.id === chainId);
  const isCorrectChain = !!currentChain;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <div className={`w-2 h-2 rounded-full ${
            isCorrectChain ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-muted-foreground">
            {currentChain?.name || 'Unsupported Network'}
          </span>
          {!isCorrectChain && (
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-medium">{formatAddress(address)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => disconnect()}
          className="h-9 w-9"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button 
        onClick={() => setShowConnectors(!showConnectors)}
        variant="default"
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
        <ChevronDown className="h-4 w-4" />
      </Button>

      {showConnectors && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-popover border rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  setShowConnectors(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
              >
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="h-3 w-3" />
                </div>
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function NetworkBadge() {
  const chainId = useChainId();
  
  // Map of known chains
  const chainNames: Record<number, string> = {
    1: 'Ethereum Mainnet',
    2810: 'Morph Holesky',
    2818: 'Morph Mainnet'
  };
  
  const chainName = chainNames[chainId] || `Chain ${chainId}`;
  const isCorrectChain = chainId === 2810; // Only Morph Holesky is supported
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full text-xs">
      <div className={`w-2 h-2 rounded-full ${
        isCorrectChain ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      {chainName}
      {!isCorrectChain && (
        <AlertTriangle className="h-3 w-3 text-yellow-500 ml-1" />
      )}
    </div>
  );
} 