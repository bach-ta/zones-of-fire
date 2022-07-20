import Player, { initPositions } from './player.js';
import Terrain from './terrain.js';
import { RADIUS } from './constants.js';

export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

export default class Game {
  constructor(numPlayers = 2) {
    this.numPlayers = numPlayers;
    this.turn = 0;
    this.players = [];
  }

  // Display player on terrain
  displayPlayer = (player, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(player.x, player.y, RADIUS, 0, Math.PI*2);
    context.fill();
  }

  // Create players
  createPlayers = (terrain) => {
    const [x1, y1, x2, y2] = initPositions(terrain);
    const player1 = new Player(x1,y1);
    const player2 = new Player(x2,y2);
    
    // Display players on terrain
    this.displayPlayer(player1, "red");
    this.displayPlayer(player2, "blue");

    return [player1, player2];
  }

  nextTurn = () => {
    this.turn = (this.turn + 1) % this.numPlayers;
  }

  announceWinner = player => {
    alert(`Player ${player} wins!`);
  }

  initGame = () => {
    const terrain = new Terrain("flat", 500, 400);
    terrain.displayTerrain();

    this.players = this.createPlayers(terrain);
  }
}
