// Sizing
export const WIDTH = 1500;
export const HEIGHT = 900;
export const PLAYER_RADIUS = 20;
export const BULLET_RADIUS = 5;
export const ARROW_LENGTH = PLAYER_RADIUS * 2;
export const ARROW_WIDTH = 10;
export const HEALTH_BAR_HEIGHT = 10;
export const HEALTH_BAR_WIDTH = 50;

// Moving
export const MAX_MOVEMENT_ALLOWED = 50;
export const PLAYER_SPEED = 5;

// Changing Direction
export const DIRECTION_RIGHT = 0;
export const DIRECTION_LEFT = 1;

// Shooting
export const GRAVITY = 0.6;
export const FORCE_STEP = 1;
export const MAX_HEALTH = 50;
export const DAMAGE = 10;

// Angle
export const MIN_ANGLE = -Math.PI * 5 / 12;
export const MAX_ANGLE = -Math.PI / 12;
export const INITIAL_ANGLE = (MIN_ANGLE + MAX_ANGLE) / 3;