# PayLink - Morph L2 Payment System

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/paylink-morph)

A complete Web3 payment ecosystem built on Morph Layer 2 blockchain that enables seamless QR code-based payments with gasless transactions.

## 🎯 Overview

PayLink is a modern payment dApp that revolutionizes digital transactions by combining the power of Morph L2's low fees with an intuitive QR code-based payment system. Create bills, share QR codes, and receive payments instantly - all while enjoying gasless transactions for payers.

## ✨ Key Features

- 🏃‍♂️ **Gasless Payments**: Users can pay without holding ETH for gas
- 💰 **Low Transaction Fees**: Powered by Morph L2 technology
- 📱 **QR Code Integration**: Simple scan-to-pay functionality
- 🔐 **Secure Smart Contracts**: Audited and tested payment system
- 🌍 **Multi-Device Support**: Works on desktop and mobile
- ⚡ **Real-time Updates**: Instant payment confirmations

## 🏗 Project Structure

```
morph-paylink/
├── packages/
│   ├── web/          # Next.js Web Application
│   ├── mobile/       # React Native Mobile App
│   ├── contract/     # Smart Contracts & Deployment
│   └── ui/           # Shared UI Components
├── docs/             # Documentation
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/paylink-morph.git
cd paylink-morph

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Environment Setup

1. Copy environment files:
```bash
cp packages/web/env.example packages/web/.env.local
cp packages/contract/env.example packages/contract/.env
```

2. Configure your environment variables:
- Get WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
- Get Alchemy API key from [Alchemy](https://alchemy.com)
- Use the deployed contract address: `0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd`

## 📦 Packages

### Web Application (`packages/web`)
Next.js 14 application with modern UI/UX, wallet integration, and QR code functionality.

**Features:**
- Wallet connection (WalletConnect, MetaMask)
- Bill creation and management
- QR code generation and scanning
- Payment processing
- Network switching

### Smart Contracts (`packages/contract`)
Solidity smart contracts deployed on Morph Holesky testnet.

**Contract Address:** `0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd`

**Features:**
- Bill creation and management
- Secure payment processing
- Double payment prevention
- Event emission for tracking

### Mobile App (`packages/mobile`)
React Native application for mobile payments.

### UI Components (`packages/ui`)
Shared component library built with React and Tailwind CSS.

## 🌐 Deployment

### Web App Deployment (Vercel)

1. **Fork this repository**

2. **Deploy to Vercel:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/paylink-morph)

3. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd
   ```

### Alternative Deployment Options

- **Netlify**: Connect GitHub repo and deploy
- **Railway**: Deploy with one click
- **Docker**: Use provided Dockerfile
- **Self-hosted**: Build and serve static files

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Test smart contracts
cd packages/contract
pnpm test

# Test web application
cd packages/web
pnpm test

# Run all tests
pnpm test:all
```

**Contract Testing Results:**
- ✅ Bill creation and management
- ✅ Payment processing
- ✅ Double payment prevention
- ✅ Event emission
- ✅ Gas optimization

## 📱 Usage Guide

### For Merchants (Bill Creators)

1. **Connect Wallet**: Link your Web3 wallet
2. **Create Bill**: Set amount, token, and description
3. **Share QR Code**: Send QR code to your customer
4. **Receive Payment**: Get notified when payment is received

### For Customers (Payers)

1. **Scan QR Code**: Use the app or any QR scanner
2. **Review Payment**: Check amount and details
3. **Pay**: Complete payment (gasless transaction)
4. **Confirmation**: Receive payment confirmation

## 🔧 Development

### Local Development

```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm dev

# Start specific package
pnpm dev:web     # Web app only
pnpm dev:mobile  # Mobile app only
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:web
pnpm build:mobile
```

## 🌍 Supported Networks

- **Morph Holesky Testnet** (Primary)
- **Morph Mainnet** (Coming soon)

## 🔗 Important Links

- **Live Demo**: [paylink.morph.network](https://paylink.morph.network)
- **Contract Explorer**: [View on Morph Explorer](https://explorer-holesky.morphl2.io/address/0x7E29D4A4c3aA993ae46BF27d53Aea1F6B69EB9fd)
- **Documentation**: [docs/](./docs/)
- **Morph Network**: [morph.network](https://morph.network)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/paylink-morph/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/paylink-morph/discussions)
- **Discord**: [Join our Discord](https://discord.gg/morph)

## 🎯 Roadmap

- [x] Core payment functionality
- [x] QR code integration
- [x] Gasless transactions
- [x] Web application
- [ ] Mobile application release
- [ ] Multi-chain support
- [ ] Advanced analytics
- [ ] Merchant dashboard
- [ ] Recurring payments
- [ ] Invoice management

---

**Built with ❤️ on Morph L2**

*Empowering the future of digital payments through blockchain technology.* 