import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

interface FarcasterAuthState {
  isAutoConnecting: boolean
  isFarcasterEnvironment: boolean
  isFarcasterConnected: boolean
  error: string | null
}

// Safe AppKit access
const getAppKit = () => {
  try {
    if (typeof window !== 'undefined' && window.appkit) {
      return window.appkit
    }
    return null
  } catch (error) {
    console.warn('AppKit not available:', error)
    return null
  }
}

export const useFarcasterAuth = () => {
  const { address, isConnected, connector } = useAccount()
  
  const [authState, setAuthState] = useState<FarcasterAuthState>({
    isAutoConnecting: false,
    isFarcasterEnvironment: false,
    isFarcasterConnected: false,
    error: null
  })

  // Check if user is in Farcaster environment
  const checkFarcasterEnvironment = () => {
    if (typeof window === 'undefined') return false

    const userAgent = navigator.userAgent.toLowerCase()
    const hostname = window.location.hostname.toLowerCase()
    
    // Check for various Farcaster indicators
    const isFarcasterApp = 
      userAgent.includes('farcaster') || 
      userAgent.includes('warpcast') ||
      hostname.includes('warpcast') ||
      hostname.includes('farcaster') ||
      // Check for Farcaster Frame context
      !!(window as any).parent?.postMessage ||
      // Check for specific Farcaster client indicators
      !!(window as any).fc ||
      !!(window as any).farcaster ||
      // Check URL parameters that might indicate Farcaster
      window.location.search.includes('farcaster') ||
      window.location.hash.includes('farcaster')

    return isFarcasterApp
  }

  // Check if connected via Farcaster social login
  const checkFarcasterConnection = () => {
    if (!isConnected || !connector) return false
    
    // Check if connection method indicates social login
    const connectorName = connector.name?.toLowerCase() || ''
    const connectorId = connector.id?.toLowerCase() || ''
    
    // WalletConnect AppKit uses these identifiers for social logins
    return connectorName.includes('farcaster') || 
           connectorId.includes('farcaster') ||
           connectorName.includes('social') ||
           connectorId.includes('social')
  }

  // Auto-connect if in Farcaster environment
  const autoConnectFarcaster = async () => {
    const isFarcasterEnv = checkFarcasterEnvironment()
    
    setAuthState(prev => ({ 
      ...prev, 
      isFarcasterEnvironment: isFarcasterEnv,
      isAutoConnecting: isFarcasterEnv && !isConnected 
    }))

    if (isFarcasterEnv && !isConnected) {
      try {
        const appkit = getAppKit()
        if (appkit) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            appkit.open()
          }, 1000)
        }
      } catch (error) {
        console.error('Auto-connect error:', error)
        setAuthState(prev => ({
          ...prev,
          isAutoConnecting: false,
          error: 'Failed to auto-connect'
        }))
      }
    }
  }

  // Manual connect function
  const connectWithFarcaster = () => {
    try {
      const appkit = getAppKit()
      if (appkit) {
        // Open modal with focus on social logins
        appkit.open({ view: 'Connect' })
      }
    } catch (error) {
      console.error('Connect error:', error)
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to open connection modal'
      }))
    }
  }

  // Auto-connect on page load if in Farcaster environment
  useEffect(() => {
    autoConnectFarcaster()
  }, [])

  // Update connection state when connection changes
  useEffect(() => {
    const isFarcasterConn = checkFarcasterConnection()
    
    setAuthState(prev => ({ 
      ...prev, 
      isFarcasterConnected: isFarcasterConn,
      isAutoConnecting: isConnected ? false : prev.isAutoConnecting
    }))
  }, [isConnected, connector])

  return {
    ...authState,
    autoConnectFarcaster,
    connectWithFarcaster
  }
}