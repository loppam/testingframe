import { useReducer } from "react";
import { GameState, GameAction, Obstacle } from "./types";

const initialState: GameState = {
  score: 0,
  highScore: 0,
  isPlaying: false,
  isDead: false,
  speed: 5,
  gravity: 0.5,
  characterY: 0,
  obstacles: [],
  currentCharacter: null,
  currentTheme: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        isPlaying: true,
        isDead: false,
        score: 0,
        obstacles: [],
        characterY: 0,
      };

    case "END_GAME":
      return {
        ...state,
        isPlaying: false,
        isDead: true,
        highScore: Math.max(state.score, state.highScore),
      };

    case "JUMP":
      return {
        ...state,
        characterY:
          state.characterY - (state.currentCharacter?.jumpHeight || 10),
      };

    case "UPDATE_SCORE":
      return {
        ...state,
        score: action.payload,
      };

    case "SET_CHARACTER":
      return {
        ...state,
        currentCharacter: action.payload,
      };

    case "SET_THEME":
      return {
        ...state,
        currentTheme: action.payload,
      };

    case "UPDATE_OBSTACLES":
      // Remove obstacles that are off screen and generate new ones
      const filteredObstacles = state.obstacles.filter(
        (obstacle) => obstacle.x > -obstacle.width
      );

      // Add new obstacle if needed
      if (filteredObstacles.length < 3) {
        const lastObstacle = filteredObstacles[filteredObstacles.length - 1];
        const newObstacle: Obstacle = {
          x: lastObstacle ? lastObstacle.x + 300 : 800,
          height: Math.random() * 100 + 50,
          width: 50,
          passed: false,
        };
        filteredObstacles.push(newObstacle);
      }

      // Update obstacle positions
      const updatedObstacles = filteredObstacles.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - state.speed,
      }));

      return {
        ...state,
        obstacles: updatedObstacles,
      };

    case "RESET_GAME":
      return {
        ...initialState,
        highScore: state.highScore,
        currentCharacter: state.currentCharacter,
        currentTheme: state.currentTheme,
      };

    default:
      return state;
  }
}

export function useGameState() {
  return useReducer(gameReducer, initialState);
}
