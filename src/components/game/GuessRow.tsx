import { cn } from "@/lib/utils";

interface GuessRowProps {
  guess?: number[];
  feedback?: { correct: number; partial: number };
  isActive?: boolean;
}

export const GuessRow = ({ guess, feedback, isActive }: GuessRowProps) => {
  const getFeedbackForPosition = (index: number): "correct" | "partial" | "none" => {
    if (!feedback || !guess) return "none";
    
    const totalFeedback = feedback.correct + feedback.partial;
    if (index < feedback.correct) return "correct";
    if (index < totalFeedback) return "partial";
    return "none";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-smooth",
        isActive
          ? "border-primary bg-primary/10 glow-primary"
          : "border-border bg-card"
      )}
    >
      {/* Guess Numbers with Feedback Colors Below */}
      <div className="flex gap-1.5 sm:gap-2 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm sm:text-base font-bold border-2 transition-smooth",
                guess?.[i] !== undefined
                  ? "bg-muted border-primary text-foreground"
                  : "bg-background border-border text-muted-foreground"
              )}
            >
              {guess?.[i] ?? "?"}
            </div>
            {/* Feedback indicator below each number */}
            {feedback && (
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-smooth",
                  getFeedbackForPosition(i) === "correct" && "bg-success glow-success",
                  getFeedbackForPosition(i) === "partial" && "bg-warning",
                  getFeedbackForPosition(i) === "none" && "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Feedback Pegs (kept for reference) */}
      {feedback && (
        <div className="flex flex-col gap-1">
          {/* Green pegs (correct position) */}
          {Array.from({ length: feedback.correct }).map((_, i) => (
            <div
              key={`correct-${i}`}
              className="w-3 h-3 rounded-full bg-success glow-success"
            />
          ))}
          {/* Yellow pegs (correct number, wrong position) */}
          {Array.from({ length: feedback.partial }).map((_, i) => (
            <div
              key={`partial-${i}`}
              className="w-3 h-3 rounded-full bg-warning"
            />
          ))}
          {/* Empty pegs */}
          {Array.from({
            length: 4 - feedback.correct - feedback.partial,
          }).map((_, i) => (
            <div key={`empty-${i}`} className="w-3 h-3 rounded-full bg-border" />
          ))}
        </div>
      )}
    </div>
  );
};
