import Game from './game.js';

const game = new Game();
game.loop();

//**********************************************************************
//Event listeners
//

//Changing Angles
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 38){                          //If pressed up arrow (^)
        game.players[game.turn].upPressed = true;      
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 38){                          //If released up arrow (^)
        game.players[game.turn].upPressed = false;
    }
});
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 40){                          //If pressed down arrow (v)
        game.players[game.turn].downPressed = true;      
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 40){                          //If released down arrow (v)
        game.players[game.turn].downPressed = false;
    }
});

//Holding and Releasing Force
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 32){                          //If pressed spacebar (_)
        game.players[game.turn].spacePressed = true;   
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 32){                          //If released spacebar (_)
        game.players[game.turn].spacePressed = false;
        game.players[game.turn].spaceReleased = true;
    }
});

//Moving players
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 37){                          //If pressed left arrow (<)
        game.players[game.turn].leftPressed = true;   
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 37){                          //If released left arrow (<)
        game.players[game.turn].leftPressed = false;
    }
});
document.body.addEventListener('keydown', event => {
    if (event.keyCode === 39){                          //If pressed right arrow (>)
        game.players[game.turn].rightPressed = true;   
    }
});
document.body.addEventListener('keyup', event => {
    if (event.keyCode === 39){                          //If released right arrow (>)
        game.players[game.turn].rightPressed = false;
    }
});