import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  
  const { data: balance } = useBalance({
    address: address,
  })

  // Use the global AppKit instance safely
  const connect = () => {
    try {
      if (typeof window !== 'undefined' && window.appkit) {
        window.appkit.open()
      } else {
        console.warn('AppKit not available')
      }
    } catch (error) {
      console.error('Failed to open AppKit modal:', error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: bigint, decimals: number = 18) => {
    const balanceInEth = Number(balance) / Math.pow(10, decimals)
    return balanceInEth.toFixed(4)
  }

  return {
    address,
    isConnected,
    isConnecting,
    balance,
    connect,
    disconnect,
    formatAddress,
    formatBalance
  }
}