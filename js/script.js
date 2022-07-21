import Game from './game.js';

const game = new Game();
game.loop();


//Event listeners
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 37){                          //If pressed left arrow
        game.players[game.turn].leftPressed = true;      
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 37){                          //If released left arrow
        game.players[game.turn].leftPressed = false;
    }
});

document.body.addEventListener('keydown', event => {
    if (event.keyCode === 39){                          //If pressed right arrow
        game.players[game.turn].rightPressed = true;      
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 39){                          //If released right arrow
        game.players[game.turn].rightPressed = false;
    }
});

document.body.addEventListener('keydown', event => {
    if (event.keyCode === 32){                          //If pressed spacebar
        game.players[game.turn].spacePressed = true;   
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 32){                          //If released spacebar
        game.players[game.turn].spacePressed = false;
        game.players[game.turn].spaceReleased = true;
    }
});
