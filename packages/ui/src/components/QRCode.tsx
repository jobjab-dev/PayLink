import React from 'react';
import { cn } from '../lib/utils';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  bgColor?: string;
  fgColor?: string;
  includeMargin?: boolean;
}

// Web implementation using qrcode.react
const WebQRCode: React.FC<QRCodeProps> = ({
  value,
  size = 256,
  className,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  includeMargin = true,
}) => {
  // Dynamic import for web environments
  const [QRCodeReact, setQRCodeReact] = React.useState<any>(null);

  React.useEffect(() => {
    import('qrcode.react').then((module) => {
      setQRCodeReact(() => module.QRCodeSVG || module.default);
    }).catch(() => {
      // Fallback for environments where qrcode.react is not available
      setQRCodeReact(null);
    });
  }, []);

  if (!QRCodeReact) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-500 text-sm">Loading QR...</span>
      </div>
    );
  }

  return (
    <div className={cn('inline-block', className)}>
      <QRCodeReact
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
};

// Mobile implementation placeholder
const MobileQRCode: React.FC<QRCodeProps> = ({
  value,
  size = 256,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-white border border-gray-300 rounded-lg',
        className
      )}
      style={{ width: size, height: size }}
    >
      <span className="text-gray-700 text-xs text-center px-4">
        QR Code: {value.slice(0, 20)}...
      </span>
    </div>
  );
};

// Platform detection
const QRCode: React.FC<QRCodeProps> = (props) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Check if we're in a React Native environment
    setIsMobile(typeof navigator === 'undefined' || /react-native/i.test(navigator.userAgent));
  }, []);

  return isMobile ? <MobileQRCode {...props} /> : <WebQRCode {...props} />;
};

export { QRCode }; 