import Game from './game.js';

const game = new Game();
game.loop();


//Event listeners
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 37){                          //If pressed left arrow
        game.players[0].leftPressed = true;      
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 37){                          //If released left arrow
        game.players[0].leftPressed = false;
    }
});

document.body.addEventListener('keydown', event => {
    if (event.keyCode === 39){                          //If pressed right arrow
        game.players[0].rightPressed = true;      
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 39){                          //If released right arrow
        game.players[0].rightPressed = false;
    }
});

