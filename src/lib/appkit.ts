import { QueryClient } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";

// Import the chains you use from the AppKit networks path
import { mainnet, sepolia, base, baseSepolia, polygon, arbitrum } from "@reown/appkit/networks";

// --- MODIFICATION: Import connectors to define a custom priority ---
import { injected, walletConnect } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

// 0. Setup queryClient
export const queryClient = new QueryClient();

// 1. Get projectId from your .env file
const projectId = import.meta.env.VITE_PROJECT_ID;

if (!projectId) {
  throw new Error("VITE_PROJECT_ID is not set in .env");
}

// 2. Create a metadata object (optional but recommended)
const metadata = {
  name: "ChainBreaker",
  description: "A strategic code-breaking game on the blockchain with Farcaster integration",
  url: "https://mabreaker.netlify.app/", // Your production URL
  icons: ["https://mabreaker.netlify.app/icon.png"], // A URL to your app's icon
};

// 3. Set the networks and use 'as const' to satisfy the type requirement
export const networks = [mainnet, sepolia, base, baseSepolia, polygon, arbitrum];

// --- MODIFICATION: Create a prioritized list of connectors ---
// By placing miniAppConnector() first, we ensure it's the default inside Farcaster.
const connectors = [
  miniAppConnector(),
  injected({ shimDisconnect: true }),
  walletConnect({ projectId }),
];

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  // Pass the custom connectors list to the adapter
  // This ensures Farcaster SDK is prioritized
  connectors,
  ssr: false, // Set to false for Vite/React SPA
});

// 5. Create the AppKit modal instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia, base, baseSepolia, polygon, arbitrum],
  projectId,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#270080',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#270080',
    '--w3m-border-radius-master': '12px'
  },
  features: {
    analytics: true, // Enable analytics (optional)
  },
});