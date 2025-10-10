import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export default function RulesView() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          How to Play
        </h1>
        <p className="text-muted-foreground">Master the art of code-breaking</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Objective</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p className="text-sm">
            Your goal is to crack a secret 4-digit code by making strategic guesses.
            After each guess, you'll receive feedback to help you narrow down the
            possibilities.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">1. Make Your Guess</h3>
            <p className="text-sm text-muted-foreground">
              Select 4 numbers from 0-9 using the number pad. Click Submit when ready.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">2. Read the Feedback</h3>
            <p className="text-sm text-muted-foreground">
              After each guess, you'll see colored pegs that give you clues:
            </p>
            <div className="space-y-2 pl-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-success glow-success" />
                <span className="text-sm text-foreground">
                  <strong>Green Peg:</strong> Correct number in the correct position
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-warning" />
                <span className="text-sm text-foreground">
                  <strong>Yellow Peg:</strong> Correct number in the wrong position
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-border" />
                <span className="text-sm text-foreground">
                  <strong>Gray Peg:</strong> Number not in the code
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">3. Use Logic</h3>
            <p className="text-sm text-muted-foreground">
              Use the feedback from each guess to eliminate possibilities and refine
              your next attempt. Keep guessing until you crack the code or run out of
              attempts!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Difficulty Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Easy</div>
              <div className="text-sm text-muted-foreground">
                12 attempts, duplicates allowed
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Normal</div>
              <div className="text-sm text-muted-foreground">
                10 attempts, duplicates allowed
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Hard</div>
              <div className="text-sm text-muted-foreground">
                8 attempts, no duplicates
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Expert</div>
              <div className="text-sm text-muted-foreground">
                6 attempts, no duplicates
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Pro Tip</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Start with guesses that test different numbers to gather maximum information.
          A methodical approach beats random guessing every time!
        </CardContent>
      </Card>
    </div>
  );
}
