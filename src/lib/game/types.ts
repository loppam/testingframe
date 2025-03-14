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
  background: string; // maps to backgroundURI
  obstacleSprite: string; // maps to obstacleURI
  groundSprite: string; // optional, not in contract
  colorScheme: {
    // optional, not in contract
    primary: string;
    secondary: string;
    accent: string;
  };
  obstacleWidth?: number; // from contract
  obstacleHeight?: number; // from contract
  obstacleGap?: number; // from contract
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
  currentCharacter: any | null;
  currentTheme: any | null;
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
  | { type: "SET_CHARACTER"; payload: any }
  | { type: "SET_THEME"; payload: any }
  | { type: "UPDATE_OBSTACLES" }
  | { type: "RESET_GAME" };
