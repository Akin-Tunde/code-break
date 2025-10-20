// src/hooks/useGameLogic.ts

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner"; // Use sonner for a better toast experience

// Define types and constants in one place
type Difficulty = "easy" | "normal" | "hard" | "expert";
const DIFFICULTY_SETTINGS = {
  easy: { maxAttempts: 8, allowDuplicates: true, timeLimit: 600, codeLength: 4 },
  normal: { maxAttempts: 6, allowDuplicates: true, timeLimit: 480, codeLength: 4 },
  hard: { maxAttempts: 6, allowDuplicates: false, timeLimit: 360, codeLength: 5 },
  expert: { maxAttempts: 5, allowDuplicates: false, timeLimit: 240, codeLength: 5 },
};

// ... (Keep the GameState interface here)

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({ /* initial state */ });
  // ... all other state variables like [showResultModal, setAnnounce] etc.

  // --- Move All Logic Functions Here ---
  
  const generateSecretCode = useCallback((allowDuplicates: boolean, codeLength: number): number[] => {
    // ... logic remains the same
  }, []);
  
  const startNewGame = useCallback((difficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    setGameState({
      secretCode: generateSecretCode(settings.allowDuplicates, settings.codeLength),
      // ... rest of the new game state
    });
    // setShowDifficultyModal(false) would be handled in the component
  }, [generateSecretCode]);

  const calculateFeedback = useCallback((guess: number[], secret: number[]) => {
    // ... logic remains the same
  }, []);

  const addGuessDigit = useCallback((num: number) => {
    // ... logic from handleNumberClick
  }, [/* dependencies */]);

  const deleteGuessDigit = useCallback(() => {
    // ... logic from handleDelete
  }, []);

  const submitGuess = useCallback(() => {
    // ... logic from handleSubmit
  }, [/* dependencies */]);

  // --- Move All useEffect Hooks Here ---
  useEffect(() => {
    // Countdown timer effect
  }, [gameState.startTime, gameState.isGameOver]);

  // Return the state and the actions the UI can perform
  return {
    gameState,
    difficultySettings: DIFFICULTY_SETTINGS,
    startNewGame,
    addGuessDigit,
    deleteGuessDigit,
    submitGuess,
    // also return modal states and their setters
    // showDifficultyModal, setShowDifficultyModal, etc.
  };
};
