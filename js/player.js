import { HEIGHT, WIDTH, MAX_MOVEMENT_ALLOWED, PLAYER_RADIUS, PLAYER_SPEED, DIRECTION_RIGHT, DIRECTION_LEFT, FORCE_STEP, MAX_HEALTH, MIN_ANGLE, MAX_ANGLE } from './constants.js';
import { context } from './game.js';

// Player Objects
export default class Player{
    
    constructor(x, y, color, angle = 0, direction){
        this.color = color;
        this.health = MAX_HEALTH;
        this.moveSpeed = PLAYER_SPEED;
        
        this.x = x;
        this.y = y;
        this.moveCount = 0;
        this.leftPressed = false;
        this.rightPressed = false;

        this.angle = angle;
        this.upPressed = false;
        this.downPressed = false;

        this.force = 0;
        this.spacePressed = false;
        this.spaceReleased = false;

        this.direction = direction;
    }

    // Getter
    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    // Setter
    set setX(x) {
        this.x = x;
    }

    set setY(y) {
        this.y = y;
    }

    //**********************************************************************
    // Player methods
    //

    // Draw player
    drawPlayer = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, PLAYER_RADIUS, 0, Math.PI*2);
        context.fill();
    }
    
    //Move Player 
    //!!!!!!!!!!!!!!Not yet able to move with terrain
    move = () => {
        if (this.changeDirection()) return;
        if (this.moveCount < MAX_MOVEMENT_ALLOWED) {
            if (this.leftPressed) {
                this.x -= this.moveSpeed;
                this.moveCount += 1;
            } else {
                this.x += this.moveSpeed;
                this.moveCount += 1;
            }
        }
    }

    changeDirection = () => {
        let changed = false;
        if (this.leftPressed) {
            if (this.direction === DIRECTION_RIGHT) this.angle = Math.PI - this.angle, changed = true;
            this.direction = DIRECTION_LEFT;
        } else {
            if (this.direction === DIRECTION_LEFT) this.angle = Math.PI - this.angle, changed = true;
            this.direction = DIRECTION_RIGHT;
        }
        return changed;
    }

    //Change angle
    changeAngle = () => {
        let newAngle = 0;
        if (this.upPressed) newAngle = this.angle + (Math.PI/90) * (2 * this.direction - 1);
        else                newAngle = this.angle - (Math.PI/90) * (2 * this.direction - 1);

        if (this.checkAngleRange(newAngle)) this.angle = newAngle;
    }

    checkAngleRange(angle) {
        return      (this.direction === DIRECTION_RIGHT && angle >= MIN_ANGLE && angle <= MAX_ANGLE)
                    ||
                    (Math.PI - angle >= MIN_ANGLE && Math.PI - angle <= MAX_ANGLE);
    }
    
    //Niệm chiêu. Max = 100
    changeForce = () => {
        if (this.force < 100){
            this.force += FORCE_STEP;
        }
        document.querySelector('#show-force').textContent = this.force;
    }
    
    //Fire bullet
    fire = () => {
        //Ban movement after firing
        this.moveCount = MAX_MOVEMENT_ALLOWED;
    }

}

// Initialize player positions
export const initPositions = (terrain) => {
    let x1 = 100;
    let y1 = terrain.height/3*2 - PLAYER_RADIUS;
    let x2 = WIDTH-x1;
    let y2 = terrain.height/3*2 - PLAYER_RADIUS;

    return [x1, y1, x2, y2];
}
