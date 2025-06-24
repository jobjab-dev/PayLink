'use client';

import { Card } from 'ui';
import { NetworkSetupGuide } from '../../components/AddNetworkButton';
import { NetworkGuard } from '../../components/NetworkGuard';
import { useAccount } from 'wagmi';
import { Network, Shield, Zap, Globe } from 'lucide-react';

export default function NetworksPage() {
  const { isConnected } = useAccount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Network className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Network Setup</h1>
          <p className="text-muted-foreground">
            Configure your wallet to use Morph L2 networks for PayLink
          </p>
        </div>

        {isConnected && (
          <div className="mb-8">
            <NetworkGuard showInline={true} showBanner={false} />
          </div>
        )}

        <div className="mb-8">
          <NetworkSetupGuide />
        </div>

        {/* Network Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">Morph Holesky Testnet</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain ID:</span>
                <span className="font-mono">2810</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span>ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RPC URL:</span>
                <span className="font-mono text-xs break-all">
                  https://rpc-quicknode-holesky.morphl2.io
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Explorer:</span>
                <a 
                  href="https://explorer-holesky.morphl2.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  explorer-holesky.morphl2.io
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">Morph Mainnet</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain ID:</span>
                <span className="font-mono">2818</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span>ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RPC URL:</span>
                <span className="font-mono text-xs break-all">
                  https://rpc-quicknode.morphl2.io
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Explorer:</span>
                <a 
                  href="https://explorer.morphl2.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  explorer.morphl2.io
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Morph L2? */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Why Morph L2?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-2">Lightning Fast</h4>
              <p className="text-sm text-muted-foreground">
                Sub-second transaction confirmations for instant payments
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-2">Ultra Low Fees</h4>
              <p className="text-sm text-muted-foreground">
                Minimal transaction costs, perfect for micro-payments
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-2">Ethereum Compatible</h4>
              <p className="text-sm text-muted-foreground">
                Full EVM compatibility with Ethereum ecosystem
              </p>
            </div>
          </div>
        </Card>

        {/* Getting Testnet ETH */}
        <Card className="p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Getting Testnet ETH</h3>
          <p className="text-muted-foreground mb-4">
            To test PayLink on Morph Holesky, you'll need some testnet ETH:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Get Holesky ETH from a faucet like <a href="https://holesky-faucet.pk910.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">holesky-faucet.pk910.de</a></li>
            <li>Bridge your Holesky ETH to Morph Holesky using the <a href="https://bridge-holesky.morphl2.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Morph Bridge</a></li>
            <li>Start creating and paying bills on PayLink!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
} 