import Player, { initPositions } from './player.js';
import Terrain from './terrain.js';
import { WIDTH, HEIGHT, RADIUS } from './constants.js';

export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

export default class Game {
  constructor(numPlayers = 2) {
    this.numPlayers = numPlayers;
    this.turn = 0;
    this.players = [];
  }

  // Create players
  createPlayers = (terrain) => {
    const [x1, y1, x2, y2] = initPositions(terrain);
    const player1 = new Player(x1, y1, "red");
    const player2 = new Player(x2, y2, "blue");
    
    // Display players on terrain
    player1.displayPlayer();
    player2.displayPlayer();

    return [player1, player2];
  }

  nextTurn = () => {
    this.turn = (this.turn + 1) % this.numPlayers;
  }

  announceWinner = player => {
    alert(`Player ${player} wins!`);
  }

  initGame = () => {
    const terrain = new Terrain("flat", WIDTH, HEIGHT);
    terrain.displayTerrain();
    this.players = this.createPlayers(terrain);
  }
}
