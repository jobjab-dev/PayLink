import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: string | number | bigint, tokenDecimals = 18): string {
  let num: number;
  
  if (typeof amount === 'bigint') {
    // Convert bigint to number with proper decimals
    num = Number(amount) / Math.pow(10, tokenDecimals);
  } else if (typeof amount === 'string') {
    num = parseFloat(amount);
  } else {
    num = amount;
  }
  
  if (isNaN(num)) return '0';
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  // For small amounts, show more precision
  if (num < 0.01) {
    return num.toFixed(6);
  }
  
  return num.toFixed(4);
}

export function generatePaymentLink(billId: string, baseUrl = 'https://paylink.morphl2.io'): string {
  return `${baseUrl}/pay/${billId}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
} 