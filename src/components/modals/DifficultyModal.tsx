import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Zap, Flame, Skull } from "lucide-react";

type Difficulty = "easy" | "normal" | "hard" | "expert";

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties = [
  {
    id: "easy" as Difficulty,
    name: "Easy",
    icon: Target,
    color: "text-success",
    attempts: 8,
    codeLength: 4,
    duplicates: true,
    description: "Perfect for beginners",
  },
  {
    id: "normal" as Difficulty,
    name: "Normal",
    icon: Zap,
    color: "text-primary",
    attempts: 6,
    codeLength: 4,
    duplicates: true,
    description: "Balanced challenge",
  },
  {
    id: "hard" as Difficulty,
    name: "Hard",
    icon: Flame,
    color: "text-accent",
    attempts: 6,
    codeLength: 5,
    duplicates: false,
    description: "5-digit code, no duplicates",
  },
  {
    id: "expert" as Difficulty,
    name: "Expert",
    icon: Skull,
    color: "text-destructive",
    attempts: 5,
    codeLength: 5,
    duplicates: false,
    description: "5-digit code, masters only",
  },
];

export const DifficultyModal = ({ isOpen, onClose, onSelect }: DifficultyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Challenge
          </DialogTitle>
          <DialogDescription className="text-center">
            Select a difficulty level to begin
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {difficulties.map((diff) => {
            const Icon = diff.icon;
            return (
              <Card
                key={diff.id}
                className="p-4 cursor-pointer hover:bg-card/50 transition-smooth border-border hover:border-primary/50"
                onClick={() => onSelect(diff.id)}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-6 w-6 ${diff.color} mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-foreground">{diff.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {diff.attempts} tries
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {diff.description}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                        {diff.codeLength}-digit code
                      </span>
                      <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                        {diff.duplicates ? "Duplicates allowed" : "No duplicates"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
