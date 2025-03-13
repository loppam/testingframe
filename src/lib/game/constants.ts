export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GROUND_HEIGHT: 50,
  MIN_OBSTACLE_SPACING: 200,
  MAX_OBSTACLE_SPACING: 400,
  INITIAL_GAME_SPEED: 5,
  MAX_GAME_SPEED: 15,
  SPEED_INCREMENT: 0.001,
  GRAVITY: 0.5,
  JUMP_FORCE: -10,
};

export const DEFAULT_CHARACTER = {
  id: 0,
  tokenId: "0",
  name: "Default Dino",
  jumpHeight: 15,
  size: {
    width: 60,
    height: 60,
  },
  sprite: "/sprites/default-dino.png",
};

export const DEFAULT_THEME = {
  id: 0,
  tokenId: "0",
  name: "Default Theme",
  background: "/themes/default-background.png",
  obstacleSprite: "/themes/default-obstacle.png",
  groundSprite: "/themes/default-ground.png",
  colorScheme: {
    primary: "#000000",
    secondary: "#4A4A4A",
    accent: "#858585",
  },
};
