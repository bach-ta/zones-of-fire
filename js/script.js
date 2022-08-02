import Game from './game.js';

// **********************************************************************
// Event listeners
//

const handleKeyDown = (e, game) => {
    switch (e.keyCode){
        case 32:                              // If pressed spacebar (_)
            game.players[game.turn].spacePressed = true;
            break;   
        case 37:                              // If pressed left arrow (<)
            game.players[game.turn].leftPressed = true;   
            break;
        case 38:                              // If pressed up arrow (^)
            game.players[game.turn].upPressed = true;      
            break;
        case 39:                              // If pressed right arrow (>)
            game.players[game.turn].rightPressed = true;   
            break;
        case 40:                              // If pressed down arrow (v)
            game.players[game.turn].downPressed = true;      
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
            game.players[game.turn].leftPressed = false;
            break;
        case 38:                              // If released up arrow (^)
            game.players[game.turn].upPressed = false;
            break;
        case 39:                              // If released right arrow (>)
            game.players[game.turn].rightPressed = false;
            break;
        case 40:                              // If released down arrow (v)
            game.players[game.turn].downPressed = false;
            break;
        }
}

export const enableEventListener = (game) => {
    document.addEventListener('keydown', (e) => {handleKeyDown(e, game)});
    document.addEventListener('keyup', (e) => {handleKeyUp(e, game)});
}

let game = new Game();
enableEventListener(game);
game.loop();
