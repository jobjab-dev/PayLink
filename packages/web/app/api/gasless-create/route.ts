export const runtime = 'nodejs'; // Force Node.js runtime to access all env vars

import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits, encodeFunctionData, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { morphHolesky, morphMainnet } from '../../../lib/wagmi';
import { PAYLINK_ABI } from '../../../lib/abi';

// Get sponsor wallet from environment
const getSponsorWallet = () => {
  const sponsorPK = process.env.PK_SPONSOR;
  console.log('PK_SPONSOR exists:', !!sponsorPK);
  console.log('PK_SPONSOR preview:', sponsorPK ? sponsorPK.substring(0, 10) + '...' : 'NOT SET');
  
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
    console.log('Gasless create request body:', JSON.stringify(body, null, 2));
    
    // Validate request
    if (!body.billId || !body.token || !body.amount || !body.contractAddress || !body.chainId) {
      console.log('Missing required fields:', {
        billId: !!body.billId,
        token: !!body.token,
        amount: !!body.amount,
        contractAddress: !!body.contractAddress,
        chainId: !!body.chainId
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Chain ID:', body.chainId);
    const chain = getChainConfig(body.chainId);
    console.log('Chain config:', chain.name);
    
    const sponsorAccount = getSponsorWallet();
    console.log('Sponsor account:', sponsorAccount.address);

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

    console.log('Executing createBill transaction...');
    console.log('Contract address:', body.contractAddress);
    console.log('Bill ID:', body.billId);
    console.log('Token:', body.token);
    console.log('Amount:', body.amount);

    // Execute the sponsored createBill transaction
    const txHash = await walletClient.writeContract({
      address: body.contractAddress as Address,
      abi: PAYLINK_ABI,
      functionName: 'createBill',
      args: [body.billId as `0x${string}`, body.token as Address, BigInt(body.amount)],
    });

    console.log('Transaction hash:', txHash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 60000, // 1 minute timeout
    });

    console.log('Transaction receipt:', receipt.status);

    if (receipt.status === 'success') {
      return NextResponse.json({ 
        success: true, 
        txHash,
        blockNumber: receipt.blockNumber.toString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Transaction failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Gasless create bill API error:', error);
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
  console.log('PK_SPONSOR env var:', process.env.PK_SPONSOR ? 'SET' : 'NOT SET');
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('PK')));
  
  return NextResponse.json({ 
    message: 'Gasless Create Bill API',
    available: !!(process.env.PK_SPONSOR),
    timestamp: new Date().toISOString(),
    debug: {
      hasPkSponsor: !!(process.env.PK_SPONSOR),
      envKeys: Object.keys(process.env).filter(k => k.includes('PK'))
    }
  });
} 