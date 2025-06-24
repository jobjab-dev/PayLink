'use client';

import { Button } from 'ui';
import { Plus, ExternalLink } from 'lucide-react';
import { morphHolesky, morphMainnet } from '../lib/wagmi';

interface AddNetworkButtonProps {
  chainId: number;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function AddNetworkButton({ chainId, variant = 'outline', size = 'sm' }: AddNetworkButtonProps) {
  const chain = chainId === morphHolesky.id ? morphHolesky : morphMainnet;

  const addNetwork = async () => {
    // Type assertion for ethereum provider
    const ethereum = (window as any).ethereum;
    
    if (!ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chain.id.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [chain.rpcUrls.default.http[0]],
            blockExplorerUrls: [chain.blockExplorers?.default.url],
          },
        ],
      });
    } catch (error) {
      console.error('Failed to add network:', error);
    }
  };

  return (
    <Button
      onClick={addNetwork}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add {chain.name}
    </Button>
  );
}

export function NetworkSetupGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        Setup Morph L2 Networks
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div>
            <h4 className="font-medium text-blue-900">Morph Holesky Testnet</h4>
            <p className="text-sm text-blue-600">For development and testing</p>
          </div>
          <AddNetworkButton chainId={morphHolesky.id} />
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div>
            <h4 className="font-medium text-blue-900">Morph Mainnet</h4>
            <p className="text-sm text-blue-600">For production use</p>
          </div>
          <AddNetworkButton chainId={morphMainnet.id} />
        </div>
      </div>

      <div className="mt-4 text-sm text-blue-700">
        <p className="mb-2">
          <strong>Need help?</strong> Check out the official Morph documentation:
        </p>
        <a 
          href="https://docs.morphl2.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          Morph L2 Docs <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
} 