import Player, { initPositions } from './player.js';
import Arrow from './arrow.js';
import Terrain from './terrain.js';
import Bullet from './bullet.js';
import { WIDTH, HEIGHT, PLAYER_RADIUS, BULLET_RADIUS, ARROW_LENGTH, DIRECTION_RIGHT, DIRECTION_LEFT, GRAVITY } from './constants.js';

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
    this.bulletFlyingTime = 0;
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
    // console.log("loop");
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
    if (this.players[this.turn].upPressed || this.players[this.turn].downPressed) {
      this.players[this.turn].changeAngle();
    }
  }

  checkShoot = () => {
    if (this.players[this.turn].spacePressed) {
      this.players[this.turn].changeForce();
    }
    
    if (this.players[this.turn].spaceReleased) {
      this.players[this.turn].fire();
      this.hasFlyingBullet = true;
      this.players[this.turn].spaceReleased = false;
    }
  }

  checkMove = () => {
    if (this.players[this.turn].leftPressed || this.players[this.turn].rightPressed) {
      this.players[this.turn].move();
      //Check Boundary
      if (this.players[this.turn].x < PLAYER_RADIUS) {
        this.players[this.turn].x = PLAYER_RADIUS;
      }
      if (this.players[this.turn].x > WIDTH - PLAYER_RADIUS) {
        this.players[this.turn].x = WIDTH - PLAYER_RADIUS;
      }
    }
  }

  //**********************************************************************
  // Helper Functions
  //

  handleBullet = () => {
    //Generate bullet only once each time space is pressed
    if (this.bulletFlyingTime === 0) { 
      let bulletStartX = this.players[this.turn].x + ARROW_LENGTH*Math.cos(this.players[this.turn].angle);
      let bulletStartY = this.players[this.turn].y + ARROW_LENGTH*Math.sin(this.players[this.turn].angle);
      this.bullet = new Bullet(bulletStartX, bulletStartY, this.players[this.turn].angle, this.players[this.turn].force, BULLET_RADIUS, this.players[this.turn].color);
    }
    
    //Flying bullet
    this.bullet.x += 1*(this.bullet.velocity * Math.cos(this.bullet.bulletAngle));
    this.bullet.y -= (-this.bullet.velocity * Math.sin(this.bullet.bulletAngle)) - ((1/2 * GRAVITY)*(Math.pow(this.bulletFlyingTime + 1,2) - Math.pow(this.bulletFlyingTime,2)));
    this.bulletFlyingTime += 1;

    //Reset bullet and player force if bullet goes out of canvas (except for top side)
    if (this.bullet.x > WIDTH || this.bullet.x < 0 || this.bullet.y > HEIGHT) {
      this.nextTurn();
    }
  }

  nextTurn = () => {// console.log("Bullet out. You can shoot now")
    this.hasFlyingBullet = false;
    this.bullet = null;
    this.bulletFlyingTime = 0;
    this.players[this.turn].force = 0;

    //In case player never released key --> When turn comes back, value of _Pressed still be true
    this.players[this.turn].spacePressed = false;
    this.players[this.turn].upPressed = false;
    this.players[this.turn].rightPressed = false;
    this.players[this.turn].downPressed = false;
    this.players[this.turn].leftPressed = false;

    //Reset amount of movement allowed before switching turn
    this.players[this.turn].moveCount = 0;
    //Change turn
    this.turn = (this.turn + 1) % this.numPlayers;
  }

  announceWinner = player => {
    alert(`Player ${player} wins!`);
  }

  // Create players
  createPlayers = () => {
    const [x1, y1, x2, y2] = initPositions(this.terrain);
    const player1 = new Player(x1, y1, "red", 0, DIRECTION_RIGHT);
    const player2 = new Player(x2, y2, "blue", Math.PI, DIRECTION_LEFT);
    return [player1, player2];
  }
}



