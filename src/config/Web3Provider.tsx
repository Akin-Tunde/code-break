import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { wagmiConfig, projectId } from './wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from 'react'
import { mainnet, arbitrum, polygon, base, sepolia } from 'viem/chains'

// Create a client
const queryClient = new QueryClient()

// AppKit specific chains (mutable array for AppKit)
const appKitChains = [mainnet, arbitrum, polygon, base, sepolia]

// Create the Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId,
  networks: appKitChains
})

// Create the modal and store it globally
const appkit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: appKitChains,
  themeMode: 'dark',
  metadata: {
    name: 'ChainBreaker',
    description: 'A strategic code-breaking game on the blockchain with Farcaster integration',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://chainbreaker.app',
    icons: ['/favicon.ico']
  },
  themeVariables: {
    '--w3m-color-mix': '#270080',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#270080',
    '--w3m-border-radius-master': '12px'
  },
  featuredWalletIds: [
    // MetaMask
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    // WalletConnect
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    // Coinbase Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    // Trust Wallet
    '4457104986f61e1d3c3f51e65a0e54df3c55b5b3f1e1b6e5b8e1b1e1b1e1b1e1'
  ],
  // Enable social logins including Farcaster
  enableSocials: ['farcaster', 'google', 'x', 'github', 'discord', 'apple'],
  // Enable email login
  enableEmail: true,
  // Enable one-click auth
  enableOnramp: true
})

// Store globally for access in hooks
declare global {
  interface Window {
    appkit: typeof appkit
  }
}

// Safe initialization
if (typeof window !== 'undefined') {
  try {
    window.appkit = appkit
  } catch (error) {
    console.warn('Failed to store AppKit globally:', error)
  }
}

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}