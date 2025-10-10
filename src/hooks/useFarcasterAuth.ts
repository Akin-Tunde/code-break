import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { isFarcasterFrame, getFarcasterUserData, FARCASTER_CONFIG } from '@/config/farcaster'

interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  custody?: string
  isVerified: boolean
}

interface FarcasterAuthState {
  isDetecting: boolean
  isFarcasterUser: boolean
  farcasterData: FarcasterUser | null
  isAutoConnecting: boolean
  error: string | null
  isFrameEnvironment: boolean
}

export const useFarcasterAuth = () => {
  const { address, isConnected } = useAccount()
  
  const [authState, setAuthState] = useState<FarcasterAuthState>({
    isDetecting: false,
    isFarcasterUser: false,
    farcasterData: null,
    isAutoConnecting: false,
    error: null,
    isFrameEnvironment: false
  })

  // Check if we're in a Farcaster Frame environment
  useEffect(() => {
    const isFrame = isFarcasterFrame()
    setAuthState(prev => ({ ...prev, isFrameEnvironment: isFrame }))
    
    if (isFrame) {
      // If we're in a Frame, try to get user data from the frame config
      const userData = getFarcasterUserData()
      if (userData) {
        setAuthState(prev => ({
          ...prev,
          isFarcasterUser: true,
          farcasterData: {
            fid: userData.fid,
            isVerified: userData.isVerified,
            displayName: `User ${userData.fid}`,
            username: `fid${userData.fid}`
          }
        }))
      }
    }
  }, [])

  // Auto-connect in Farcaster Frame environment
  useEffect(() => {
    if (authState.isFrameEnvironment && !isConnected) {
      setAuthState(prev => ({ ...prev, isAutoConnecting: true }))
      
      // In a Frame environment, attempt auto-connect
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          // Trigger wallet connection
          setAuthState(prev => ({ ...prev, isAutoConnecting: false }))
        }
      }, 1000)
    }
  }, [authState.isFrameEnvironment, isConnected])

  return {
    ...authState,
    frameConfig: FARCASTER_CONFIG.frame
  }
}