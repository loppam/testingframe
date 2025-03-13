import React, { useEffect, useCallback } from "react";
import { Character } from "./Character";
import { Theme } from "./Theme";
import { ObstacleGroup } from "./Obstacle";
import { useGameState } from "~/lib/game/state";
import {
  GAME_CONFIG,
  DEFAULT_CHARACTER,
  DEFAULT_THEME,
} from "~/lib/game/constants";

export function GameEngine() {
  const [state, dispatch] = useGameState();

  // Initialize game with default character and theme
  useEffect(() => {
    dispatch({ type: "SET_CHARACTER", payload: DEFAULT_CHARACTER });
    dispatch({ type: "SET_THEME", payload: DEFAULT_THEME });
  }, [dispatch]);

  // Game loop
  useEffect(() => {
    if (!state.isPlaying) return;

    const gameLoop = setInterval(() => {
      // Update obstacles
      dispatch({ type: "UPDATE_OBSTACLES" });

      // Apply gravity
      if (
        state.characterY <
        GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT
      ) {
        dispatch({
          type: "UPDATE_SCORE",
          payload: state.score + 1,
        });
      }

      // Check collisions
      state.obstacles.forEach((obstacle) => {
        if (
          !obstacle.passed &&
          state.currentCharacter &&
          state.characterY + state.currentCharacter.size.height >
            GAME_CONFIG.CANVAS_HEIGHT -
              GAME_CONFIG.GROUND_HEIGHT -
              obstacle.height &&
          obstacle.x < state.currentCharacter.size.width &&
          obstacle.x + obstacle.width > 0
        ) {
          dispatch({ type: "END_GAME" });
        }
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [state, dispatch]);

  // Handle jump
  const handleJump = useCallback(() => {
    if (state.isPlaying) {
      dispatch({ type: "JUMP" });
    } else {
      dispatch({ type: "START_GAME" });
    }
  }, [state.isPlaying, dispatch]);

  // Handle key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleJump]);

  return (
    <div
      className="game-container relative overflow-hidden"
      style={{
        width: GAME_CONFIG.CANVAS_WIDTH,
        height: GAME_CONFIG.CANVAS_HEIGHT,
      }}
      onClick={handleJump}
    >
      {state.currentTheme && <Theme theme={state.currentTheme} />}

      {state.currentCharacter && (
        <Character
          character={state.currentCharacter}
          y={state.characterY}
          isJumping={state.characterY < 0}
        />
      )}

      {state.currentTheme && (
        <ObstacleGroup
          obstacles={state.obstacles}
          theme={state.currentTheme.obstacleSprite}
        />
      )}

      {/* Score Display */}
      <div className="absolute top-4 right-4 text-2xl font-bold">
        Score: {state.score}
      </div>

      {/* Game Over Screen */}
      {state.isDead && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
          <p className="text-2xl text-white mb-4">Score: {state.score}</p>
          <p className="text-xl text-white mb-8">
            High Score: {state.highScore}
          </p>
          <button
            className="px-6 py-3 bg-white text-black rounded-lg font-bold"
            onClick={() => dispatch({ type: "RESET_GAME" })}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Start Screen */}
      {!state.isPlaying && !state.isDead && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h2 className="text-4xl font-bold text-white mb-8">
            Press Space or Tap to Start
          </h2>
        </div>
      )}
    </div>
  );
}
