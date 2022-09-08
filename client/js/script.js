// const { MAX_STAMINA } = require('./constants.js');
// const { Game } = require('./game.js');

// **********************************************************************
// Event listeners
//

const handleKeyDown = (e, game) => {
    switch (e.keyCode){
        case 32:                              // If pressed spacebar (_)
            game.players[game.turn].spacePressed = true;
            break;   
        case 37:                              // If pressed left arrow (<)
        case 65:                              // If pressed A
            game.players[game.turn].leftPressed = true;   
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

// window.onload = () => {
//     let game = new Game();
//     enableEventListener(game);
//     game.loop();
// }
