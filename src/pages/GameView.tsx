import { useState, useEffect } from "react";
import { GuessRow } from "@/components/game/GuessRow";
import { NumberPad } from "@/components/game/NumberPad";
import { Button } from "@/components/ui/button";
import { DifficultyModal } from "@/components/modals/DifficultyModal";
import { GameResultModal } from "@/components/modals/GameResultModal";
import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { TreasuryPool } from "@/components/game/TreasuryPool";
import { RecentActivities } from "@/components/game/RecentActivities";
import { Play, Clock, Eye, EyeOff } from "lucide-react";

type Difficulty = "easy" | "normal" | "hard" | "expert";

interface GameState {
  secretCode: number[];
  guesses: { guess: number[]; feedback: { correct: number; partial: number; status?: Array<'correct' | 'partial' | 'none'> } }[];
  currentGuess: number[];
  attemptsLeft: number;
  maxAttempts: number;
  difficulty: Difficulty | null;
  isGameOver: boolean;
  isWon: boolean;
  startTime: number | null;
  elapsedTime: number;
}

const DIFFICULTY_SETTINGS = {
  easy: { maxAttempts: 8, allowDuplicates: true, timeLimit: 600, codeLength: 4 }, // 10 minutes
  normal: { maxAttempts: 6, allowDuplicates: true, timeLimit: 480, codeLength: 4 }, // 8 minutes
  hard: { maxAttempts: 6, allowDuplicates: false, timeLimit: 360, codeLength: 5 }, // 6 minutes
  expert: { maxAttempts: 5, allowDuplicates: false, timeLimit: 240, codeLength: 5 }, // 4 minutes
};

export default function GameView() {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [treasuryAmount] = useState(1247.5);
  const [recentActivities] = useState([
    {
      id: "1",
      player: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      difficulty: "Hard",
      attempts: 7,
      time: 245,
      won: true,
      timestamp: new Date(),
    },
    {
      id: "2",
      player: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
      difficulty: "Normal",
      attempts: 10,
      time: 412,
      won: false,
      timestamp: new Date(),
    },
    {
      id: "3",
      player: "0x1aD91ee08f21bE3dE0BA2ba6918E714dA6B45836",
      difficulty: "Expert",
      attempts: 8,
      time: 189,
      won: true,
      timestamp: new Date(),
    },
    {
      id: "4",
      player: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c",
      difficulty: "Easy",
      attempts: 5,
      time: 156,
      won: true,
      timestamp: new Date(),
    },
  ]);
  const [gameState, setGameState] = useState<GameState>({
    secretCode: [],
    guesses: [],
    currentGuess: [],
    attemptsLeft: 10,
    maxAttempts: 10,
    difficulty: null,
    isGameOver: false,
    isWon: false,
    startTime: null,
    elapsedTime: 0,
  });
  const [announce, setAnnounce] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.startTime && !gameState.isGameOver && gameState.difficulty) {
      interval = setInterval(() => {
        const settings = DIFFICULTY_SETTINGS[gameState.difficulty!];
        const elapsed = Math.floor((Date.now() - gameState.startTime!) / 1000);
        const remaining = settings.timeLimit - elapsed;
        
        if (remaining <= 0) {
          // Time's up - game over
          setGameState((prev) => ({
            ...prev,
            elapsedTime: settings.timeLimit,
            isGameOver: true,
            isWon: false,
          }));
          setTimeout(() => setShowResultModal(true), 500);
        } else {
          setGameState((prev) => ({
            ...prev,
            elapsedTime: elapsed,
          }));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.startTime, gameState.isGameOver, gameState.difficulty]);

  const generateSecretCode = (allowDuplicates: boolean, codeLength: number): number[] => {
    const code: number[] = [];
    while (code.length < codeLength) {
      const num = Math.floor(Math.random() * 10);
      if (allowDuplicates || !code.includes(num)) {
        code.push(num);
      }
    }
    return code;
  };

  const startNewGame = (difficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    setGameState({
      secretCode: generateSecretCode(settings.allowDuplicates, settings.codeLength),
      guesses: [],
      currentGuess: [],
      attemptsLeft: settings.maxAttempts,
      maxAttempts: settings.maxAttempts,
      difficulty,
      isGameOver: false,
      isWon: false,
      startTime: Date.now(),
      elapsedTime: 0,
    });
    setShowDifficultyModal(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRemainingTime = (): number => {
    if (!gameState.difficulty) return 0;
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    return Math.max(0, settings.timeLimit - gameState.elapsedTime);
  };

  // Clear announce after brief interval so SR reads repeated messages
  useEffect(() => {
    if (!announce) return;
    const t = setTimeout(() => setAnnounce(null), 2000);
    return () => clearTimeout(t);
  }, [announce]);

  // DEBUG: temporary console log to observe currentGuess updates
  useEffect(() => {
    console.log("[debug] currentGuess:", gameState.currentGuess);
  }, [gameState.currentGuess]);

  // Returns counts and per-position status for precise feedback
  const calculateFeedback = (guess: number[], secret: number[]) => {
    const codeLen = secret.length;
    const status: Array<'correct' | 'partial' | 'none'> = Array(codeLen).fill('none');
    const secretCopy = [...secret];

    // First pass: mark correct positions
    for (let i = 0; i < codeLen; i++) {
      if (guess[i] === secretCopy[i]) {
        status[i] = 'correct';
        secretCopy[i] = -1; // consume
      }
    }

    // Second pass: mark partials (correct number, wrong position)
    for (let i = 0; i < codeLen; i++) {
      if (status[i] === 'none') {
        const idx = secretCopy.indexOf(guess[i]);
        if (idx !== -1) {
          status[i] = 'partial';
          secretCopy[idx] = -1; // consume
        }
      }
    }

    const correct = status.filter((s) => s === 'correct').length;
    const partial = status.filter((s) => s === 'partial').length;

    return { correct, partial, status };
  };

  const handleNumberClick = useCallback((num: number) => {
    const codeLen = gameState.secretCode.length || DIFFICULTY_SETTINGS[gameState.difficulty!].codeLength;
    if (gameState.currentGuess.length < codeLen && !gameState.isGameOver) {
      setGameState((prev) => ({
        ...prev,
        currentGuess: [...prev.currentGuess, num],
      }));
    }
  }, [gameState.secretCode.length, gameState.currentGuess.length, gameState.isGameOver, gameState.difficulty]);

  const handleDelete = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const codeLen = gameState.secretCode.length || DIFFICULTY_SETTINGS[gameState.difficulty!].codeLength;
    if (gameState.currentGuess.length === codeLen) {
      // Validate duplicates rule
      const settings = DIFFICULTY_SETTINGS[gameState.difficulty!];
      if (!settings.allowDuplicates) {
        const seen = new Set<number>();
        for (const n of gameState.currentGuess) {
          if (seen.has(n)) {
            // show accessible toast/announcement
            toast({ title: "Invalid guess", description: "Duplicates are not allowed on this difficulty" });
            setAnnounce("Invalid guess: duplicates are not allowed");
            return;
          }
          seen.add(n);
        }
      }

      const feedback = calculateFeedback(gameState.currentGuess, gameState.secretCode);
      const newGuesses = [
        ...gameState.guesses,
        { guess: gameState.currentGuess, feedback },
      ];
      const isWon = feedback.correct === codeLen;
      const newAttemptsLeft = gameState.attemptsLeft - 1;
      const isGameOver = isWon || newAttemptsLeft === 0;

      setGameState((prev) => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: [],
        attemptsLeft: newAttemptsLeft,
        isGameOver,
        isWon,
      }));

      // Announce feedback for screen readers
      setAnnounce(`Feedback: ${feedback.correct} correct, ${feedback.partial} partial`);

      if (isGameOver) {
        setTimeout(() => setShowResultModal(true), 500);
      }
    }
  }, [gameState]);

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setShowDifficultyModal(true);
  };

  // Keyboard support: number keys, Backspace, Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!gameState.difficulty || gameState.isGameOver) return;
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleNumberClick(Number(key));
      } else if (key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNumberClick, handleDelete, handleSubmit, gameState.difficulty, gameState.isGameOver]);

  if (!gameState.difficulty) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Treasury Pool */}
        <div className="mb-6">
          <TreasuryPool amount={treasuryAmount} />
        </div>

        {/* Welcome Section */}
        <div className="max-w-md mx-auto text-center space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChainBreaker
            </h1>
            <p className="text-muted-foreground">
              Crack the code. Prove your skills on-chain.
            </p>
          </div>

          <Button
            onClick={() => setShowDifficultyModal(true)}
            size="lg"
            className="gradient-primary glow-primary w-full h-14 text-base"
          >
            <Play className="mr-2 h-5 w-5" />
            Start New Game
          </Button>
        </div>

        {/* Recent Activities - Only show when no game is active */}
        <div className="max-w-2xl mx-auto">
          <RecentActivities activities={recentActivities} />
        </div>

        <DifficultyModal
          isOpen={showDifficultyModal}
          onClose={() => setShowDifficultyModal(false)}
          onSelect={startNewGame}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* Treasury Pool */}
      <div className="mb-6">
        <TreasuryPool amount={treasuryAmount} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Game Section */}
        <div className="space-y-4">
          {/* Game Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-3 sm:p-4 rounded-lg bg-card border border-border">
        <div className="text-sm">
          <span className="text-muted-foreground">Tries: </span>
          <span className="font-bold text-primary">
            {gameState.guesses.length}/{gameState.maxAttempts}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-secondary" />
          <span aria-live="polite" className={`font-bold font-mono ${getRemainingTime() < 60 ? 'text-destructive' : 'text-secondary'}`}>
            {formatTime(getRemainingTime())}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Mode: </span>
          <span className="font-bold text-accent capitalize">
            {gameState.difficulty}
          </span>
          </div>
          {/* Reveal secret (dev only or when VITE_SHOW_SECRET=true) */}
          {(import.meta.env.DEV || import.meta.env.VITE_SHOW_SECRET === 'true') && (
            <div className="ml-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-2 py-1 rounded-md border bg-background text-sm"
                onClick={() => setShowSecret((s) => !s)}
                aria-pressed={showSecret}
                aria-label={showSecret ? 'Hide secret code' : 'Reveal secret code'}
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="sr-only">{showSecret ? 'Hide secret' : 'Reveal secret'}</span>
              </button>
            </div>
          )}
          </div>

          {/* Guess History */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">History</h2>
            <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
          {gameState.guesses.map((item, index) => (
            <GuessRow
              key={index}
                guess={item.guess}
                feedback={item.feedback}
                codeLength={gameState.secretCode.length || DIFFICULTY_SETTINGS[gameState.difficulty!].codeLength}
            />
            ))}
            </div>
          </div>

          {/* Active Guess Row */}
          {!gameState.isGameOver && (
            <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Current Guess
          </h2>
              <GuessRow guess={gameState.currentGuess} isActive codeLength={gameState.secretCode.length || DIFFICULTY_SETTINGS[gameState.difficulty!].codeLength} />
              
              
            </div>
          )}

          {showSecret && gameState.secretCode.length > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">Secret code:</span>
              <span className="ml-2 font-mono font-bold">{gameState.secretCode.join(' ')}</span>
            </div>
          )}

          {/* Number Pad */}
          {!gameState.isGameOver && (
            <NumberPad
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              canSubmit={gameState.currentGuess.length === (gameState.secretCode.length || DIFFICULTY_SETTINGS[gameState.difficulty!].codeLength)}
              codeLength={gameState.secretCode.length || DIFFICULTY_SETTINGS[gameState.difficulty!].codeLength}
              currentLength={gameState.currentGuess.length}
            />
          )}

          {/* New Game Button (shown when game is over) */}
          {gameState.isGameOver && (
            <Button
          onClick={handlePlayAgain}
          size="lg"
          className="gradient-primary glow-primary w-full h-14"
        >
              <Play className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          )}

          {/* Modals */}
          <DifficultyModal
            isOpen={showDifficultyModal}
            onClose={() => setShowDifficultyModal(false)}
            onSelect={startNewGame}
          />

          <GameResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            isWon={gameState.isWon}
            attempts={gameState.guesses.length}
            secretCode={gameState.secretCode}
            elapsedTime={gameState.elapsedTime}
            onPlayAgain={handlePlayAgain}
          />
          {/* Screen reader live region for short announcements */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {announce}
          </div>
        </div>
      </div>
    </div>
  );
}
