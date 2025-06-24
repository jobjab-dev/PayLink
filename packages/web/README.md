# PayFi - Morph L2 Payment dApp

A modern Web3 payment system built on Morph Layer 2 blockchain that allows users to create and receive payments through QR codes.

## 🚀 Features

- **QR Code Payments**: Create payment bills and share via QR codes
- **Gasless Transactions**: Pay without needing ETH for gas fees
- **Low Fees**: Leverage Morph L2 for minimal transaction costs
- **Multi-Token Support**: Support for various ERC-20 tokens
- **Real-time Updates**: Instant payment status updates
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem, Rainbow Kit
- **Blockchain**: Morph L2 Network
- **Smart Contracts**: Solidity

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd
   ```
3. Deploy with one click

### Manual Deployment

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Start production server
pnpm start
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd
```

## 📱 Usage

1. **Connect Wallet**: Connect your Web3 wallet
2. **Create Bill**: Set amount and token, generate QR code
3. **Share QR**: Share the QR code with the payer
4. **Receive Payment**: Automatically receive payments to your wallet

## 🔗 Contract Information

- **Network**: Morph Holesky Testnet
- **Contract Address**: `0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd`
- **Explorer**: [View on Morph Explorer](https://explorer-holesky.morphl2.io/address/0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd)

## 🧪 Testing

The contract has been thoroughly tested with:
- ✅ Bill creation and management
- ✅ Payment processing
- ✅ Double payment prevention
- ✅ Event emission

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🎯 Roadmap

- [ ] Multi-chain support
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Recurring payments
- [ ] Invoice management

---

Built with ❤️ on Morph L2 