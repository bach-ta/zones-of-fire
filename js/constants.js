// Sizing
export const WIDTH = 1500;
export const HEIGHT = 960;
export const PLAYER_RADIUS = 20;
export const BULLET_RADIUS = 5;
export const ARROW_LENGTH = PLAYER_RADIUS * 2;
export const ARROW_WIDTH = 10;
export const HEALTH_BAR_HEIGHT = 10;
export const HEALTH_BAR_WIDTH = 50;
export const STAMINA_BAR_HEIGHT = 10;
export const STAMINA_BAR_WIDTH = 50;
export const INIT_PLAYER_X = 200;
export const INIT_PLAYER_Y = HEIGHT/3*2 - PLAYER_RADIUS*2;
export const SPLASH_RADIUS = BULLET_RADIUS * 10;

// Moving
export const MAX_STAMINA = STAMINA_BAR_WIDTH;
export const STAMINA_STEP = 0.5;
export const PLAYER_SPEED = 3;
export const CLIMBING_LIMIT = PLAYER_RADIUS/2;

// Changing Direction  
export const DIRECTION_RIGHT = 0;
export const DIRECTION_LEFT = 1;

// Shooting
export const GRAVITY = 0.6;
export const FORCE_STEP = 0.5;
export const MAX_HEALTH = HEALTH_BAR_WIDTH;
export const DAMAGE = 25;

// Angle
export const MIN_ANGLE = -Math.PI * 5 / 12;
export const MAX_ANGLE = -Math.PI / 12;
export const INITIAL_ANGLE = (MIN_ANGLE + MAX_ANGLE) / 3;
