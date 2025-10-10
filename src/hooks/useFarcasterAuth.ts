import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { isFarcasterFrame, getFarcasterUserData, FARCASTER_CONFIG } from '@/config/farcaster'
import { useFarcasterMiniApp } from '@/providers/FarcasterProvider'

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
  isMiniApp: boolean
}

export const useFarcasterAuth = () => {
  const { address, isConnected } = useAccount()
  const { isReady, user: miniAppUser } = useFarcasterMiniApp()
  
  const [authState, setAuthState] = useState<FarcasterAuthState>({
    isDetecting: false,
    isFarcasterUser: false,
    farcasterData: null,
    isAutoConnecting: false,
    error: null,
    isFrameEnvironment: false,
    isMiniApp: false
  })

  // Check if we're in a Farcaster Frame environment or Mini App
  useEffect(() => {
    const isFrame = isFarcasterFrame()
    const isMiniAppEnvironment = isReady && !!miniAppUser
    
    setAuthState(prev => ({ 
      ...prev, 
      isFrameEnvironment: isFrame,
      isMiniApp: isMiniAppEnvironment
    }))
    
    // Prioritize Mini App user data
    if (isMiniAppEnvironment && miniAppUser) {
      setAuthState(prev => ({
        ...prev,
        isFarcasterUser: true,
        farcasterData: {
          fid: miniAppUser.fid,
          username: miniAppUser.username,
          displayName: miniAppUser.displayName,
          pfpUrl: miniAppUser.pfpUrl,
          isVerified: true
        }
      }))
    } else if (isFrame) {
      // Fallback to Frame config data
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
  }, [isReady, miniAppUser])

  // Manual connect function for Farcaster environments
  const connectWithFarcaster = () => {
    if (authState.isFrameEnvironment || authState.isMiniApp) {
      setAuthState(prev => ({ ...prev, isAutoConnecting: true }))
      
      // Open wallet connection modal
      if (typeof window !== 'undefined' && window.appkit) {
        window.appkit.open()
      }
      
      // Reset auto-connecting state after a delay
      setTimeout(() => {
        setAuthState(prev => ({ ...prev, isAutoConnecting: false }))
      }, 3000)
    }
  }

  return {
    ...authState,
    frameConfig: FARCASTER_CONFIG.frame,
    miniAppUser,
    connectWithFarcaster
  }
}