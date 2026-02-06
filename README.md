# GrimSwap App

Privacy-preserving DEX frontend for Uniswap v4 on Unichain, powered by ZK-SNARKs.

## Features

- **Private Swaps**: Swap ETH to USDC with complete sender/recipient unlinkability
- **Stealth Addresses**: One-time addresses for receiving swap outputs
- **ZK Proof Generation**: Client-side Groth16 proof generation
- **Deposit Management**: Grimoire wallet for managing deposit notes
- **Liquidity Provision**: Add liquidity to privacy and vanilla pools
- **Real-time Pool Data**: Live pool state from Uniswap v4 StateView

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS + GSAP animations
- wagmi + viem for Web3
- RainbowKit for wallet connection
- @grimswap/circuits SDK for ZK proofs
- IndexedDB for secure note storage

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Project Structure

```
src/
├── components/
│   ├── effects/       # Aurora, noise overlay, smooth scroll
│   ├── layout/        # Header, layout wrapper
│   ├── privacy/       # Ring visualization, stealth balance
│   ├── swap/          # Swap card, token inputs, settings
│   ├── ui/            # Buttons, cards, modals, inputs
│   └── web3/          # Connect button, transaction status
├── hooks/
│   ├── use-deposit-notes.ts     # IndexedDB note management
│   ├── use-grim-swap.ts         # Private swap execution
│   ├── use-liquidity.ts         # Add/remove liquidity
│   ├── use-merkle-tree.ts       # Poseidon tree sync
│   ├── use-pool-manager.ts      # Pool state from events
│   ├── use-quoter.ts            # Swap quotes
│   ├── use-state-view.ts        # Pool state from StateView
│   ├── use-stealth-addresses.ts # ERC-5564 stealth keys
│   └── use-token-balance.ts     # ETH/ERC20 balances
├── lib/
│   ├── constants.ts   # Contract addresses, chain config
│   ├── contracts.ts   # Pool keys, ABIs
│   ├── relayer.ts     # Relayer API client
│   ├── tokens.ts      # Token definitions
│   └── zk/            # Proof generation, Merkle tree
├── pages/
│   ├── home.tsx       # Landing page
│   ├── pools.tsx      # Liquidity pools
│   ├── swap.tsx       # Swap interface
│   └── wallet.tsx     # Grimoire (deposit notes + stealth)
└── providers.tsx      # Web3 + React Query providers
```

## Pages

### `/swap` - Private Swap
1. Deposit ETH to GrimPool (creates encrypted note)
2. Generate ZK proof client-side
3. Submit to relayer for execution
4. Receive USDC at stealth address

### `/pools` - Liquidity Pools
- View active pools (vanilla + privacy)
- Add liquidity to pools
- View pool statistics (TVL, price, composition)
- Initialize new privacy pools

### `/wallet` - Grimoire
- Manage deposit notes
- View stealth addresses and balances
- Claim tokens from stealth addresses
- Export/import notes

## Contract Addresses (Unichain Sepolia)

| Contract | Address |
|----------|---------|
| GrimPool | `0xEAB5E7B4e715A22E8c114B7476eeC15770B582bb` |
| GrimSwapZK (Hook) | `0x3bee7D1A5914d1ccD34D2a2d00C359D0746400C4` |
| GrimSwapRouter | `0xC13a6a504da21aD23c748f08d3E991621D42DA4F` |
| Groth16Verifier | `0xF7D14b744935cE34a210D7513471a8E6d6e696a0` |
| PoolManager | `0x00B036B58a818B1BC34d502D3fE730Db729e62AC` |
| StateView | `0xc199f1072a74d4e905aba1a84d9a45e2546b6222` |
| USDC | `0x31d0220469e10c4E71834a79b1f276d740d3768F` |

## Pool Configuration

### ETH/USDC GrimSwap Privacy Pool

| Parameter | Value |
|-----------|-------|
| Pool ID | `0xca4150cd3ab144877e0dee5630129d84b986daa7ef5f287729e2f2da00c3fe38` |
| Fee | 3000 (0.3%) |
| TickSpacing | 60 |
| Hook | `0x3bee7D1A5914d1ccD34D2a2d00C359D0746400C4` |

### ETH/USDC Vanilla Pool

| Parameter | Value |
|-----------|-------|
| Pool ID | `0x1927686e9757bb312fc499e480536d466c788dcdc86a1b62c82643157f05b603` |
| Fee | 3000 (0.3%) |
| TickSpacing | 60 |
| Hook | `0x0000000000000000000000000000000000000000` |

## Privacy Flow

```
1. DEPOSIT
   User → GrimPool.deposit(commitment) + ETH
   └─► Commitment added to Merkle tree
   └─► Note saved locally (secret + nullifier)

2. PRIVATE SWAP
   User → Generate ZK proof (proves deposit without revealing which one)
   └─► Submit proof to relayer
   └─► Relayer calls GrimSwapRouter.executePrivateSwap()
   └─► GrimSwapZK hook verifies proof + routes to stealth address

3. CLAIM
   User → Derive stealth private key
   └─► Sweep tokens to regular wallet
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Relayer

The app connects to the GrimSwap relayer at `https://services.grimswap.com` for submitting private swaps. The relayer:
- Validates ZK proofs locally
- Submits transactions on-chain
- Pays gas on behalf of users
- Funds stealth addresses with ETH for claiming

## License

MIT
