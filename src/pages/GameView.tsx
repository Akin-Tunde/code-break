import { useState, useEffect } from "react";
import { GuessRow } from "@/components/game/GuessRow";
import { NumberPad } from "@/components/game/NumberPad";
import { Button } from "@/components/ui/button";
import { DifficultyModal } from "@/components/modals/DifficultyModal";
import { GameResultModal } from "@/components/modals/GameResultModal";
import { TreasuryPool } from "@/components/game/TreasuryPool";
import { RecentActivities } from "@/components/game/RecentActivities";
import { Play, Clock } from "lucide-react";

type Difficulty = "easy" | "normal" | "hard" | "expert";

interface GameState {
  secretCode: number[];
  guesses: { guess: number[]; feedback: { correct: number; partial: number } }[];
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
  easy: { maxAttempts: 12, allowDuplicates: true, timeLimit: 600 }, // 10 minutes
  normal: { maxAttempts: 10, allowDuplicates: true, timeLimit: 480 }, // 8 minutes
  hard: { maxAttempts: 8, allowDuplicates: false, timeLimit: 360 }, // 6 minutes
  expert: { maxAttempts: 6, allowDuplicates: false, timeLimit: 240 }, // 4 minutes
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

  const generateSecretCode = (allowDuplicates: boolean): number[] => {
    const code: number[] = [];
    while (code.length < 4) {
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
      secretCode: generateSecretCode(settings.allowDuplicates),
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

  const calculateFeedback = (guess: number[], secret: number[]) => {
    let correct = 0;
    let partial = 0;
    const secretCopy = [...secret];
    const guessCopy = [...guess];

    // First pass: count correct positions
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        correct++;
        secretCopy[i] = -1;
        guessCopy[i] = -2;
      }
    }

    // Second pass: count correct numbers in wrong positions
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== -2) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          partial++;
          secretCopy[index] = -1;
        }
      }
    }

    return { correct, partial };
  };

  const handleNumberClick = (num: number) => {
    if (gameState.currentGuess.length < 4 && !gameState.isGameOver) {
      setGameState({
        ...gameState,
        currentGuess: [...gameState.currentGuess, num],
      });
    }
  };

  const handleDelete = () => {
    if (gameState.currentGuess.length > 0) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1),
      });
    }
  };

  const handleSubmit = () => {
    if (gameState.currentGuess.length === 4) {
      const feedback = calculateFeedback(gameState.currentGuess, gameState.secretCode);
      const newGuesses = [
        ...gameState.guesses,
        { guess: gameState.currentGuess, feedback },
      ];
      const isWon = feedback.correct === 4;
      const newAttemptsLeft = gameState.attemptsLeft - 1;
      const isGameOver = isWon || newAttemptsLeft === 0;

      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: [],
        attemptsLeft: newAttemptsLeft,
        isGameOver,
        isWon,
      });

      if (isGameOver) {
        setTimeout(() => setShowResultModal(true), 500);
      }
    }
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setShowDifficultyModal(true);
  };

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
          <span className={`font-bold font-mono ${getRemainingTime() < 60 ? 'text-destructive' : 'text-secondary'}`}>
            {formatTime(getRemainingTime())}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Mode: </span>
          <span className="font-bold text-accent capitalize">
            {gameState.difficulty}
          </span>
          </div>
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
              <GuessRow guess={gameState.currentGuess} isActive />
            </div>
          )}

          {/* Number Pad */}
          {!gameState.isGameOver && (
            <NumberPad
          onNumberClick={handleNumberClick}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
              canSubmit={gameState.currentGuess.length === 4}
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
        </div>
      </div>
    </div>
  );
}
