import { Button } from "@/components/ui/button";
import { Delete, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  codeLength?: number;
  currentLength?: number;
}

export const NumberPad = ({
  onNumberClick,
  onDelete,
  onSubmit,
  canSubmit,
  codeLength = 4,
  currentLength = 0,
}: NumberPadProps) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-3">
      {/* Number Grid */}
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((num) => (
          <Button
            key={num}
            onClick={() => onNumberClick(num)}
            variant="outline"
            disabled={currentLength >= codeLength}
            className="h-14 text-base font-semibold hover:bg-primary/20 hover:border-primary transition-smooth"
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onDelete}
          variant="destructive"
          className="h-12"
        >
          <Delete className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            "h-12",
            canSubmit && "gradient-primary glow-primary"
          )}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit
        </Button>
      </div>
    </div>
  );
};
