import Player, { initPositions } from './player.js';
import Arrow from './arrow.js';
import Terrain from './terrain.js';
import HealthBar from './health-bar.js';
import Bullet from './bullet.js';
import { WIDTH, HEIGHT, PLAYER_RADIUS, BULLET_RADIUS, ARROW_LENGTH, DIRECTION_RIGHT, DIRECTION_LEFT, GRAVITY, HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, DAMAGE, INITIAL_ANGLE } from './constants.js';

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
    this.checkHit = 0;
    this.trackBulletX = [];
    this.trackBulletY = [];

    // End game
    this.end = false;
  }

  // **********************************************************************
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

  // **********************************************************************
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

    // Draw health bars
    for (let i = 0; i < this.players.length; i++) {
      let healthbar = new HealthBar(this.players[i].x - HEALTH_BAR_WIDTH/2, this.players[i].y - PLAYER_RADIUS*2 - HEALTH_BAR_HEIGHT*2, this.players[i].health, "green");
      healthbar.drawHealth();
    }

    // Draw bullet if exists
    if (this.hasFlyingBullet) {
      this.bullet.drawBullet();
    }
  }

  // **********************************************************************
  // Game Loop
  //
  loop = () => {
    this.update();
    this.draw();
    // console.log("loop");
    window.requestAnimationFrame(this.loop);
  }

  // **********************************************************************
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

  // **********************************************************************
  // Helper Functions
  //

  // Create players
  createPlayers = () => {
    const [x1, y1, x2, y2] = initPositions(this.terrain);
    const player1 = new Player(x1, y1, "red", INITIAL_ANGLE, DIRECTION_RIGHT);
    const player2 = new Player(x2, y2, "blue", Math.PI - INITIAL_ANGLE, DIRECTION_LEFT);
    return [player1, player2];
  }

  // Generate, make fly, check hit for the bullet EACH TIME PLAYER SHOOTS
  handleBullet = () => {
    // Generate bullet only once each time space is pressed
    if (this.bulletFlyingTime === 0) { 
      let bulletStartX = this.players[this.turn].x + ARROW_LENGTH*Math.cos(this.players[this.turn].angle);
      let bulletStartY = this.players[this.turn].y + ARROW_LENGTH*Math.sin(this.players[this.turn].angle);
      this.bullet = new Bullet(bulletStartX, bulletStartY, this.players[this.turn].angle, this.players[this.turn].force, BULLET_RADIUS, this.players[this.turn].color);
    }

    // Flying bullet
    for (let i = 0; i < 100; i++) {
      this.bullet.x += 0.01 * (this.bullet.velocity * Math.cos(this.bullet.bulletAngle));
      this.bullet.y -= 0.01 * ((-this.bullet.velocity * Math.sin(this.bullet.bulletAngle)) - ((1/2 * GRAVITY)*(Math.pow(this.bulletFlyingTime + 1,2) - Math.pow(this.bulletFlyingTime,2))));
      this.trackBulletX[i] = this.bullet.x;
      this.trackBulletY[i] = this.bullet.y;
    }
    this.bulletFlyingTime += 1;

    // Checks if bullet directly hit the OTHER player
    if (this.checkDirectHitPlayer() && this.checkHit === 0){
      this.decreaseHealth(this.players[(this.turn + 1) % this.numPlayers]);
      this.checkHit++;
    }

    // Change turn if bullet goes out of canvas (except for top side)
    if (this.bullet.x > WIDTH || this.bullet.x < 0 || this.bullet.y > HEIGHT) {
      this.nextTurn();
      return;
    }

    // Bullet Crashed Terrain
    this.handleBulletCrashed();
  }

  // Handle if bullet had clash with terrain
  handleBulletCrashed = () => {
    let tempTiles = this.terrain.getTiles;
    let clashPointX = 0;
    let clashPointY = 0;

    // Find first clash point
    for (let i = 0; i < 100; i++) {
      let tempCeilX = Math.ceil(this.trackBulletX[i]);
      let tempCeilY = Math.ceil(this.trackBulletY[i]);
      if (tempTiles[tempCeilX][tempCeilY] == 1) {
        clashPointX = tempCeilX;
        clashPointY = tempCeilY;
        console.log("Found Touch Point!");
        break;
      }
    }

    // Handle clash
    if (clashPointY != 0) {
      tempTiles = this.terrain.getTiles;
      for (let i = 0; i < this.bullet.radius * 10; i++) {
        for (let j = 0; j < this.bullet.radius * 10; j++) {
          if (clashPointX + i < WIDTH && clashPointY + j < HEIGHT) tempTiles[clashPointX + i][clashPointY + j] = 0;
          if (clashPointX - i >= 0 && clashPointY + j < HEIGHT) tempTiles[clashPointX - i][clashPointY + j] = 0;
          if (clashPointX + i < WIDTH && clashPointY - j >= 0) tempTiles[clashPointX + i][clashPointY - j] = 0;
          if (clashPointX - i >= 0 && clashPointY - j >= 0) tempTiles[clashPointX - i][clashPointY - j] = 0;
        }
      }
      this.setTiles = tempTiles;
      this.terrain.updateImageData();
      
      // Checks if bullet splash hit the OTHER player
      if (this.checkSplashHitPlayer(clashPointX, clashPointY) && this.checkHit === 0){
        this.decreaseHealth(this.players[(this.turn + 1) % this.numPlayers]);
      }

      this.handlePlayerFall();
      this.nextTurn();
    }
  }

  // Handle player fall
  handlePlayerFall = () => {
    console.log(this.players);

    let tempTiles = this.terrain.getTiles;

    for (let i = 0; i < this.players.length; i++) {
      let currentPlayer = this.players[i];
      let roundX = Math.ceil(currentPlayer.getX);
      let currentY = Math.ceil(currentPlayer.getY + PLAYER_RADIUS + 1);

      while (currentY < HEIGHT && tempTiles[roundX][currentY] == 0) {
        currentY++;
      }
      if (currentY == HEIGHT) this.players[i].setY = 0;
      else this.players[i].setY = currentY - PLAYER_RADIUS - 1;
    }
  }

  // Check direct player hit
  checkDirectHitPlayer = () => {
    let distance = Math.sqrt(Math.pow((this.players[(this.turn + 1) % this.numPlayers].x - this.bullet.x), 2) + Math.pow((this.players[(this.turn + 1) % this.numPlayers].y - this.bullet.y), 2));
    if (distance < (PLAYER_RADIUS + BULLET_RADIUS)){
      return true;
    }
    return false;
  }

  // Check splash player hit
  checkSplashHitPlayer = (clashPointX, clashPointY) => {
    let distance = Math.sqrt(Math.pow((this.players[(this.turn + 1) % this.numPlayers].x - clashPointX), 2) + Math.pow((this.players[(this.turn + 1) % this.numPlayers].y - clashPointY), 2));
    if (distance < (PLAYER_RADIUS + BULLET_RADIUS*10)){
      return true;
    }
    return false;
  }

  // Decrease player health
  decreaseHealth = (player) => {
    player.health -= DAMAGE;
    // This player loses
    // TODO: Final health decrease is not yet drawn, but annoucement was already made.
    if (this.players[(this.turn + 1) % this.numPlayers].health == 0){
      this.announceWinner(this.players[this.turn].color);
    }
  }

  // Update turn
  nextTurn = () => {
    // Reset changed value
    this.hasFlyingBullet = false;
    this.bullet = null;
    this.bulletFlyingTime = 0;
    this.players[this.turn].force = 0;
    this.checkHit = 0;
    this.players[this.turn].moveCount = 0;
    // In case player never released key --> When turn comes back, value of _Pressed would still be true
    this.players[this.turn].spacePressed = false;
    this.players[this.turn].upPressed = false;
    this.players[this.turn].rightPressed = false;
    this.players[this.turn].downPressed = false;
    this.players[this.turn].leftPressed = false;
    // Change turn
    this.turn = (this.turn + 1) % this.numPlayers;
  }

  // Announce winner
  announceWinner = (this_turn) => {
    alert(`Player ${this_turn} wins!`);
    this.end = true;
  }
}



