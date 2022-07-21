import Player, { initPositions } from './player.js';
import Arrow from './arrow.js';
import Terrain from './terrain.js';
import Bullet from './bullet.js';
import { WIDTH, HEIGHT, PLAYER_RADIUS, BULLET_RADIUS} from './constants.js';

export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

export default class Game {
  /**********************************************************************
  // Construct the intial states of the game
  // @param {} numPlayers 
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
    this.bulletGenerationCount = 0;
    this.bullet = null;
    // test bullet
    // this.hasFlyingBullet = true;
    // this.bullet = new Bullet(150, 150, 45, 5, 5, "red");
  }

  //**********************************************************************
  // Update the state of the game
  //
  update = () => {
    //Check if user moved
    this.checkMove();

    // Check if user pressed changing angle keys
    this.checkAngle();

    // Check if user pressed/released shooting key
    this.checkShoot();

    // Check if there is a bullet
    this.checkBullet();
  }

  //**********************************************************************
  // Draw the game in the current frame
  //
  draw = () => {
    // Draw terrain
    this.terrain.drawTerrain();

    // Draw players and arrows
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].drawPlayer();
      let arrow = new Arrow(this.players[i].color);
      arrow.drawArrow(this.players[i]);
    }

    // Draw bullet if exists
    if (this.hasFlyingBullet) {
      this.bullet.drawBullet();
    }
  }

  //**********************************************************************
  // Game Loop
  //
  loop = () => {
    this.update();
    this.draw();
    //console.log("loop");
    window.requestAnimationFrame(this.loop);
  }

  //**********************************************************************
  // Update Functions
  //
  checkBullet = () => {
    if (this.hasFlyingBullet) {
      this.handleBullet();
    }
  }

  checkAngle = () => {
    if (this.players[this.turn].upPressed || this.players[this.turn].downPressed){
      this.players[this.turn].changeAngle();
    }
  }

  checkShoot = () => {
    if (this.players[this.turn].spacePressed){
      this.players[this.turn].changeForce();
    }
    
    if (this.players[this.turn].spaceReleased){
      this.hasFlyingBullet = true;
      this.players[this.turn].spaceReleased = false;
      this.players[this.turn].fire();
    }
  }

  checkMove = () => {
    if (this.players[this.turn].leftPressed || this.players[this.turn].rightPressed){
      this.players[this.turn].move();
      //Check Boundary
      if (this.players[this.turn].x < PLAYER_RADIUS){
        this.players[this.turn].x = PLAYER_RADIUS;
      }
      if (this.players[this.turn].x > WIDTH - PLAYER_RADIUS){
        this.players[this.turn].x = WIDTH - PLAYER_RADIUS;
      }
    }
  }

  //**********************************************************************
  // Helper Functions
  //

  handleBullet = () => {
    //Generate bullet only once each time space is pressed
    if (this.bulletGenerationCount === 0){ 
      let bulletStartX = this.players[this.turn].x + PLAYER_RADIUS*Math.cos(this.players[this.turn].angle);
      let bulletStartY = this.players[this.turn].y + PLAYER_RADIUS*Math.sin(this.players[this.turn].angle);
      this.bullet = new Bullet(bulletStartX, bulletStartY, this.players[this.turn].angle, this.players[this.turn].force, BULLET_RADIUS, "yellow");
      this.bulletGenerationCount += 1;
    }
    
    //Flying bullet
    this.bullet.x += this.bullet.velocity * Math.cos(this.bullet.bulletAngle);
    this.bullet.y += this.bullet.velocity * Math.sin(this.bullet.bulletAngle);
    
    //Reset bullet and player force if bullet goes out of canvas
    if (this.bullet.x > WIDTH || this.bullet.x < 0 || this.bullet.y > HEIGHT || this.bullet.y < 0) {
      console.log("Bullet out. You can shoot now")
      this.hasFlyingBullet = false;
      this.bullet = null;
      this.bulletGenerationCount = 0;
      this.players[this.turn].force = 0;
      this.nextTurn();
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
    const player2 = new Player(x2, y2, "blue", Math.PI);
    return [player1, player2];
  }
}



