import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { usePlayerStats } from "@/hooks/useChainBreakerContract";
import { Wallet, Trophy, Target, Clock, Zap } from "lucide-react";

export const WalletStatus = () => {
  const { address, isConnected, balance, connect, formatAddress, formatBalance } = useWallet();
  const { stats, isLoading } = usePlayerStats(address);

  if (!isConnected) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-primary" />
            Connect to Start Playing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your wallet to start playing ChainBreaker, track your scores, and compete on the leaderboard.
          </p>
          <Button onClick={connect} className="w-full gradient-primary glow-primary">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-success/5 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-success" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-xs text-muted-foreground font-mono">
              {formatAddress(address!)}
            </p>
          </div>
          <Badge variant="outline" className="border-success/30 text-success">
            Connected
          </Badge>
        </div>

        {/* Balance */}
        {balance && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Balance</p>
              <p className="text-xs text-muted-foreground">
                {formatBalance(balance.value, balance.decimals)} {balance.symbol}
              </p>
            </div>
          </div>
        )}

        {/* Game Stats */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-r-transparent rounded-full animate-spin" />
            Loading stats...
          </div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 mx-auto mb-1">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <p className="text-lg font-bold">{stats.gamesPlayed}</p>
              <p className="text-xs text-muted-foreground">Games</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/20 mx-auto mb-1">
                <Trophy className="w-4 h-4 text-success" />
              </div>
              <p className="text-lg font-bold">{stats.gamesWon}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/20 mx-auto mb-1">
                <Clock className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-lg font-bold">{stats.totalScore}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            <p>No game stats found on-chain</p>
            <p className="text-xs mt-1">Start playing to track your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};