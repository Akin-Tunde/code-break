import { useState } from "react";
import { ScoreRow } from "@/components/leaderboard/ScoreRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, Clock } from "lucide-react";

type Difficulty = "easy" | "normal" | "hard" | "expert";

// Simplified leaderboard data structure
interface PlayerScore {
  address: string;
  attempts: number;
  time: number;
  totalGames?: number; // Optional for stats calculation
}

const mockLeaderboard: Record<Difficulty, PlayerScore[]> = {
  easy: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 4, time: 127, totalGames: 15 },
    { address: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", attempts: 5, time: 145, totalGames: 12 },
    { address: "0x8f0B8C8dF9e1E8c6A5B4D3C2B1A0a9b8c7d6e5f4", attempts: 6, time: 198, totalGames: 8 },
    { address: "0x1234567890123456789012345678901234567890", attempts: 7, time: 234, totalGames: 6 },
    { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", attempts: 8, time: 289, totalGames: 4 },
  ],
  normal: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 5, time: 156, totalGames: 10 },
    { address: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", attempts: 6, time: 187, totalGames: 8 },
    { address: "0x8f0B8C8dF9e1E8c6A5B4D3C2B1A0a9b8c7d6e5f4", attempts: 7, time: 245, totalGames: 5 },
  ],
  hard: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 6, time: 203, totalGames: 7 },
    { address: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", attempts: 7, time: 278, totalGames: 4 },
  ],
  expert: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 4, time: 189, totalGames: 3 },
  ],
};

export default function LeaderboardView() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("normal");

  const getCurrentStats = () => {
    const currentData = mockLeaderboard[selectedDifficulty];
    if (currentData.length === 0) return null;

    const totalPlayers = currentData.length;
    const totalGames = currentData.reduce((sum, player) => sum + (player.totalGames || 0), 0);
    const averageAttempts = currentData.reduce((sum, player) => sum + player.attempts, 0) / totalPlayers;
    const bestTime = Math.min(...currentData.map(player => player.time));

    return { totalPlayers, totalGames, averageAttempts, bestTime };
  };

  const stats = getCurrentStats();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">Top players from the blockchain</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Players
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{stats.totalPlayers}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" />
                Total Games
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-secondary">{stats.totalGames}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                Avg Attempts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-warning">{stats.averageAttempts.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Best Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-accent font-mono">{formatTime(stats.bestTime)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs
        value={selectedDifficulty}
        onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="easy">Easy</TabsTrigger>
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger value="hard">Hard</TabsTrigger>
          <TabsTrigger value="expert">Expert</TabsTrigger>
        </TabsList>

        {(["easy", "normal", "hard", "expert"] as Difficulty[]).map((difficulty) => (
          <TabsContent key={difficulty} value={difficulty} className="space-y-3 mt-6">
            {mockLeaderboard[difficulty].length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {mockLeaderboard[difficulty].map((score, index) => (
                  <ScoreRow
                    key={score.address}
                    rank={index + 1}
                    address={score.address}
                    attempts={score.attempts}
                    time={score.time}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No scores yet</p>
                <p className="text-sm">Be the first to claim the top spot!</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
