// Minh Em

// Player Objects
class Player{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.health = 100;
        this.fire = fire();                 
        this.move = move();
    }
}

//Initialize players
function initPlayer(map){
    let x, y = initPostition(map);          //Find the x,y position of player on the generated map object
    const Player1 = new Player(x,y);
    const Player2 = new Player(WIDTH-x,y);
    displayPlayer(Player1);                 //displayPlayer on the map, at position x,y
    displayPlayer(Player2);
}

//Initialize player positions
function initPosition(map);

//DisplayPlayer on map
function displayPlayer(Player){
    
}