'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button, Card, Input } from 'ui';
import { QrCode, Search, ExternalLink, Wallet, AlertTriangle, ScanLine } from 'lucide-react';
import { NetworkBadge } from '../../components/WalletConnect';
import { NetworkAlert, useNetworkAlert } from '../../components/NetworkAlert';
import { QRCodeScanner } from '../../components/QRCodeScanner';
import { toast } from 'react-hot-toast';

export default function ScanPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { 
    checkNetwork,
    canProceed, 
    shouldShowAlert 
  } = useNetworkAlert();
  
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  const extractBillId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const payIndex = pathParts.indexOf('pay');
      
      if (payIndex !== -1 && pathParts[payIndex + 1]) {
        return pathParts[payIndex + 1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleScanResult = async (result: string) => {
    if (!canProceed) {
      toast.error('Please switch to Morph L2 to scan payment codes', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B',
        },
        icon: '⚠️',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (result.includes('/pay/')) {
        const billId = extractBillId(result);
        if (billId) {
          toast.success('Payment link detected!');
          router.push(`/pay/${billId}`);
        } else {
          toast.error('Invalid PayLink URL format');
        }
      } else {
        toast.error('This QR code is not a PayLink payment URL');
      }
    } catch (error) {
      console.error('Error processing QR result:', error);
      toast.error('Failed to process QR code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualUrl.trim()) {
      toast.error('Please enter a payment URL');
      return;
    }

    if (!canProceed) {
      toast.error('Please switch to Morph L2 to access payment links', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B',
        },
        icon: '⚠️',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const billId = extractBillId(manualUrl);
      if (billId) {
        toast.success('Navigating to payment page...');
        router.push(`/pay/${billId}`);
      } else {
        toast.error('Invalid PayLink URL. Please check the URL format.');
      }
    } catch (error) {
      console.error('Error processing manual URL:', error);
      toast.error('Failed to process payment URL');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 safe-top safe-bottom">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Scan Payment QR Code
          </h1>
          <p className="text-muted-foreground text-responsive">
            Scan a PayLink QR code to make instant payments with zero gas fees.
          </p>
          <div className="mt-4 flex justify-center">
            <NetworkBadge />
          </div>
        </div>

        {shouldShowAlert && (
          <div className="mb-6">
            <NetworkAlert showButton={true} />
          </div>
        )}

        <Card className="p-6 mb-6 glass card-hover">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-blue-500" />
            QR Code Scanner
          </h2>
          
          <div className="space-y-4">
            {isConnected && canProceed ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                <QRCodeScanner
                  onResult={handleScanResult}
                  isActive={!isProcessing}
                />
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                {!isConnected ? (
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-2">Wallet Not Connected</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to start scanning payment QR codes
                    </p>
                  </div>
                ) : (
                  <div>
                    <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-medium text-orange-600 mb-2">Wrong Network</h3>
                    <p className="text-sm text-orange-600">
                      Switch to Morph L2 to scan payment codes
                    </p>
                  </div>
                )}
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Processing payment link...</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 mb-6 glass card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-green-500" />
              Manual URL Entry
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowManualInput(!showManualInput)}
              className="tap-target"
            >
              {showManualInput ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showManualInput && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Payment URL
                </label>
                <Input
                  placeholder="https://paylink.app/pay/0x..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="font-mono text-sm"
                  disabled={isProcessing || !canProceed}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste a PayLink payment URL to access the payment page directly
                </p>
              </div>

              <Button
                onClick={handleManualSubmit}
                disabled={!manualUrl.trim() || isProcessing || !canProceed}
                className="w-full tap-target btn-animate"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : !canProceed ? (
                  'Switch to Morph L2 First'
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Open Payment Link
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {!canProceed && isConnected && (
          <Card className="p-4 text-center bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 mb-6">
            <div className="text-orange-800 dark:text-orange-200">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium mt-2">
                Please switch to Morph L2 to scan and access payment links
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 glass">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-purple-500" />
            How to Use
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Scan QR Code</p>
                <p className="text-muted-foreground">
                  Point your camera at a PayLink QR code from a payment bill
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Auto-redirect</p>
                <p className="text-muted-foreground">
                  You'll be automatically taken to the payment page with all details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Pay with Zero Gas</p>
                <p className="text-muted-foreground">
                  Complete the payment without gas fees using gasless transactions
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 