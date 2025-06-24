# Gasless Payment Setup Guide

## Overview

The PayFi application supports gasless payments using EIP-7702 technology. This allows users to create bills without paying gas fees - instead, a sponsor wallet pays the gas fees on their behalf.

## Setup Instructions

### 1. Configure Sponsor Wallet

You need to set up a sponsor wallet that will pay gas fees for users:

1. Create or use an existing wallet that will act as the sponsor
2. Fund this wallet with ETH on the Morph network (Holesky testnet or Mainnet)
3. Copy the private key of this wallet

### 2. Set Environment Variables

Add the following to your `.env.local` file:

```env
# Sponsor Private Key for Gasless Payments
PK_SPONSOR=0x_your_sponsor_wallet_private_key_here
```

⚠️ **Security Warning**: 
- Never commit private keys to version control
- Use a dedicated wallet with limited funds for testing
- In production, use secure key management solutions

### 3. Restart the Development Server

After adding the environment variable, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## How It Works

1. When a user creates a bill, they click "Create New Bill"
2. The frontend calls `/api/gasless-create` endpoint
3. The API uses the sponsor wallet to pay for the transaction gas
4. The bill is created on the blockchain without the user paying any gas fees
5. The user receives a payment URL they can share

## Troubleshooting

### Error: "Sponsor private key not configured"

This error occurs when:
- The `PK_SPONSOR` environment variable is not set
- The `.env.local` file is not loaded properly
- The server hasn't been restarted after adding the environment variable

**Solution**: 
1. Verify `.env.local` contains `PK_SPONSOR`
2. Restart the development server
3. Check the terminal for any environment loading errors

### Error: "Insufficient funds"

This occurs when the sponsor wallet doesn't have enough ETH to pay for gas.

**Solution**: 
1. Check the sponsor wallet balance
2. Add ETH to the sponsor wallet on the appropriate network (Morph Holesky or Mainnet)

## Testing

To test the gasless feature:

1. Navigate to http://localhost:3000
2. Click "Create New Bill"
3. Fill in the payment details
4. Click "Create Payment Bill"
5. If successful, you'll see a payment URL
6. If you see an error about sponsor key, check your setup

## Production Considerations

For production deployments:
- Use environment variables from your hosting provider (Vercel, etc.)
- Consider using a key management service (AWS KMS, HashiCorp Vault)
- Monitor the sponsor wallet balance
- Set up alerts for low balance
- Implement rate limiting to prevent abuse 