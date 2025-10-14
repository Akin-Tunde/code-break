import { sdk as miniAppSdk } from '@farcaster/miniapp-sdk';
import { useEffect, createContext, useContext, useState } from 'react';

interface FarcasterProviderProps {
  children: React.ReactNode;
}

interface FarcasterUser {
  id?: string;
  address?: `0x${string}`;
  displayName?: string | null;
  [key: string]: unknown;
}

interface FarcasterContextType {
  isReady: boolean;
  sdk: typeof miniAppSdk;
  user: FarcasterUser | null;
}

const FarcasterContext = createContext<FarcasterContextType | null>(null);

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(null);

  useEffect(() => {
    // Initialize the Farcaster Mini App SDK
    const initializeSdk = async () => {
      try {
        // Signal that the mini app is ready
        await miniAppSdk.actions.ready();
        setIsReady(true);
        
        // Get user context if available
        const context = await miniAppSdk.context;
        if (context?.user) {
          setUser(context.user);
          console.log('Farcaster user context:', context.user);
        }
        
        console.log('Farcaster Mini App SDK initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize Farcaster Mini App SDK:', error);
        // Still set ready to true to allow the app to function
        setIsReady(true);
      }
    };

    initializeSdk();
  }, []);

  const contextValue: FarcasterContextType = {
    isReady,
    sdk: miniAppSdk,
    user
  };

  return (
    <FarcasterContext.Provider value={contextValue}>
      {children}
    </FarcasterContext.Provider>
  );
}

// Hook to use Farcaster context
export function useFarcasterMiniApp() {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error('useFarcasterMiniApp must be used within a FarcasterProvider');
  }
  return context;
}