import { http } from 'viem'
import { mainnet, arbitrum, polygon, base, sepolia } from 'viem/chains'
import { createConfig } from 'wagmi'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.VITE_PROJECT_ID || 'demo_project_id'

// Use demo project ID for development if no real project ID is provided
if (projectId === 'YOUR_PROJECT_ID' || !projectId) {
  console.warn('⚠️ Using demo project ID. Get a real project ID from https://cloud.reown.com')
}

// Create the metadata object
const metadata = {
  name: 'ChainBreaker',
  description: 'Blockchain Code-Breaking Game',
  url: 'https://chainbreaker.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Define the chains your app will work with
export const chains = [mainnet, arbitrum, polygon, base, sepolia] as const

// Create wagmiConfig
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})