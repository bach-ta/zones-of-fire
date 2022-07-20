// Minh Em
import { WIDTH, RADIUS } from './constants.js';
import { canvas, context } from './game.js'

// Player Objects
export class Player{
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

//Initialize player positions
const initPositions = (terrain) => {
    let x1 = 100; //Math.floor(Math.random()*(WIDTH/2 + 1))     //Randomize on half the width
    let y1 = terrain.height/3*2;
    let x2 = WIDTH-x1;
    let y2 = terrain.height/3*2;

    return [x1, y1, x2, y2];
}

//Create players
export default function createPlayers(map){
    let [x1, y1, x2, y2] = initPositions(map);
    const player1 = new Player(x1,y1);
    const player2 = new Player(x2,y2);
    
    //Display player1 on map
    context.fillStyle = "red";
    context.beginPath();
    context.arc(player1.x, player1.y, RADIUS, 0, Math.PI*2)
    context.fill()

    //Display player2 on map
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(player2.x, player2.y, RADIUS, 0, Math.PI*2);
    context.fill();

    return [player1, player2];
}