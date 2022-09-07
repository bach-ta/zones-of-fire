import { INIT_PLAYER_X, INIT_PLAYER_Y, INITIAL_ANGLE, DIRECTION_RIGHT, MAX_STAMINA } from './constants.js';
import Game from './game.js';

// **********************************************************************
// Event listeners
// **********************************************************************

const handleKeyDown = (e, game) => {
    switch (e.keyCode){
        case 32:                              // If pressed spacebar (_)
            game.players[game.turn].spacePressed = true;
            break;   
        case 37:                              // If pressed left arrow (<)
        case 65:                              // If pressed A
            game.players[game.turn].leftPressed = true;
            console.log(game.players[game.turn])
            break;
        case 38:                              // If pressed up arrow (^)
        case 87:                              // If pressed W
            game.players[game.turn].upPressed = true;      
            break;
        case 39:                              // If pressed right arrow (>)
        case 68:                              // If pressed D
            game.players[game.turn].rightPressed = true;   
            break;
        case 40:                              // If pressed down arrow (v)
        case 83:                              // If pressed S
            game.players[game.turn].downPressed = true;      
            break;
        case 70:                              // If pressed  F
            if (game.players[game.turn].allowF && game.players[game.turn].stamina >= MAX_STAMINA/2 && !game.players[game.turn].checkF){
                game.players[game.turn].fPressed = true;
                game.players[game.turn].stamina -= MAX_STAMINA/2;
                document.getElementById('flying-icon').style.display='block';
                game.players[game.turn].checkF++;
            }
            else if (game.players[game.turn].stamina < MAX_STAMINA/2 && !game.players[game.turn].checkF) 
                document.getElementById('no-flying-icon').style.display='block';
            break;
        }
}

const handleKeyUp = (e, game) => {
    switch (e.keyCode){
        case 32:                              // If released spacebar (_)
            game.players[game.turn].spacePressed = false;
            game.players[game.turn].spaceReleased = true;
            break;
        case 37:                              // If released left arrow (<)
        case 65:                              // If released A
            game.players[game.turn].leftPressed = false;
            break;
        case 38:                              // If released up arrow (^)
        case 87:                              // If released W
            game.players[game.turn].upPressed = false;
            break;
        case 39:                              // If released right arrow (>)
        case 68:                              // If released D
            game.players[game.turn].rightPressed = false;
            break;
        case 40:                              // If released down arrow (v)
        case 83:                              // If released S
            game.players[game.turn].downPressed = false;
            break;
        }
}

const enableEventListener = (game) => {
    document.addEventListener('keydown', (e) => {handleKeyDown(e, game)});
    document.addEventListener('keyup', (e) => {handleKeyUp(e, game)});
}

// **********************************************************************
// Generating player name and color
// **********************************************************************
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function createName() {
    const prefix = randomFromArray(["COOL","SUPER","HIP","SMUG","COOL","SILKY",
                                    "GOOD","SAFE","DEAR","DAMP","WARM","RICH",
                                    "LONG","DARK","SOFT","BUFF", "DOPE",]);
    const animal = randomFromArray(["BEAR","DOG","CAT","FOX","LAMB","LION","BOAR","GOAT",
                                    "VOLE","SEAL","PUMA","MULE","BULL","BIRD","BUG",]);
    return `${prefix} ${animal}`;
}
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

// **********************************************************************
// Game
// **********************************************************************
const numPlayers = 2;


// Database
let userIdDatabase;
let userRefDatabase;
// Local
let players = {};

// When an user logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user){      // TODO: add prevent additional players to join (asking how many players)
        userIdDatabase = user.uid;
        userRefDatabase = firebase.database().ref(`players/${userIdDatabase}`);
        // Create my player in the database
        userRefDatabase.set({
            id: userIdDatabase,
            name: createName(),
            color: randomFromArray(playerColors),
            x: INIT_PLAYER_X,
            y: INIT_PLAYER_Y,
            leftPressed: false
        })
        // Begin the game now that we are signed in
        initGame();
        //Remove me from Firebase when diconnect
        userRefDatabase.onDisconnect().remove();
    }
})
firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
})

function initGame(){
    const allPlayersDatabaseRef = firebase.database().ref(`players`);
    
    // Fires whenever a new node is added the tree
    allPlayersDatabaseRef.on("child_added", (snapshot) => {
        //Fires whenever a new node is added the tree
        const addedPlayer = snapshot.val();
        players[addedPlayer.id] = addedPlayer;
        console.log(players)
        // Allow game to run when numPlayers players joined the game
        if (Object.keys(players).length === numPlayers){
            console.log("Enough players joined the game");
            startGame();
        }
    })

    // Remove from screen when logged out
    allPlayersDatabaseRef.on("child_removed", (snapshot) => {
        alert("Other player left the game");
        // TODO: Remove from local players
    })

    // Fires whenever a change occurs (player joins, leaves, or modification within a player)
    allPlayersDatabaseRef.on("value", (snapshot) => {
        // players = snapshot.val() || {};
        // // Iterate through player object in database-> key = x, y, ...
        // Object.keys(players).forEach((key) => {
        //     const characterState = players[key];
        //     let el = playerElements[key];
        //     // Now update the local player
        // })
        // console.log(players);
    })
}

// --> When we do something, it updates the data on the firebase --> Causes the function with "value" to fire (since value on database changed), that updates game, which draws what we see on screen.

// Have to push the "game" upto server as well, since things like game.turn. or the imagedata, will also needs to be online since they changes everytime.

function startGame(){
    let game = new Game(numPlayers);
    enableEventListener(game);
    game.players = Object.values(players);      // Array of objects, each object = 1 player
    game.loop();
}