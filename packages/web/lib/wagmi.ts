import { createConfig, http } from 'wagmi';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';
import { mainnet, sepolia } from 'wagmi/chains';

// Define custom chains
export const tiaSepolia = {
  id: 1329,
  name: 'Tia Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.tia.sepolia.io'], // Replace with actual RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: 'Tia Explorer',
      url: 'https://explorer.tia.sepolia.io',
    },
  },
  testnet: true,
} as const;

// Define Morph chains
export const morphHolesky = {
  id: 2810,
  name: 'Morph Holesky Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Holesky Explorer',
      url: 'https://explorer-holesky.morphl2.io',
    },
  },
  testnet: true,
} as const;

export const morphMainnet = {
  id: 2818,
  name: 'Morph Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Explorer',
      url: 'https://explorer.morphl2.io',
    },
  },
  testnet: false,
} as const;

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

// Create connectors with SSR-safe configuration
const connectors = typeof window !== 'undefined' 
  ? [
      injected(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'default-project-id',
        qrModalOptions: {
          themeMode: 'light',
        },
        showQrModal: true,
      })
    ]
  : [injected()];

export const config = createConfig({
  chains: [morphHolesky, morphMainnet, mainnet, sepolia, tiaSepolia],
  connectors,
  transports: {
    [morphHolesky.id]: http(),
    [morphMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [tiaSepolia.id]: http(),
  },
  ssr: true,
});

export const SUPPORTED_TOKENS: Record<number, Array<{
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
}>> = {
  [morphHolesky.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
      address: '0xeA2610c28B4c5857689EAFa8b2116a617206d283',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
  ],
  [morphMainnet.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
      address: '0xe34c91815d7fc18A9e2148bcD4241d0a5848b693',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
  ],
};

export const CONTRACT_ADDRESSES: Record<number, `0x${string}` | undefined> = {
  2810: '0xD6d13Fd49eF678b692eAd8EdfC85646E2e0C3195', // Morph Holesky Testnet - Updated with EIP-7702 support
  2818: undefined, // Morph Mainnet - Not deployed yet
}; 