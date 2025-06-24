import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkGuard } from '../hooks/useNetworkGuard';
import { toast } from 'react-hot-toast';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useChainId: vi.fn(),
  useSwitchChain: vi.fn(),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/pay/test-bill',
  },
  writable: true,
});

describe('NetworkGuard', () => {
  const mockSwitchChainAsync = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    const { useAccount, useChainId, useSwitchChain } = require('wagmi');
    useAccount.mockReturnValue({ isConnected: true });
    useChainId.mockReturnValue(1); // Ethereum mainnet (wrong network)
    useSwitchChain.mockReturnValue({
      switchChainAsync: mockSwitchChainAsync,
      isPending: false,
    });
  });

  describe('ensureNetwork', () => {
    it('should return true when already on correct network', async () => {
      const { useChainId } = require('wagmi');
      useChainId.mockReturnValue(2810); // Morph Holesky (correct network)

      const { result } = renderHook(() => useNetworkGuard());

      await act(async () => {
        const networkOk = await result.current.ensureNetwork();
        expect(networkOk).toBe(true);
      });
    });

    it('should return false and show error when wallet not connected', async () => {
      const { useAccount } = require('wagmi');
      useAccount.mockReturnValue({ isConnected: false });

      const { result } = renderHook(() => useNetworkGuard());

      await act(async () => {
        const networkOk = await result.current.ensureNetwork();
        expect(networkOk).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Please connect your wallet first');
      });
    });

    it('should attempt to switch network when on wrong chain', async () => {
      mockSwitchChainAsync.mockResolvedValue(undefined);

      const { result } = renderHook(() => useNetworkGuard());

      await act(async () => {
        const networkOk = await result.current.ensureNetwork();
        expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 2810 });
        expect(toast.success).toHaveBeenCalledWith('Switched to Morph Holesky Testnet!');
        expect(networkOk).toBe(true);
      });
    });

    it('should handle user rejection of network switch', async () => {
      const userRejectionError = new Error('User rejected');
      userRejectionError.code = 4001;
      mockSwitchChainAsync.mockRejectedValue(userRejectionError);

      const { result } = renderHook(() => useNetworkGuard());

      await act(async () => {
        const networkOk = await result.current.ensureNetwork();
        expect(networkOk).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Please switch to Morph network to continue');
      });
    });

    it('should try to add chain when chain not found', async () => {
      const chainNotFoundError = new Error('Chain not found');
      chainNotFoundError.code = 4902;
      mockSwitchChainAsync
        .mockRejectedValueOnce(chainNotFoundError)
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useNetworkGuard());

      await act(async () => {
        const networkOk = await result.current.ensureNetwork();
        expect(mockSwitchChainAsync).toHaveBeenCalledTimes(2);
        // First call: simple switch
        expect(mockSwitchChainAsync).toHaveBeenNthCalledWith(1, { chainId: 2810 });
        // Second call: add and switch
        expect(mockSwitchChainAsync).toHaveBeenNthCalledWith(2, {
          chainId: 2810,
          addEthereumChainParameter: expect.objectContaining({
            chainName: 'Morph Holesky Testnet',
            nativeCurrency: expect.any(Object),
            rpcUrls: expect.any(Array),
          })
        });
        expect(networkOk).toBe(true);
      });
    });
  });

  describe('network status', () => {
    it('should correctly identify wrong network', () => {
      const { useChainId } = require('wagmi');
      useChainId.mockReturnValue(1); // Ethereum mainnet

      const { result } = renderHook(() => useNetworkGuard());

      expect(result.current.isCorrectChain).toBe(false);
      expect(result.current.currentChainId).toBe(1);
      expect(result.current.targetChainId).toBe(2810);
      expect(result.current.canProceed).toBe(false);
    });

    it('should correctly identify correct network', () => {
      const { useChainId } = require('wagmi');
      useChainId.mockReturnValue(2810); // Morph Holesky

      const { result } = renderHook(() => useNetworkGuard());

      expect(result.current.isCorrectChain).toBe(true);
      expect(result.current.currentChainId).toBe(2810);
      expect(result.current.canProceed).toBe(true);
    });

    it('should support both Morph networks', () => {
      const { useChainId } = require('wagmi');
      
      // Test Morph Holesky
      useChainId.mockReturnValue(2810);
      const { result: result1 } = renderHook(() => useNetworkGuard());
      expect(result1.current.isCorrectChain).toBe(true);

      // Test Morph Mainnet
      useChainId.mockReturnValue(2818);
      const { result: result2 } = renderHook(() => useNetworkGuard());
      expect(result2.current.isCorrectChain).toBe(true);
    });
  });

  describe('auto network check on pay pages', () => {
    it('should auto-attempt network switch on pay page load', async () => {
      window.location.pathname = '/pay/test-bill-id';
      mockSwitchChainAsync.mockResolvedValue(undefined);

      renderHook(() => useNetworkGuard());

      // Give time for useEffect to run
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockSwitchChainAsync).toHaveBeenCalled();
    });

    it('should not auto-attempt network switch on non-pay pages', async () => {
      window.location.pathname = '/create';

      renderHook(() => useNetworkGuard());

      // Give time for useEffect to run
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockSwitchChainAsync).not.toHaveBeenCalled();
    });
  });
});

// Integration test for preventing writeContract on wrong network
describe('Network Guard Integration', () => {
  it('should prevent writeContract when chainId does not match', async () => {
    const mockWriteContract = vi.fn();
    const { useChainId } = require('wagmi');
    useChainId.mockReturnValue(1); // Wrong network

    const { result } = renderHook(() => useNetworkGuard());

    // Simulate bill creation attempt
    await act(async () => {
      const networkOk = await result.current.ensureNetwork();
      
      if (networkOk) {
        // This should not be reached on wrong network
        mockWriteContract({
          address: '0x123',
          abi: [],
          functionName: 'payBill',
          args: ['0xbillid'],
        });
      }
    });

    // writeContract should not be called when network is wrong
    expect(mockWriteContract).not.toHaveBeenCalled();
    expect(result.current.canProceed).toBe(false);
  });

  it('should allow writeContract when chainId matches', async () => {
    const mockWriteContract = vi.fn();
    const { useChainId } = require('wagmi');
    useChainId.mockReturnValue(2810); // Correct network

    const { result } = renderHook(() => useNetworkGuard());

    // Simulate bill creation attempt
    await act(async () => {
      const networkOk = await result.current.ensureNetwork();
      
      if (networkOk) {
        mockWriteContract({
          address: '0x123',
          abi: [],
          functionName: 'payBill',
          args: ['0xbillid'],
        });
      }
    });

    // writeContract should be called when network is correct
    expect(mockWriteContract).toHaveBeenCalled();
    expect(result.current.canProceed).toBe(true);
  });
}); 