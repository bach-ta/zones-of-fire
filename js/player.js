// Minh Em
import { WIDTH, RADIUS } from './constants.js';

// Player Objects
export default class Player{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.health = 100;
        this.angle = 0;
        this.force = 20;
    }

    //Add player methods

    /*
    fire(){ 
    }
    changeAngle(){
    }
    move(){
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
