// Canvas, context
export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

// Images
export const BACKGROUND = new Image()
BACKGROUND.src = '../images/Finalbackground.png';
export const FOREGROUND = new Image()
FOREGROUND.src = '../images/Finalforeground.png';

// Sizing
const WIDTH_HEIGHT_RATIO = 2;
export const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + 20;
    if (canvas.height < canvas.width / WIDTH_HEIGHT_RATIO) canvas.width = canvas.height * WIDTH_HEIGHT_RATIO;
    else canvas.height = canvas.width / WIDTH_HEIGHT_RATIO;
}
resizeCanvas();

export const PLAYER_RADIUS = Math.sqrt(canvas.width*canvas.height*0.0006/Math.PI);
export const BULLET_RADIUS = PLAYER_RADIUS/4;
export const ARROW_LENGTH = PLAYER_RADIUS * 2;
export const ARROW_WIDTH = PLAYER_RADIUS/2;
export const HEALTH_BAR_HEIGHT = PLAYER_RADIUS/2.5;
export const HEALTH_BAR_WIDTH = PLAYER_RADIUS*2.5;
export const STAMINA_BAR_HEIGHT = PLAYER_RADIUS/5;
export const STAMINA_BAR_WIDTH = PLAYER_RADIUS*5/2;
export const INIT_PLAYER_X = canvas.width/10;
export const INIT_PLAYER_Y = canvas.height/2 - PLAYER_RADIUS*2;
export const SPLASH_RADIUS = BULLET_RADIUS * 10;

// Moving
export const MAX_STAMINA = STAMINA_BAR_WIDTH;
export const STAMINA_STEP = MAX_STAMINA/100;
export const PLAYER_SPEED = PLAYER_RADIUS/5;
export const CLIMBING_LIMIT = PLAYER_RADIUS/2;

// Changing Direction  
export const DIRECTION_RIGHT = 0;
export const DIRECTION_LEFT = 1;

// Shooting
export const GRAVITY = PLAYER_RADIUS/40;
export const MAX_FORCE = 50;
export const FORCE_STEP = 0.25;
export const MAX_HEALTH = HEALTH_BAR_WIDTH;
export const DAMAGE = MAX_HEALTH/5;

// Angle
export const MIN_ANGLE = -Math.PI * 5 / 12;
export const MAX_ANGLE = -Math.PI / 12;
export const INITIAL_ANGLE = (MIN_ANGLE + MAX_ANGLE) / 3;
