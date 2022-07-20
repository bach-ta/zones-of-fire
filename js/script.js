import Game from './game.js';
import Bullet from './bullet.js';

const game = new Game();

game.players[game.turn].changeAngle();
game.loop();