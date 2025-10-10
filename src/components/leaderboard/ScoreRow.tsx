import { Trophy, Medal, Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreRowProps {
  rank: number;
  address: string;
  attempts: number;
  time: number;
}

export const ScoreRow = ({ rank, address, attempts, time }: ScoreRowProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-warning" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-4 w-4 text-accent" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-warning/20 text-warning border-warning/30";
    if (rank === 2) return "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30";
    if (rank === 3) return "bg-accent/20 text-accent border-accent/30";
    return "bg-muted/20 text-muted-foreground border-muted/30";
  };

  return (
    <div
      className={cn(
        "flex flex-col p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors",
        rank === 1 && "border-warning/30 bg-warning/5",
        rank === 2 && "border-muted-foreground/30 bg-muted/5",
        rank === 3 && "border-accent/30 bg-accent/5"
      )}
    >
      {/* Rank and Player */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg border font-bold text-xs",
          getRankBadge(rank)
        )}>
          {getRankIcon(rank) || `#${rank}`}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-semibold truncate text-foreground">
            {formatAddress(address)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Attempts</span>
          <span className="font-bold text-primary">{attempts}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Time</span>
          </div>
          <span className="font-bold text-secondary font-mono">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};
