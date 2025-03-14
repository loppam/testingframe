"use client";

import { useEffect, useRef, useReducer, useCallback } from "react";
import { GameState, GameAction, Obstacle } from "@/lib/game/types";

const INITIAL_STATE: GameState = {
  score: 0,
  highScore: 0,
  isPlaying: false,
  isDead: false,
  speed: 5,
  gravity: 0.6,
  characterY: 0,
  obstacles: [],
  currentCharacter: null,
  currentTheme: null,
};

const GAME_HEIGHT = 400;
const GAME_WIDTH = 800;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 150;
const CHARACTER_SIZE = 60;

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        isPlaying: true,
        isDead: false,
        score: 0,
        characterY: GAME_HEIGHT / 2,
        obstacles: [generateObstacle(GAME_WIDTH)],
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
        characterY: Math.max(0, state.characterY - 60),
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
      return {
        ...state,
        obstacles: updateObstacles(state.obstacles),
      };
    case "RESET_GAME":
      return INITIAL_STATE;
    default:
      return state;
  }
}

function generateObstacle(startX: number): Obstacle {
  return {
    x: startX,
    height: Math.random() * (GAME_HEIGHT - OBSTACLE_GAP) + 50,
    width: OBSTACLE_WIDTH,
    passed: false,
  };
}

function updateObstacles(obstacles: Obstacle[]): Obstacle[] {
  const updatedObstacles = obstacles
    .map((obstacle) => ({
      ...obstacle,
      x: obstacle.x - 5,
    }))
    .filter((obstacle) => obstacle.x + obstacle.width > 0);

  if (
    updatedObstacles.length === 0 ||
    updatedObstacles[updatedObstacles.length - 1].x < GAME_WIDTH - 300
  ) {
    updatedObstacles.push(generateObstacle(GAME_WIDTH));
  }

  return updatedObstacles;
}

export default function Game() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const getCanvasSize = useCallback(() => {
    if (!containerRef.current)
      return { width: GAME_WIDTH, height: GAME_HEIGHT };
    const containerWidth = containerRef.current.clientWidth;
    const scale = Math.min(1, containerWidth / GAME_WIDTH);
    return {
      width: GAME_WIDTH * scale,
      height: GAME_HEIGHT * scale,
      scale,
    };
  }, []);

  const checkCollision = useCallback(() => {
    const characterTop = state.characterY;
    const characterBottom = state.characterY + CHARACTER_SIZE;

    for (const obstacle of state.obstacles) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;

      if (
        obstacleRight > CHARACTER_SIZE &&
        obstacleLeft < CHARACTER_SIZE + CHARACTER_SIZE &&
        (characterTop < obstacle.height ||
          characterBottom > obstacle.height + OBSTACLE_GAP)
      ) {
        return true;
      }
    }
    return false;
  }, [state.characterY, state.obstacles]);

  const gameLoop = useCallback(() => {
    if (!state.isPlaying) return;

    // Update character position (apply gravity)
    let newY = state.characterY + state.gravity * 5;
    newY = Math.min(newY, GAME_HEIGHT - CHARACTER_SIZE); // Keep character in bounds

    // Apply the new Y position
    if (state.characterY !== newY) {
      state.characterY = newY;
    }

    // Update obstacles
    dispatch({ type: "UPDATE_OBSTACLES" });

    // Check for collisions
    if (checkCollision()) {
      dispatch({ type: "END_GAME" });
      return;
    }

    // Update score
    const newScore = Math.floor(
      state.obstacles.filter((o: Obstacle) => o.x < CHARACTER_SIZE && !o.passed)
        .length
    );
    if (newScore > state.score) {
      dispatch({ type: "UPDATE_SCORE", payload: newScore });
    }

    // Request next frame
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [state, checkCollision]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw character
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(
      CHARACTER_SIZE,
      state.characterY,
      CHARACTER_SIZE,
      CHARACTER_SIZE
    );

    // Draw obstacles
    ctx.fillStyle = "#FF5722";
    state.obstacles.forEach((obstacle: Obstacle) => {
      // Top obstacle
      ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.height);
      // Bottom obstacle
      ctx.fillRect(
        obstacle.x,
        obstacle.height + OBSTACLE_GAP,
        obstacle.width,
        GAME_HEIGHT - (obstacle.height + OBSTACLE_GAP)
      );
    });

    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${state.score}`, 10, 30);
    ctx.fillText(`High Score: ${state.highScore}`, 10, 60);

    if (state.isDead) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", GAME_WIDTH / 2, GAME_HEIGHT / 2);
      ctx.font = "24px Arial";
      ctx.fillText(
        "Press Space to play again",
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 40
      );
    } else if (!state.isPlaying) {
      ctx.fillStyle = "#fff";
      ctx.font = "36px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Press Space to start", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
  }, [state]);

  useEffect(() => {
    if (state.isPlaying) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [state.isPlaying, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!state.isPlaying) {
          dispatch({ type: "START_GAME" });
        } else {
          dispatch({ type: "JUMP" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.isPlaying]);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while playing
      if (!state.isPlaying) {
        dispatch({ type: "START_GAME" });
      } else {
        dispatch({ type: "JUMP" });
      }
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handleTouch);
    return () => canvas.removeEventListener("touchstart", handleTouch);
  }, [state.isPlaying]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width, height } = getCanvasSize();
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Keep internal canvas resolution the same for consistent rendering
      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getCanvasSize]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[800px] mx-auto">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border border-gray-700 rounded-lg shadow-lg touch-none"
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => dispatch({ type: "JUMP" })}
          onTouchStart={(e) => {
            e.preventDefault();
            dispatch({ type: "JUMP" });
          }}
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 focus:outline-none active:bg-blue-700 shadow-lg"
        >
          Jump
        </button>
      </div>
    </div>
  );
}
