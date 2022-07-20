import { WIDTH, RADIUS } from './constants.js';
import { canvas, context } from './game.js'

// Player Objects
export default class Player{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.health = 100;
        this.angle = 0;
        this.force = 20;
    }

    //Add player methods

    // Display player
    displayPlayer = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, RADIUS, 0, Math.PI*2);
        context.fill();
    }
    /*
    fire() { 
    }
    move() {
    }*/
    changeAngle() {
        
        let leftPressed = false;

        document.body.addEventListener('keydown', keyPressed);
        document.body.addEventListener('keyup', keyReleased)

        function keyPressed(event){
            if (event.keyCode === 37){                  //If pressed left arrow
                leftPressed = true;
            }
        }
        function keyReleased(event){
            if (event.keyCode === 37){                  //If released left arrow
                leftPressed = false;
            }
        }
    }
}

// Initialize player positions
export const initPositions = (terrain) => {
    let x1 = 100; //Math.floor(Math.random()*(WIDTH/2 + 1))     //Randomize on half the width
    let y1 = terrain.height/3*2 - RADIUS;
    let x2 = WIDTH-x1;
    let y2 = terrain.height/3*2 - RADIUS;

    return [x1, y1, x2, y2];
}
