// Farcaster Frame Configuration
export interface FarcasterFrameConfig {
  accountAssociation: {
    header: string
    payload: string
    signature: string
  }
  frame: {
    version: string
    name: string
    iconUrl: string
    homeUrl: string
    imageUrl: string
    buttonTitle: string
    splashImageUrl: string
    splashBackgroundColor: string
    webhookUrl: string
  }
}

export const FARCASTER_CONFIG: FarcasterFrameConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjMyMDI2NCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFGMkE1MkYwZjlDZDYwZGY4RDAwNTdjNGE1YTEwRUFlNjQyNjNCNDgifQ",
    payload: "eyJkb21haW4iOiJtYWJyZWFrZXIubmV0bGlmeS5hcHAifQ",
    signature: "MHgzZDUyZTI4NDI3N2E2ZjM4NzQ0YjNhZjI2YjcwNWFhMTI4MWQ0NWY1NzBhM2Q5NWFkOWJiNzIzOWI2OGIyMjYzMDFjMmNiNjBlOWE1YmIzMGQ4NTIzOTg3NTYwZGZkMWQ4YjRiM2ZkMTZjYjIzZDJkNzQ4YjA0ZWI0NmMxMTRhNTFj"
  },
  frame: {
    version: "1",
    name: "ChainBreaker Game",
    iconUrl: "https://mabreaker.netlify.app/icon.png",
    homeUrl: "https://mabreaker.netlify.app",
    imageUrl: "https://mabreaker.netlify.app/image.png",
    buttonTitle: "Play ChainBreaker",
    splashImageUrl: "https://mabreaker.netlify.app/splash.png",
    splashBackgroundColor: "#270080",
    webhookUrl: "https://mabreaker.netlify.app/api/webhook"
  }
}

// Decode Farcaster account association header
export const decodeFarcasterHeader = (header: string) => {
  try {
    const decoded = atob(header)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to decode Farcaster header:', error)
    return null
  }
}

// Decode Farcaster account association payload
export const decodeFarcasterPayload = (payload: string) => {
  try {
    const decoded = atob(payload)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to decode Farcaster payload:', error)
    return null
  }
}

// Check if current environment is a Farcaster Frame
export const isFarcasterFrame = () => {
  if (typeof window === 'undefined') return false
  
  // Don't detect as Frame in localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return false
  }
  
  // Check for Farcaster Frame context
  const userAgent = navigator.userAgent.toLowerCase()
  const isFarcasterApp = userAgent.includes('farcaster') || 
                        userAgent.includes('warpcast') ||
                        window.location.hostname.includes('warpcast')
  
  // Check for Frame context in parent window (but not in dev)
  const hasFrameParent = !!(window.parent && window.parent !== window) && 
                         !window.location.hostname.includes('localhost')
  
  // Check for Frame-specific URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const hasFrameParams = urlParams.has('fc_frame') || urlParams.has('farcaster_frame')
  
  return isFarcasterApp || hasFrameParent || hasFrameParams
}

// Get Farcaster user data from the decoded header
export const getFarcasterUserData = () => {
  const headerData = decodeFarcasterHeader(FARCASTER_CONFIG.accountAssociation.header)
  const payloadData = decodeFarcasterPayload(FARCASTER_CONFIG.accountAssociation.payload)
  
  if (headerData && payloadData) {
    return {
      fid: headerData.fid,
      type: headerData.type,
      key: headerData.key,
      domain: payloadData.domain,
      isVerified: true
    }
  }
  
  return null
}