import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useFarcasterAuth } from "@/hooks/useFarcasterAuth"

export const FarcasterStatus = () => {
  const { 
    isAutoConnecting, 
    isFarcasterEnvironment, 
    isFarcasterConnected,
    error 
  } = useFarcasterAuth()

  if (isAutoConnecting) {
    return (
      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Auto-connecting...
      </Badge>
    )
  }

  if (error) {
    return (
      <Badge variant="secondary" className="bg-red-500/20 text-red-300">
        <AlertCircle className="h-3 w-3 mr-1" />
        Connection failed
      </Badge>
    )
  }

  if (isFarcasterConnected) {
    return (
      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        Farcaster Connected
      </Badge>
    )
  }

  if (isFarcasterEnvironment) {
    return (
      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
        Farcaster Environment
      </Badge>
    )
  }

  return null
}