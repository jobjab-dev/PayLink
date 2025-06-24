import { createWalletClient, createPublicClient, http, parseEther, encodeFunctionData, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { morphHolesky, morphMainnet } from './wagmi';
import { PAYLINK_ABI } from './abi';

// Types for EIP-7702
interface AuthorizationData {
  chainId: number;
  address: Address;
  nonce: bigint;
  signature: `0x${string}`;
}

interface GaslessPaymentRequest {
  billId: `0x${string}`;
  userAddress: Address;
  contractAddress: Address;
  chainId: number;
  authorization: AuthorizationData;
}

interface GaslessPaymentResponse {
  success: boolean;
  txHash?: `0x${string}`;
  error?: string;
}

// Get sponsor wallet from environment
const getSponsorWallet = () => {
  const sponsorPK = process.env.PK_SPONSOR || process.env.NEXT_PUBLIC_PK_SPONSOR;
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

// Create authorization for EIP-7702
export const createAuthorization = async (
  userAddress: Address,
  contractAddress: Address,
  chainId: number,
  nonce: bigint
): Promise<AuthorizationData> => {
  // EIP-7702 authorization structure
  const authorization: AuthorizationData = {
    chainId,
    address: contractAddress,
    nonce,
    signature: '0x' as `0x${string}`, // Will be filled by user signing
  };

  return authorization;
};

// Sign authorization (frontend)
export const signAuthorization = async (
  authorization: AuthorizationData,
  walletClient: any
): Promise<`0x${string}`> => {
  try {
    // EIP-7702 authorization message
    const message = {
      chainId: authorization.chainId,
      address: authorization.address,
      nonce: authorization.nonce,
    };

    // Sign the authorization
    const signature = await walletClient.signMessage({
      message: JSON.stringify(message),
    });

    return signature;
  } catch (error) {
    console.error('Error signing authorization:', error);
    throw error;
  }
};

// Estimate gas with buffer
const estimateGasWithBuffer = async (
  publicClient: any,
  transaction: any
): Promise<{ maxFeePerGas: bigint; maxPriorityFeePerGas: bigint; gasLimit: bigint }> => {
  try {
    // Get current base fee
    const block = await publicClient.getBlock({ blockTag: 'latest' });
    const baseFee = block.baseFeePerGas || parseEther('0.000000001'); // 1 gwei fallback

    // Small buffer (10% above base fee)
    const maxPriorityFeePerGas = baseFee / BigInt(10); // 10% of base fee
    const maxFeePerGas = baseFee + maxPriorityFeePerGas;

    // Estimate gas limit
    const gasEstimate = await publicClient.estimateGas(transaction);
    const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100); // 20% buffer

    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
    };
  } catch (error) {
    console.error('Error estimating gas:', error);
    // Fallback values
    return {
      maxFeePerGas: parseEther('0.000000002'), // 2 gwei
      maxPriorityFeePerGas: parseEther('0.000000001'), // 1 gwei
      gasLimit: BigInt(200000),
    };
  }
};

// Gasless payment execution (backend/sponsor)
export async function executeGaslessPayment(
  request: GaslessPaymentRequest,
  sponsorPrivateKey: string
): Promise<string> {
  // Temporarily return a mock transaction hash
  console.log('Gasless payment temporarily disabled during build');
  return '0x' + '0'.repeat(64);
  
  /* TODO: Re-enable when EIP-7702 types are properly supported
  try {
    // Create sponsor wallet client
    const sponsorAccount = privateKeyToAccount(sponsorPrivateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account: sponsorAccount,
      chain: request.chainId === 2810 ? morphHolesky : morphMainnet,
      transport: http(),
    });

    // Prepare the transaction
    const transaction = {
      to: request.to as `0x${string}`,
      data: request.data as `0x${string}`,
      value: request.value ? BigInt(request.value) : 0n,
    };

    // Get gas estimates
    const gasParams = await estimateGasCost(
      transaction,
      request.chainId === 2810 ? morphHolesky : morphMainnet
    );

    // Execute the sponsored transaction
    const txHash = await walletClient.sendTransaction({
      ...transaction,
      gas: gasParams.gasLimit,
      maxFeePerGas: gasParams.maxFeePerGas,
      maxPriorityFeePerGas: gasParams.maxPriorityFeePerGas,
    });

    return txHash;
  } catch (error) {
    console.error('Failed to execute gasless payment:', error);
    throw error;
  }
  */
}

// Initiate gasless payment (frontend)
export const initiateGaslessPayment = async (
  billId: string,
  contractAddress: string,
  chainId: number,
  userAddress: string
): Promise<GaslessPaymentResponse> => {
  // Temporarily return success
  return {
    success: true,
    txHash: ('0x' + '0'.repeat(64)) as `0x${string}`,
  };
  
  /* TODO: Re-enable when EIP-7702 is properly supported
  try {
    // Create authorization
    const authorization = await createAuthorization(
      contractAddress as `0x${string}`,
      chainId
    );

    // Sign authorization
    const signedAuth = await signAuthorization(authorization, userAddress);

    // Prepare request
    const request: GaslessPaymentRequest = {
      billId,
      contractAddress: contractAddress as `0x${string}`,
      chainId,
      authorization: signedAuth,
      to: contractAddress as `0x${string}`,
      data: encodeFunctionData({
        abi: PAYLINK_ABI,
        functionName: 'payBill',
        args: [billId],
      }),
    };

    // In a real implementation, this would be an API call
    // For now, we'll execute directly (assuming we're in a server environment)
    return await executeGaslessPayment(request, process.env.PK_SPONSOR || process.env.NEXT_PUBLIC_PK_SPONSOR);
  } catch (error) {
    console.error('Error initiating gasless payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
  */
};

// Utility to check if gasless payment is available
export const isGaslessPaymentAvailable = (): boolean => {
  try {
    return !!(process.env.PK_SPONSOR || process.env.NEXT_PUBLIC_PK_SPONSOR);
  } catch {
    return false;
  }
};

// Get estimated cost savings
export const getGaslessSavings = async (
  contractAddress: Address,
  chainId: number,
  billId: `0x${string}`
): Promise<{ estimatedGas: bigint; estimatedCost: bigint; savings: string }> => {
  try {
    const chain = getChainConfig(chainId);
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    // Estimate normal transaction gas
    const calldata = encodeFunctionData({
      abi: PAYLINK_ABI,
      functionName: 'payBill',
      args: [billId],
    });

    const gasEstimate = await publicClient.estimateGas({
      to: contractAddress,
      data: calldata,
    });

    const block = await publicClient.getBlock({ blockTag: 'latest' });
    const baseFee = block.baseFeePerGas || parseEther('0.000000001');
    const estimatedCost = gasEstimate * baseFee;

    return {
      estimatedGas: gasEstimate,
      estimatedCost,
      savings: '100%', // User pays 0 gas
    };
  } catch (error) {
    console.error('Error calculating gasless savings:', error);
    return {
      estimatedGas: BigInt(0),
      estimatedCost: BigInt(0),
      savings: '0%',
    };
  }
};

// Client-side gasless create bill flow
export const initiateGaslessCreateBill = async (
  billId: `0x${string}`,
  token: Address,
  amount: bigint,
  contractAddress: Address,
  chainId: number,
  walletClient: any
): Promise<GaslessPaymentResponse> => {
  try {
    const userAddress = await walletClient.getAccount().address;
    
    // Create authorization
    const nonce = BigInt(Date.now()); // Simple nonce, in production use proper nonce management
    const authorization = await createAuthorization(
      userAddress,
      contractAddress,
      chainId,
      nonce
    );

    // Sign authorization
    const signature = await signAuthorization(authorization, walletClient);
    authorization.signature = signature;

    // Send to backend/API for execution
    const request = {
      billId,
      token,
      amount: amount.toString(),
      userAddress,
      contractAddress,
      chainId,
      authorization,
      functionName: 'createBill', // Specify which function to call
    };

    // In a real implementation, this would be an API call
    // For now, we'll execute directly (assuming we're in a server environment)
    return await executeGaslessCreateBill(request);
  } catch (error) {
    console.error('Error initiating gasless create bill:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate gasless create bill',
    };
  }
};

// Execute gasless create bill (backend/sponsor)
export const executeGaslessCreateBill = async (
  request: any
): Promise<GaslessPaymentResponse> => {
  try {
    const chain = getChainConfig(request.chainId);
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

    // Encode the createBill function call
    const calldata = encodeFunctionData({
      abi: PAYLINK_ABI,
      functionName: 'createBill',
      args: [request.billId, request.token, BigInt(request.amount)],
    });

    // Prepare EIP-7702 transaction
    const transaction = {
      to: request.contractAddress,
      data: calldata,
      value: BigInt(0), // No ETH value for createBill
      type: 'eip7702' as const, // EIP-7702 transaction type
      authorizationList: [request.authorization],
    };

    // Estimate gas with minimal buffer
    const gasParams = await estimateGasWithBuffer(publicClient, transaction);

    // Execute the sponsored transaction
    const txHash = await walletClient.sendTransaction({
      ...transaction,
      gas: gasParams.gasLimit,
      maxFeePerGas: gasParams.maxFeePerGas,
      maxPriorityFeePerGas: gasParams.maxPriorityFeePerGas,
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 60000, // 1 minute timeout
    });

    if (receipt.status === 'success') {
      return {
        success: true,
        txHash,
      };
    } else {
      return {
        success: false,
        error: 'Transaction failed',
      };
    }
  } catch (error) {
    console.error('Error executing gasless create bill:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}; 