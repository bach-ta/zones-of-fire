import { WIDTH, RADIUS } from './constants.js';
import { canvas, context } from './game.js';

// Player Objects
export default class Player{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.health = 100;
        this.angle = 0;
        this.leftPressed = false;
        this.rightPressed = false;
        this.force = 20;
    }

    //Add player methods

    // Draw player
    drawPlayer = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, RADIUS, 0, Math.PI*2);
        context.fill();
    }
    
    //Change shooting angle
    changeAngle = () => { 
        if (this.leftPressed){
            this.angle += 1;
        }
        if (this.rightPressed){
            this.angle -= 1;
        }
        //console.log(this.angle);
    }
    
    /*
    fire() { 
    }
    move() {
    }*/
}

// Initialize player positions
export const initPositions = (terrain) => {
    let x1 = 100; //Math.floor(Math.random()*(WIDTH/2 + 1))     //Randomize on half the width
    let y1 = terrain.height/3*2 - RADIUS;
    let x2 = WIDTH-x1;
    let y2 = terrain.height/3*2 - RADIUS;

    return [x1, y1, x2, y2];
}
