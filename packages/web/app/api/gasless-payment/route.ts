export const runtime = 'nodejs'; // Force Node.js runtime to access all env vars

import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits, encodeFunctionData, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { morphHolesky, morphMainnet } from '../../../lib/wagmi';
import { PAYLINK_ABI } from '../../../lib/abi';

// Get sponsor wallet from environment
const getSponsorWallet = () => {
  const sponsorPK = process.env.PK_SPONSOR;
  console.log('Payment API - PK_SPONSOR exists:', !!sponsorPK);
  
  if (!sponsorPK) {
    throw new Error('Sponsor private key not configured');
  }
  return privateKeyToAccount(sponsorPK as `0x${string}`);
};

// Get chain configuration
const getChainConfig = (chainId: number) => {
  switch (chainId) {
    case 2810:
      return morphHolesky;
    case 2818:
      return morphMainnet;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.billId || !body.contractAddress || !body.chainId || !body.authorization) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const chain = getChainConfig(body.chainId);
    const sponsorAccount = getSponsorWallet();

    // Create clients
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const walletClient = createWalletClient({
      account: sponsorAccount,
      chain,
      transport: http(),
    });

    // First, read the bill data to check the amount and token
    const billData = await publicClient.readContract({
      address: body.contractAddress as Address,
      abi: PAYLINK_ABI,
      functionName: 'getBill',
      args: [body.billId as `0x${string}`],
    }) as any;

    console.log('Bill data:', {
      token: billData.token,
      amount: billData.amount?.toString(),
      paid: billData.paid
    });

    // Check if bill is already paid
    if (billData.paid) {
      return NextResponse.json(
        { success: false, error: 'Bill already paid' },
        { status: 400 }
      );
    }

    // For ETH payments, we cannot do true gasless
    if (billData.token === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { success: false, error: 'Gasless payment not supported for ETH. Please use standard payment.' },
        { status: 400 }
      );
    }

    // For ERC20 tokens, sponsor only pays gas, not the token amount
    const value = BigInt(0);

    // Convert authorization strings back to BigInt for contract call
    const authorizationForContract = {
      authorizer: body.authorization.authorizer as Address,
      billId: body.authorization.billId as `0x${string}`,
      nonce: BigInt(body.authorization.nonce),
      chainId: BigInt(body.authorization.chainId),
      contractAddress: body.authorization.contractAddress as Address,
      signature: body.authorization.signature as `0x${string}`,
    };

    // Execute the gasless payment using payBillWithAuthorization
    const txHash = await walletClient.writeContract({
      address: body.contractAddress as Address,
      abi: PAYLINK_ABI,
      functionName: 'payBillWithAuthorization',
      args: [authorizationForContract],
      value: value, // Sponsor pays the ETH if it's an ETH bill
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 60000, // 1 minute timeout
    });

    if (receipt.status === 'success') {
      return NextResponse.json({ 
        success: true, 
        txHash,
        blockNumber: receipt.blockNumber.toString(), // Convert BigInt to string
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Transaction failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Gasless payment API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Gasless Payment API',
    available: !!(process.env.PK_SPONSOR),
    timestamp: new Date().toISOString()
  });
} 