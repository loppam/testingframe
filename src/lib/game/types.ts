export interface Character {
  id: number;
  tokenId: string;
  name: string;
  jumpHeight: number;
  size: {
    width: number;
    height: number;
  };
  sprite: string; // URL to the character sprite
}

export interface Theme {
  id: number;
  tokenId: string;
  name: string;
  background: string;
  obstacleSprite: string;
  groundSprite: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface GameState {
  score: number;
  highScore: number;
  isPlaying: boolean;
  isDead: boolean;
  speed: number;
  gravity: number;
  characterY: number;
  obstacles: Obstacle[];
  currentCharacter: Character | null;
  currentTheme: Theme | null;
}

export interface Obstacle {
  x: number;
  height: number;
  width: number;
  passed: boolean;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "JUMP" }
  | { type: "UPDATE_SCORE"; payload: number }
  | { type: "SET_CHARACTER"; payload: Character }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "UPDATE_OBSTACLES" }
  | { type: "RESET_GAME" };
