// Minh Em

// Player Objects
class Player{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.health = 100;
        this.angle = 0;
        this.force = 20;
    }
    fire(){
        
    }
    changeAngle(){

    }
}

//Initialize player positions
function initPosition(map){
    let x = Math.floor(Math.random()*(WIDTH/2 + 1))     //Only randomize on half of the width
    let y = map[x];
    return [x,y];
}

//Create players
function createPlayer(map){
    let [x, y] = initPostition(map);
    const Player1 = new Player(x,y);
    const Player2 = new Player(WIDTH-x,y);
    //Display players on map
}
