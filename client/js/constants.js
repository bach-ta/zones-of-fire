// Canvas, context
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

// Images
const BACKGROUND = new Image()
BACKGROUND.src = '../img/Finalbackground.png';
const FOREGROUND = new Image()
FOREGROUND.src = '../img/Finalforeground.png';

// Sizing
const WIDTH_HEIGHT_RATIO = 2;
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + 20;
    if (canvas.height < canvas.width / WIDTH_HEIGHT_RATIO) canvas.width = canvas.height * WIDTH_HEIGHT_RATIO;
    else canvas.height = canvas.width / WIDTH_HEIGHT_RATIO;
}
resizeCanvas();

const PLAYER_RADIUS = Math.sqrt(canvas.width*canvas.height*0.0006/Math.PI);
const BULLET_RADIUS = PLAYER_RADIUS/4;
const ARROW_LENGTH = PLAYER_RADIUS * 2;
const ARROW_WIDTH = PLAYER_RADIUS/2;
const HEALTH_BAR_HEIGHT = PLAYER_RADIUS/2.5;
const HEALTH_BAR_WIDTH = PLAYER_RADIUS*2.5;
const STAMINA_BAR_HEIGHT = PLAYER_RADIUS/5;
const STAMINA_BAR_WIDTH = PLAYER_RADIUS*5/2;
const INIT_PLAYER_X = canvas.width/10;
const INIT_PLAYER_Y = canvas.height/2 - PLAYER_RADIUS*2;
const SPLASH_RADIUS = BULLET_RADIUS * 10;

// Moving
const MAX_STAMINA = STAMINA_BAR_WIDTH;
const STAMINA_STEP = MAX_STAMINA/100;
const PLAYER_SPEED = PLAYER_RADIUS/5;
const CLIMBING_LIMIT = PLAYER_RADIUS/2;

// Changing Direction  
const DIRECTION_RIGHT = 0;
const DIRECTION_LEFT = 1;

// Shooting
const GRAVITY = PLAYER_RADIUS/40;
const MAX_FORCE = 50;
const FORCE_STEP = 0.25;
const MAX_HEALTH = HEALTH_BAR_WIDTH;
const DAMAGE = MAX_HEALTH/5;

// Angle
const MIN_ANGLE = -Math.PI * 5 / 12;
const MAX_ANGLE = -Math.PI / 12;
const INITIAL_ANGLE = (MIN_ANGLE + MAX_ANGLE) / 3;

module.exports = { canvas, context, BACKGROUND, FOREGROUND, PLAYER_RADIUS, BULLET_RADIUS, ARROW_LENGTH, ARROW_WIDTH, HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, STAMINA_BAR_HEIGHT, STAMINA_BAR_WIDTH, INIT_PLAYER_X, INIT_PLAYER_Y, SPLASH_RADIUS, MAX_STAMINA, STAMINA_STEP, PLAYER_SPEED, CLIMBING_LIMIT, DIRECTION_RIGHT, DIRECTION_LEFT, GRAVITY, MAX_FORCE, FORCE_STEP, DAMAGE, INITIAL_ANGLE }
