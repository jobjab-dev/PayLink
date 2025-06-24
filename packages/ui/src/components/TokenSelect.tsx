import React from 'react';
import { cn } from '../lib/utils';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
}

interface TokenSelectProps {
  tokens: Token[];
  value?: string; // token address
  onChange?: (address: string) => void;
  selectedToken?: Token;
  onSelect?: (token: Token) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const TokenSelect: React.FC<TokenSelectProps> = ({
  tokens,
  value,
  onChange,
  selectedToken,
  onSelect,
  className,
  placeholder = 'Select a token',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Support both patterns
  const currentToken = selectedToken || tokens.find(t => t.address === value);

  const handleSelect = (token: Token) => {
    if (disabled) return;
    
    if (onChange) {
      onChange(token.address);
    }
    if (onSelect) {
      onSelect(token);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {currentToken ? (
            <>
              {currentToken.logoUrl && (
                <img
                  src={currentToken.logoUrl}
                  alt={currentToken.symbol}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="font-medium">{currentToken.symbol}</span>
              <span className="text-muted-foreground text-xs">
                {currentToken.name}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <svg
          className={cn(
            'h-4 w-4 opacity-50 transition-transform',
            isOpen && 'rotate-180'
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {tokens.map((token) => (
            <button
              key={token.address}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              onClick={() => handleSelect(token)}
            >
              {token.logoUrl && (
                <img
                  src={token.logoUrl}
                  alt={token.symbol}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{token.symbol}</span>
                <span className="text-xs text-muted-foreground">
                  {token.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { TokenSelect }; 