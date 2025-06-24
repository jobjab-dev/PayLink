'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button, Card, Input, TokenSelect } from 'ui';
import { parseUnits, keccak256, toBytes } from 'viem';
import { PlusCircle, QrCode, Copy, Zap, Wallet, Shield } from 'lucide-react';
import { SUPPORTED_TOKENS, CONTRACT_ADDRESSES } from '../../lib/wagmi';
import { NetworkBadge } from '../../components/WalletConnect';
import { NetworkAlert, useNetworkAlert } from '../../components/NetworkAlert';
import { useNetworkGuard } from '../../hooks/useNetworkGuard';
import { toast } from 'react-hot-toast';

export default function CreateBillPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { 
    checkNetwork,
    canProceed, 
    currentChainId,
    shouldShowAlert 
  } = useNetworkAlert();
  const { ensureNetwork } = useNetworkGuard();
  
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [billId, setBillId] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  const tokens = SUPPORTED_TOKENS[currentChainId] || [];

  // ✅ Call checkNetwork() on mount
  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  // Default to ETH
  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0].address);
    }
  }, [tokens, selectedToken]);

  const selectedTokenData = tokens.find(t => t.address === selectedToken);
  const canCreate = receiver && amount && selectedToken && isConnected && canProceed;

  const generateBillId = (receiver: string, token: string, amount: string) => {
    const data = `${receiver}-${token}-${amount}-${Date.now()}`;
    return keccak256(toBytes(data));
  };

  const handleCreateBill = async () => {
    if (!canCreate || !selectedTokenData) return;

    // ✅ NETWORK ALERT: Ensure correct network before proceeding
    const networkOk = await ensureNetwork();
    if (!networkOk) {
      toast.error('Please switch to Morph L2 to continue', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B',
        },
        icon: '⚠️',
      });
      return; // Early return if network check fails
    }

    setIsCreating(true);
    try {
      const amountWei = parseUnits(amount, selectedTokenData.decimals);
      const newBillId = generateBillId(receiver, selectedToken, amount);
      
      setBillId(newBillId);

      // Use gasless API with validated network
      const contractAddress = CONTRACT_ADDRESSES[currentChainId];
      
      if (!contractAddress) {
        throw new Error(`Contract not deployed on chain ${currentChainId}`);
      }

      const response = await fetch('/api/gasless-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId: newBillId,
          token: selectedToken,
          amount: amountWei.toString(),
          contractAddress: contractAddress,
          chainId: currentChainId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTxHash(result.txHash);
        const url = `${window.location.origin}/pay/${newBillId}`;
        setPaymentUrl(url);
        toast.success('Bill created successfully!');
      } else {
        throw new Error(result.error || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(`Failed to create bill: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const copyPaymentUrl = async () => {
    if (paymentUrl) {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setReceiver('');
    setAmount('');
    setBillId('');
    setPaymentUrl('');
    setTxHash('');
    setCopied(false);
    setIsCreating(false);
  };

  // Show success state
  if (paymentUrl && billId) {
    return (
      <div className="container mx-auto px-4 py-8 safe-top safe-bottom">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-600">Bill Created Successfully!</h1>
            <p className="text-muted-foreground text-responsive">
              Your payment request is ready to be shared.
            </p>
          </div>

          <Card className="p-6 mb-6 card-hover glass">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-500" />
              Payment Details
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground font-medium">Receiver</label>
                  <p className="font-mono text-xs break-all">{receiver}</p>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Amount</label>
                  <p className="font-semibold text-green-600">
                    {amount} {selectedTokenData?.symbol || 'ETH'}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Token</label>
                  <p>{selectedTokenData?.name || 'Ethereum'}</p>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Network</label>
                  <NetworkBadge />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Payment URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={paymentUrl}
                    readOnly
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    onClick={copyPaymentUrl}
                    variant="outline"
                    size="icon"
                    className="tap-target"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-1">✓ Copied to clipboard!</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push(`/pay/${billId}`)}
                  className="flex-1 btn-animate tap-target"
                  size="lg"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  View Payment Page
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 btn-animate tap-target"
                  size="lg"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Another Bill
                </Button>
              </div>
            </div>
          </Card>

          {/* Features highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <Card className="p-4 card-hover">
              <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Zero Gas Payments</h3>
              <p className="text-xs text-muted-foreground">
                Recipients can pay without gas fees
              </p>
            </Card>
            <Card className="p-4 card-hover">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Secure & Verified</h3>
              <p className="text-xs text-muted-foreground">
                Network-validated on Morph L2
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 safe-top safe-bottom">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Create Payment Bill
          </h1>
          <p className="text-muted-foreground text-responsive">
            Generate a payment request that can be paid with zero gas fees.
          </p>
          <div className="mt-4 flex justify-center">
            <NetworkBadge />
          </div>
        </div>

        {/* ✅ Network Alert - Show warning if wrong network */}
        {shouldShowAlert && (
          <div className="mb-6">
            <NetworkAlert showButton={true} />
          </div>
        )}

        <Card className="p-6 mb-6 glass card-hover">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-500" />
            Payment Request Details
          </h2>

          <div className="space-y-6">
            {/* Receiver Address */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Receiver Address *
              </label>
              <Input
                placeholder="0x... (wallet address that will receive payment)"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="font-mono text-sm"
                disabled={isCreating || !canProceed} // ✅ Disable if wrong network
              />
              <p className="text-xs text-muted-foreground mt-1">
                The wallet address that will receive the payment
              </p>
            </div>

            {/* Token Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Payment Token *
              </label>
              <TokenSelect
                tokens={tokens}
                value={selectedToken}
                onChange={setSelectedToken}
                disabled={isCreating || !canProceed} // ✅ Disable if wrong network
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose the token for payment (ETH or supported ERC-20 tokens)
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Amount *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                  step="0.000001"
                  min="0"
                  disabled={isCreating || !canProceed} // ✅ Disable if wrong network
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {selectedTokenData?.symbol || 'ETH'}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                The amount to be paid in {selectedTokenData?.symbol || 'ETH'}
              </p>
            </div>

            {/* Gasless Payment Info */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-400 text-sm">
                    Zero Gas Fee Payment
                  </h3>
                  <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                    Recipients can pay this bill without gas fees. Network validation ensures secure transactions.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Button */}
            {isConnected ? (
              <Button
                onClick={handleCreateBill}
                disabled={!canCreate || isCreating} // ✅ Disable if wrong network
                className="w-full tap-target btn-animate"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Bill...
                  </>
                ) : !canProceed ? (
                  'Switch to Morph L2 First'
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Payment Bill
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to create a payment bill
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <Card className="p-4 card-hover">
            <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Gasless Payments</h3>
            <p className="text-xs text-muted-foreground">
              Zero gas fees for payers
            </p>
          </Card>
          <Card className="p-4 card-hover">
            <QrCode className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">QR Code Sharing</h3>
            <p className="text-xs text-muted-foreground">
              Easy mobile payments
            </p>
          </Card>
          <Card className="p-4 card-hover">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Network Protected</h3>
            <p className="text-xs text-muted-foreground">
              Auto-validated on Morph L2
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
} 