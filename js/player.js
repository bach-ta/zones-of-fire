import { HEIGHT, WIDTH, PLAYER_RADIUS, PLAYER_SPEED} from './constants.js';
import Game, { canvas, context } from './game.js';

// Player Objects
export default class Player{
    
    constructor(x, y, color, angle = 0){
        this.color = color;
        this.health = 100;
        this.moveSpeed = PLAYER_SPEED;
        
        this.x = x;
        this.y = y;
        this.leftPressed = false;
        this.rightPressed = false;

        this.angle = angle;
        this.upPressed = false;
        this.downPressed = false;

        this.force = 0;
        this.spacePressed = false;
        this.spaceReleased = false;


        //**********************************************************************
        //Event listeners
        //
        document.addEventListener('keydown', (e) => {
            switch (e.keyCode){
                case 32:                              //If pressed spacebar (_)
                    this.spacePressed = true;
                    break;   
                case 37:                              //If pressed left arrow (<)
                    this.leftPressed = true;   
                    break;
                case 38:                              //If pressed up arrow (^)
                    this.upPressed = true;      
                    break;
                case 39:                              //If pressed right arrow (>)
                    this.rightPressed = true;   
                    break;
                case 40:                              //If pressed down arrow (v)
                    this.downPressed = true;      
                    break;
            }
            
        });

        document.addEventListener('keyup', (e) => {
            switch (e.keyCode){
                case 32:                              //If released spacebar (_)
                    this.spacePressed = false;
                    this.spaceReleased = true;
                    break;
                case 37:                              //If released left arrow (<)
                    this.leftPressed = false;
                    break;
                case 38:                              //If released up arrow (^)
                    this.upPressed = false;
                    break;
                case 39:                              //If released right arrow (>)
                    this.rightPressed = false;
                    break;
                case 40:                              //If released down arrow (v)
                    this.downPressed = false;
                    break;
            }
        });
    }

    //**********************************************************************
    //Player methods
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
        if (this.leftPressed){
            this.x -= this.moveSpeed;
        }
        if (this.rightPressed){
            this.x += this.moveSpeed;
        }
    }

    //Change angle (reverse sign since x,y axis are upside down)
    changeAngle = () => { 
        if (this.upPressed){
            this.angle -= Math.PI/180;
        }
        if (this.downPressed){
            this.angle += Math.PI/180;
        }
        console.log(`Angle: ${this.angle}`);
    }
    
    //Niệm chiêu. Max = 100
    changeForce = () => {
        if (this.spacePressed && this.force < 100){
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
