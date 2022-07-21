import Player, { initPositions } from './player.js';
import Terrain from './terrain.js';
import Bullet from './bullet.js';
import { WIDTH, HEIGHT, RADIUS } from './constants.js';

export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

export default class Game {
  /**
   * Construct the intial states of the game
   * @param {} numPlayers 
   */
  constructor(numPlayers = 2) {
    // Game config
    this.numPlayers = numPlayers;

    // Game objects
    this.terrain = new Terrain("flat", WIDTH, HEIGHT);
    this.players = this.createPlayers(this.terrain);

    // Game states
    this.turn = 0;
    this.hasFlyingBullet = false;
    this.bullet = null;
    //test bullet
    this.hasFlyingBullet = true;
    this.bullet = new Bullet(150, 150, 45, 5, 5, "red");
  }

  /**
   * Update the state of the game
   */
  update = () => {
    
    // Check if there is a bullet
    if (this.hasFlyingBullet) {
      this.handleBullet();
    }

    // Check if player pressed changing angle keys
    if (this.players[this.turn].leftPressed || this.players[this.turn].rightPressed){
      this.players[this.turn].changeAngle();
    }

    // Check if player pressed/released shooting key
    if (this.players[this.turn].spacePressed){
      this.players[this.turn].changeForce();
    }
    if (this.players[this.turn].spaceReleased){
      this.players[this.turn].fire();
      this.players[this.turn].spaceReleased = false;
      this.players[this.turn].force = 0;
    }
  }

  /**
   * Draw the game in the current frame
   */
  draw = () => {
    // Draw terrain
    this.terrain.drawTerrain();

    // Draw players
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].drawPlayer();
    }

    // Draw bullet if exists
    if (this.hasFlyingBullet) {
      this.bullet.drawBullet();
    }

  }

  /**
   * Game loop
   */
  loop = () => {
    this.update();
    this.draw();
    //console.log("loop");
    window.requestAnimationFrame(this.loop);
  }

  //==============================================//
  //==============================================//
  /* Helper Functions */

  handleBullet = () => {
    this.bullet.x += this.bullet.velocity * Math.sin(this.bullet.angle);
    this.bullet.y += this.bullet.velocity * Math.cos(this.bullet.angle);
    
    // Clear if bullet touch object
    if (this.bullet.x > WIDTH && this.bullet.y > HEIGHT) {
      this.hasFlyingBullet = false;
      this.bullet = null;
    }
  }

  nextTurn = () => {
    this.turn = (this.turn + 1) % this.numPlayers;
  }

  announceWinner = player => {
    alert(`Player ${player} wins!`);
  }

  // Create players
  createPlayers = () => {
    const [x1, y1, x2, y2] = initPositions(this.terrain);
    const player1 = new Player(x1, y1, "red");
    const player2 = new Player(x2, y2, "blue");
    return [player1, player2];
  }
}
