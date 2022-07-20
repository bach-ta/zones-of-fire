// Minh Em

const WIDTH = 500;
const radius = 10;
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
//Take terrain from terrain.js

// Player Objects
class Player{
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
function initPositions(terrain){
    /*let x1 = Math.floor(Math.random()*(WIDTH/2 + 1))     //Randomize on half the width
    let y1 = terrain[x1];
    let x2 = WIDTH-x1;
    let y2 = terrain[x2]
    */
    let x1 = 100;                                           //Temporary x and y
    let y1 = 250;
    let x2 = WIDTH-x1;
    let y2 = 200;
    return [x1, y1, x2, y2];
}

//Create players
function createPlayers(map){
    let [x1, y1, x2, y2] = initPositions(map);
    const Player1 = new Player(x1,y1);
    const Player2 = new Player(x2,y2);
    
    //Display player1 on map
    ctx.fillstyle = "red";
    ctx.beginPath();
    ctx.arc(Player1.x, Player1.y, radius, 0, Math.PI*2)
    ctx.fill()

    //Display player2 on map
    ctx.fillstyle = "blue";
    ctx.beginPath();
    ctx.arc(Player2.x, Player2.y, radius, 0, Math.PI*2);
    ctx.fill()
}

createPlayers();