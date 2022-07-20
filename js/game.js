import Player from './player.js';
import Terrain from './terrain.js';
import createPlayers from './player.js';

export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

export default class Game {
  constructor(numPlayers = 2) {
    this.numPlayers = numPlayers;
    this.turn = 0;
    this.players = [];
  }

  nextTurn = () => {
    this.turn = (this.turn + 1) % this.numPlayers;
  }

  announceWinner = player => {
    alert(`Player ${player} wins!`);
  }

  initGame() {
    let terrain = new Terrain("flat", 500, 400);
    terrain.displayTerrain();

    this.players = createPlayers(terrain);
  }
}
