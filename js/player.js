import { WIDTH, PLAYER_RADIUS } from './constants.js';
import { canvas, context } from './game.js';

// Player Objects
export default class Player{
    constructor(x, y, color){
        this.color = color;
        this.health = 100;
        this.moveSpeed = 5;
        
        this.x = x;
        this.y = y;
        this.leftPressed = false;
        this.rightPressed = false;

        this.angle = 0;
        this.upPressed = false;
        this.downPressed = false;

        this.force = 0;
        this.spacePressed = false;
        this.spaceReleased = false;
    }

    //Add player methods

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
        if (this.leftPressed){
            this.x -= this.moveSpeed;
        }
        if (this.rightPressed){
            this.x += this.moveSpeed;
        }
    }

    //Change angle
    changeAngle = () => { 
        if (this.upPressed){
            this.angle += 1;
        }
        if (this.downPressed){
            this.angle -= 1;
        }
        console.log(`Angle: ${this.angle}`);
    }
    
    //Niệm chiêu
    changeForce = () => {
        if (this.spacePressed){
            this.force += 1;
        }
        console.log(`Force: ${this.force}`);
    }
    
    //Fire bullet
    fire = () => {
        console.log("fire");
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
