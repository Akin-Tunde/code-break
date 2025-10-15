import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, XCircle, Clock } from "lucide-react";

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWon: boolean;
  attempts: number;
  secretCode: number[];
  elapsedTime: number;
  onPlayAgain: () => void;
}

export const GameResultModal = ({
  isOpen,
  onClose,
  isWon,
  attempts,
  secretCode,
  elapsedTime,
  onPlayAgain,
}: GameResultModalProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-labelledby="game-result-title" aria-describedby="game-result-desc" className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {isWon ? (
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-success" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            )}
          </div>
          <DialogTitle id="game-result-title" className="text-xl text-center">
            {isWon ? (
              <span className="bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                Code Cracked!
              </span>
            ) : (
              <span className="text-destructive">Game Over</span>
            )}
          </DialogTitle>
          <div id="game-result-desc" className="text-center space-y-4">
            {isWon ? (
              <div className="space-y-2">
                <p>Congratulations! You solved it in {attempts} tries!</p>
                <div className="flex items-center justify-center gap-2 text-secondary">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span>
                </div>
              </div>
            ) : (
              <p>Better luck next time!</p>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">The secret code was:</p>
              <div className="flex justify-center gap-2">
                {secretCode.map((num, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center text-lg sm:text-xl font-bold text-primary glow-primary"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={onPlayAgain}
            className="flex-1 gradient-primary glow-primary"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
