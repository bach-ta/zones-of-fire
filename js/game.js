import Player, { initPositions } from './player.js';
import Arrow from './arrow.js';
import { background, foreground } from './sprite.js';
import HealthBar from './health-bar.js';
import StaminaBar from './stamina-bar.js';
import Bullet from './bullet.js';
import { WIDTH, HEIGHT, PLAYER_RADIUS, BULLET_RADIUS, ARROW_LENGTH, DIRECTION_RIGHT, DIRECTION_LEFT, GRAVITY, HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, STAMINA_BAR_HEIGHT, STAMINA_BAR_WIDTH, MAX_STAMINA, DAMAGE, INITIAL_ANGLE, SPLASH_RADIUS } from './constants.js';

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
    this.terrain = background;
    this.players = this.createPlayers(this.terrain);
    this.imageDataBackground;
    this.imageDataForeground;
    this.count = 0;

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

  // Initialize background and foreground
  initTerrain = () => {
    context.drawImage(background, 0, 0);
    if (this.count <= 5) // TODO: ?
      this.imageDataBackground = context.getImageData(0, 0, WIDTH, HEIGHT);
    
    context.drawImage(foreground, 0, 0);
    if (this.count <= 5) // TODO: ?
      this.imageDataForeground = context.getImageData(0, 0, WIDTH, HEIGHT);
    
    this.count++;
  }

  get getBackground() {
    return this.imageDataBackground
  }
  set setBackground(newBackground) {
    this.imageDataBackground = newBackground;
  }
  
  get getForeground() {
    return this.imageDataForeground
  }
  set setForeground(newForeground) {
    this.imageDataForeground = newForeground;
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
      this.initTerrain();
      context.putImageData(this.imageDataForeground, 0, 0);

    // Draw players and arrows
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].drawPlayer();
      let arrow = new Arrow(this.players[i].color);
      arrow.drawArrow(this.players[i]);
    }

    // Draw health bars and stamina bars
    for (let i = 0; i < this.players.length; i++) {
      let healthbar = new HealthBar(this.players[i].x - HEALTH_BAR_WIDTH/2, this.players[i].y - PLAYER_RADIUS*2 - HEALTH_BAR_HEIGHT*2, this.players[i].health, "green");
      healthbar.drawHealth();

      let staminabar = new StaminaBar(this.players[i].x - STAMINA_BAR_WIDTH/2, this.players[i].y + PLAYER_RADIUS + STAMINA_BAR_HEIGHT, this.players[i].stamina, "lightblue");
      staminabar.drawStamina();
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
    window.requestAnimationFrame(this.loop);
    this.update();
    this.draw();
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
      this.players[this.turn].stamina = MAX_STAMINA;      // Restore stamina for player just received turn
      return;
    }

    // Bullet Crashed Terrain
    this.handleBulletCrashed();
  }

  getColor = (imageData, x, y) => {
    const _rgba = [];
    _rgba.push(imageData[(y * WIDTH + x) * 4])
    _rgba.push(imageData[(y * WIDTH + x) * 4+1])
    _rgba.push(imageData[(y * WIDTH + x) * 4+2])
    _rgba.push(imageData[(y * WIDTH + x) * 4+3])
    return _rgba;
  }

  // Handle if bullet had clash with terrain
  handleBulletCrashed = () => {
    let clashPointX = 0;
    let clashPointY = 0;

    // Find first clash point
    for (let i = 0; i < 100; i++) {
      let tempCeilX = Math.ceil(this.trackBulletX[i]);
      let tempCeilY = Math.ceil(this.trackBulletY[i]);

      if (this.getColor(this.imageDataBackground.data, tempCeilX, tempCeilY).toString() !== this.getColor(this.imageDataForeground.data, tempCeilX, tempCeilY).toString()) {
        clashPointX = tempCeilX;
        clashPointY = tempCeilY;
        console.log("Found Touch Point!");
        break;
      }
    }

    let tempImageDataForeground = this.getForeground;

    const SIGN_X = [1, -1, 1, -1];
    const SIGN_Y = [1, 1, -1, -1];

    // Handle clash
    if (clashPointY != 0) {
      for (let i = 0; i < SPLASH_RADIUS; i++) {
        for (let j = 0; j < SPLASH_RADIUS; j++) {
          for (let k = 0; k < 4; k++) {
            let distance = Math.sqrt(Math.pow(i*SIGN_X[k], 2) + Math.pow((j*SIGN_Y[k]), 2));
            if (distance < SPLASH_RADIUS) {
              let backgroundPixelColor = this.getColor(this.imageDataBackground.data, clashPointX + i*SIGN_X[k], clashPointY + j*SIGN_Y[k]);
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4] = backgroundPixelColor[0];
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4 + 1] = backgroundPixelColor[1];
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4 + 2] = backgroundPixelColor[2];
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4 + 3] = backgroundPixelColor[3];
            }
          } 
        }
      }
      this.setForeground = tempImageDataForeground;

      // Checks if bullet splash hit the OTHER player
      if (this.checkSplashHitPlayer(clashPointX, clashPointY) && this.checkHit === 0){
        this.decreaseHealth(this.players[(this.turn + 1) % this.numPlayers]);
      }

      this.handlePlayerFall();
      this.nextTurn();
      this.players[this.turn].stamina = MAX_STAMINA;    // Restore stamina for player just received turn
    }
  }

  // Handle player fall
  handlePlayerFall = () => {

    for (let i = 0; i < this.players.length; i++) {
      let currentPlayer = this.players[i];
      let currentX = Math.ceil(currentPlayer.getX);
      let currentY = Math.ceil(currentPlayer.getY + PLAYER_RADIUS + 1);

      while (currentY < HEIGHT && this.getColor(this.imageDataForeground, currentX, currentY).toString() !== this.getColor(this.imageDataBackground, currentX, currentY).toString()) {
        currentY++;
      }
      if (currentY == HEIGHT) this.announceWinner(i);
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
    if (distance < (PLAYER_RADIUS + SPLASH_RADIUS)){
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
    this.players[this.turn].allowMove = true;
    this.players[this.turn].forceIncrease = true;
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



