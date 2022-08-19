import { Arrow } from './supplementaries.js';
import { canvas, context, MAX_STAMINA, PLAYER_RADIUS, PLAYER_SPEED, DIRECTION_RIGHT, DIRECTION_LEFT, FORCE_STEP, MAX_HEALTH, MIN_ANGLE, MAX_ANGLE, INIT_PLAYER_X, INIT_PLAYER_Y, STAMINA_STEP, MAX_FORCE } from './constants.js';

// Player Objects
export default class Player{
    
    constructor(x, y, color, angle, direction){
        // Attributes
        this.color = color;
        this.moveSpeed = PLAYER_SPEED;
        // Movements & locations
        this.x = x;
        this.y = y;
        this.leftPressed = false;
        this.rightPressed = false;
        this.allowMoveLeft = true;
        this.allowMoveRight = true;
        // Flying
        this.fPressed = false;
        this.allowF = true;
        this.checkF = 0;
        // Arrow
        this.arrow = new Arrow(angle, color);
        this.direction = direction;
        this.upPressed = false;
        this.downPressed = false;
        // Force
        this.force = 0;
        this.lastForce = 0;
        this.spacePressed = false;
        this.spaceReleased = false;
        this.forceIncrease = true;
        this.allowForce = true;
        // Health
        this.health = MAX_HEALTH;
        // Stamina
        this.stamina = MAX_STAMINA;
    }

    // Getter
    get getX() { return this.x; }
    get getY() { return this.y; }
    // Setter
    set setX(x) { this.x = x; }
    set setY(y) { this.y = y; }

    //**********************************************************************
    // Player methods
    //**********************************************************************

    // Draw player
    drawPlayer = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, PLAYER_RADIUS, 0, Math.PI*2);
        context.fill();
    }
    
    // Move Player 
    // TODO: Player move with terrain boundaries
    move = () => {
        if (this.changeDirection()) return;
        if (this.stamina > 0) {
            if (this.leftPressed && this.allowMoveLeft) {
                this.x -= this.moveSpeed;
                this.allowMoveRight = true;
                this.stamina -= STAMINA_STEP;
            } else if (this.rightPressed && this.allowMoveRight) {
                this.x += this.moveSpeed;
                this.allowMoveLeft = true;
                this.stamina -= STAMINA_STEP;
            }
        }
    }

    changeDirection = () => {
        let changed = false;
        if (this.leftPressed) {
            if (this.direction === DIRECTION_RIGHT) this.arrow.angle = Math.PI - this.arrow.angle, changed = true;
            this.direction = DIRECTION_LEFT;
        } else {
            if (this.direction === DIRECTION_LEFT) this.arrow.angle = Math.PI - this.arrow.angle, changed = true;
            this.direction = DIRECTION_RIGHT;
        }
        return changed;
    }

    // Change angle
    changeAngle = () => {
        let newAngle = 0;
        if (this.upPressed) newAngle = this.arrow.angle + (Math.PI/90) * (2 * this.direction - 1);
        else                newAngle = this.arrow.angle - (Math.PI/90) * (2 * this.direction - 1);

        if (this.checkAngleRange(newAngle)) this.arrow.angle = newAngle;
    }

    checkAngleRange(angle) {
        return      (this.direction === DIRECTION_RIGHT && angle >= MIN_ANGLE && angle <= MAX_ANGLE)
                    ||
                    (Math.PI - angle >= MIN_ANGLE && Math.PI - angle <= MAX_ANGLE);
    }
    
    changeForce = () => {
        if (this.force >= MAX_FORCE){
            this.forceIncrease = false;
        }
        if (this.force <= 0){
            this.forceIncrease = true;
        }
        if (this.forceIncrease){
            this.force += FORCE_STEP;
        }
        else{
            this.force -= FORCE_STEP;
        }
        document.querySelector('#force-bar').style.width = this.force + "%";
    }
    
    // Fire bullet
    fire = () => {
        // Ban movement after firing
        this.allowMoveLeft = false;
        this.allowMoveRight = false;
        this.allowForce = false;
        this.allowF = false;
        this.lastForce = this.force;
    }
}

// Initialize player positions
export const initPositions = () => {
    let x1 = INIT_PLAYER_X;
    let y1 = INIT_PLAYER_Y;
    let x2 = canvas.width-INIT_PLAYER_X;
    let y2 = INIT_PLAYER_Y;

    return [x1, y1, x2, y2];
}
