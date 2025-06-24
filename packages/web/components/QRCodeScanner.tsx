'use client';

import { useEffect, useRef, useState } from 'react';
import { QrCode, Camera, AlertTriangle } from 'lucide-react';
import { Button } from 'ui';

interface QRCodeScannerProps {
  onResult: (result: string) => void;
  isActive?: boolean;
  className?: string;
}

export function QRCodeScanner({ onResult, isActive = true, className = '' }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Cleanup stream when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Stop scanning when inactive
  useEffect(() => {
    if (!isActive && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  }, [isActive, stream]);

  const startScanning = async () => {
    if (!isActive) return;

    try {
      setError(null);
      
      // Request camera permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setStream(mediaStream);
      setHasPermission(true);
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Note: In a production app, you would integrate with a QR code scanner library
      // such as @zxing/library, qr-scanner, or similar
      // For this demo, we'll simulate QR scanning
      simulateQRScan();

    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // Simulate QR code scanning for demo purposes
  // In production, replace this with actual QR code detection
  const simulateQRScan = () => {
    // This is just for demo - in production you'd use a real QR scanner
    setTimeout(() => {
      if (videoRef.current && isActive) {
        // Simulate finding a demo QR code
        console.log('QR Scanner running...');
      }
    }, 2000);
  };

  // Mock QR scanner for demonstration
  const handleMockScan = () => {
    const mockUrl = `${window.location.origin}/pay/0x${Math.random().toString(16).substr(2, 40)}demo`;
    onResult(mockUrl);
  };

  if (hasPermission === false) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
        <h3 className="font-semibold text-lg mb-2">Camera Permission Required</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Please allow camera access to scan QR codes for payments.
        </p>
        <Button onClick={startScanning} variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="font-semibold text-lg mb-2">Scanner Error</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button onClick={startScanning} variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {!isScanning ? (
        <div className="text-center p-8">
          <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">QR Code Scanner</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Tap to start scanning PayLink QR codes
          </p>
          <Button onClick={startScanning} size="lg">
            <Camera className="h-4 w-4 mr-2" />
            Start Scanner
          </Button>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="rounded-lg max-w-full h-auto"
            width="320"
            height="240"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scanner overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-primary rounded-lg w-48 h-48 border-dashed animate-pulse"></div>
          </div>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Point camera at a PayLink QR code
            </p>
            <div className="space-x-2">
              <Button onClick={stopScanning} variant="outline" size="sm">
                Stop Scanner
              </Button>
              {/* Demo button for testing */}
              <Button onClick={handleMockScan} variant="outline" size="sm">
                Test QR (Demo)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 