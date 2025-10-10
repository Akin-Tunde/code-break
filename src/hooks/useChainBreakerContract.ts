import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { mainnet } from 'viem/chains'

// Example ChainBreaker Game Contract ABI (simplified)
const CHAINBREAKER_ABI = [
  {
    "inputs": [
      {"name": "difficulty", "type": "uint8"},
      {"name": "solution", "type": "uint256[]"}
    ],
    "name": "submitSolution",
    "outputs": [{"name": "success", "type": "bool"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "player", "type": "address"}],
    "name": "getPlayerStats",
    "outputs": [
      {"name": "gamesPlayed", "type": "uint256"},
      {"name": "gamesWon", "type": "uint256"},
      {"name": "totalScore", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "difficulty", "type": "uint8"}],
    "name": "startGame",
    "outputs": [{"name": "gameId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLeaderboard",
    "outputs": [
      {"name": "players", "type": "address[]"},
      {"name": "scores", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Replace with your deployed contract address
const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`

export const useChainBreakerContract = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { address } = useAccount()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  // Start a new game
  const startGame = (difficulty: number, entryFee: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CHAINBREAKER_ABI,
      functionName: 'startGame',
      args: [difficulty],
      value: parseEther(entryFee),
      chain: mainnet,
      account: address as `0x${string}`
    })
  }

  // Submit solution
  const submitSolution = (difficulty: number, solution: number[]) => {
    const solutionBigint = solution.map(n => BigInt(n))
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CHAINBREAKER_ABI,
      functionName: 'submitSolution',
      args: [difficulty, solutionBigint],
      chain: mainnet,
      account: address as `0x${string}`
    })
  }

  return {
    startGame,
    submitSolution,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed
  }
}

// Hook to read player stats
export const usePlayerStats = (playerAddress?: `0x${string}`) => {
  const { data: stats, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHAINBREAKER_ABI,
    functionName: 'getPlayerStats',
    args: playerAddress ? [playerAddress] : undefined,
  })

  return {
    stats: stats ? {
      gamesPlayed: Number(stats[0]),
      gamesWon: Number(stats[1]),
      totalScore: Number(stats[2])
    } : null,
    isLoading,
    error
  }
}

// Hook to read leaderboard
export const useLeaderboard = () => {
  const { data: leaderboardData, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHAINBREAKER_ABI,
    functionName: 'getLeaderboard'
  })

  const leaderboard = leaderboardData ? 
    (leaderboardData[0] as `0x${string}`[]).map((address, index) => ({
      address,
      score: Number((leaderboardData[1] as bigint[])[index])
    })) : []

  return {
    leaderboard,
    isLoading,
    error
  }
}