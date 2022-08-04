import Player, { initPositions } from './player.js';
import Bullet from './bullet.js';
import { BACKGROUND, FOREGROUND } from './script.js';
import { WIDTH, HEIGHT, PLAYER_RADIUS, BULLET_RADIUS, ARROW_LENGTH, DIRECTION_RIGHT, DIRECTION_LEFT, GRAVITY, HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, STAMINA_BAR_HEIGHT, STAMINA_BAR_WIDTH, MAX_STAMINA, DAMAGE, INITIAL_ANGLE, SPLASH_RADIUS, CLIMBING_LIMIT } from './constants.js';
import { HealthBar, StaminaBar, TurnArrow } from './supplementaries.js';

export const canvas = document.querySelector('#canvas');
export const context = canvas.getContext('2d');

export default class Game {
  /**********************************************************************
  // Construct the intial states of the game
  // @param {} numPlayers 
  ***********************************************************************/
  constructor(numPlayers = 2) {
    // Game config
    this.numPlayers = numPlayers;
    this.imageDataBackground;
    this.imageDataForeground;
    this.restart();
  }

  restart = () => {
    // Game objects
    this.terrain = BACKGROUND;
    this.players = this.createPlayers(this.terrain);
    this.count = 0;
    // Game states
    this.turn = 0;
    this.hasFlyingBullet = false;
    this.bulletFlyingTime = 0;
    this.bullet = null;
    this.bulletType = 'damage';
    this.checkHit = 0;
    this.trackBulletX = [];
    this.trackBulletY = [];
    this.trackFlyX = [];
    this.trackFlyY = [];
  }
  
  // **********************************************************************
  // Game Loop
  // **********************************************************************

  loop = () => {
    this.update();
    this.draw();
    window.requestAnimationFrame(this.loop);
  }

  // **********************************************************************
  // Update the state of the game
  // **********************************************************************

  update = () => {
    // Check if there is a winner
    this.checkWinner();

    //Check if user moved
    this.checkMove();

    // Check if user pressed changing angle keys
    this.checkAngle();

    // Check if user pressed/released shooting key or pressed flying key
    this.checkShoot();

    // Check if there is a bullet
    this.checkBullet();
  }

  // **********************************************************************
  // Draw the game in the current frame
  // **********************************************************************

  draw = () => {
    // Draw terrain
    this.initTerrain();
    this.handlePlayerFall();
    context.putImageData(this.imageDataForeground, 0, 0);

    // Draw players and arrows
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].drawPlayer();
      this.players[i].arrow.drawArrow(this.players[i]); 
    }

    // Draw turn arrow
    let turnArrow = new TurnArrow(this.players[this.turn].x, this.players[this.turn].y);
    turnArrow.drawTurnArrow();

    // Draw health bars and stamina bars.
    for (let i = 0; i < this.players.length; i++) {
      let healthbar = new HealthBar(this.players[i].x - HEALTH_BAR_WIDTH/2, this.players[i].y - PLAYER_RADIUS*2 - HEALTH_BAR_HEIGHT*2, this.players[i].health, "green");
      healthbar.drawHealth();

      let staminabar = new StaminaBar(this.players[i].x - STAMINA_BAR_WIDTH/2, this.players[i].y + PLAYER_RADIUS + STAMINA_BAR_HEIGHT, this.players[i].stamina, "lightblue");
      staminabar.drawStamina();
    }

    // Draw bullet if exists
    if (this.hasFlyingBullet) {
      this.bullet.drawBullet();
    };
  }

  // **********************************************************************
  // Update Functions
  // **********************************************************************

  checkMove = () => {
    if (this.players[this.turn].leftPressed || this.players[this.turn].rightPressed) {
      this.blockCheck();
      this.players[this.turn].move();
      this.handlePlayerClimb();
    }
  }

  checkAngle = () => {
    if (this.players[this.turn].upPressed || this.players[this.turn].downPressed) {
      this.players[this.turn].changeAngle();
    }
  }

  checkShoot = () => {
    if (this.players[this.turn].spacePressed && this.players[this.turn].allowForce) {
      this.players[this.turn].changeForce();
    }
    if (this.players[this.turn].spaceReleased) {
      this.players[this.turn].fire();
      this.hasFlyingBullet = true;
      this.players[this.turn].spaceReleased = false;
    }
  }

  checkBullet = () => {
    if (this.hasFlyingBullet) {
      this.handleBullet();
    }
  }

  checkWinner = () => {
    // Check if both player fell down
    if (this.players.every( (player) => player.y + PLAYER_RADIUS + 1 === HEIGHT)){
      alert("It's a tie!");
      this.restart();

    }
    else{
      for (let i = 0; i < this.players.length; i++){
        if (this.players[i].health === 0 || this.players[i].y + PLAYER_RADIUS + 1 === HEIGHT){
          alert(`Player ${this.players[(i + 1) % this.numPlayers].color} wins!`)
          this.restart();
        }
      }
    }
  }

  // **********************************************************************
  // Helper Functions
  // **********************************************************************

  /////////////////////////////////////////////////////////////////////////
  // **********************************
  // Background and foreground initialization, get & set
  // **********************************
  initTerrain = () => {
    context.drawImage(BACKGROUND, 0, 0);
    if (this.count <= 5) // TODO: ?
      this.imageDataBackground = context.getImageData(0, 0, WIDTH, HEIGHT);
    
    context.drawImage(FOREGROUND, 0, 0);
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
  
  // **********************************
  // Create players
  // **********************************
  createPlayers = () => {
    const [x1, y1, x2, y2] = initPositions(this.terrain);
    const player1 = new Player(x1, y1, "red", INITIAL_ANGLE, DIRECTION_RIGHT);
    const player2 = new Player(x2, y2, "blue", Math.PI - INITIAL_ANGLE, DIRECTION_LEFT);
    return [player1, player2];
  }

  /////////////////////////////////////////////////////////////////////////
  // **********************************
  // Generate, make fly, check hit for the bullet EACH TIME PLAYER SHOOTS
  // **********************************
  handleBullet = () => {    
    // Generate bullet only once each time space is pressed
    if (this.players[this.turn].fPressed){
      this.bulletType = 'fly';
      this.players[this.turn].fPressed = false;
      this.players[this.turn].allowF = false;
    }

    if (this.bulletFlyingTime === 0) { 
      let bulletStartX = this.players[this.turn].x + ARROW_LENGTH*Math.cos(this.players[this.turn].arrow.angle);
      let bulletStartY = this.players[this.turn].y + ARROW_LENGTH*Math.sin(this.players[this.turn].arrow.angle);
      this.bullet = new Bullet(bulletStartX, bulletStartY, this.players[this.turn].arrow.angle, this.players[this.turn].force, BULLET_RADIUS, this.bulletType);
    }

    // Flying bullet. Track bullet damage positions 100 times within 1 frame
    if (this.bulletType === 'damage'){
      for (let i = 0; i < 100; i++) {
        this.bullet.x += 0.01 * (this.bullet.velocity * Math.cos(this.bullet.bulletAngle));
        this.bullet.y -= 0.01 * ((-this.bullet.velocity * Math.sin(this.bullet.bulletAngle)) - ((1/2 * GRAVITY)*(Math.pow(this.bulletFlyingTime + 1,2) - Math.pow(this.bulletFlyingTime,2))));
        this.trackBulletX[i] = this.bullet.x;
        this.trackBulletY[i] = this.bullet.y;
      }
      this.bulletFlyingTime++;
      
      // Checks if bullet directly hit the OTHER player. Limit number of times we decrease player health by 1 (this.checkHit)
      if (this.checkDirectHitPlayer() && this.checkHit === 0){
      this.decreaseHealth(this.players[(this.turn + 1) % this.numPlayers]);
      this.checkHit++;
      }
      // Check if bullet flew out of canvas
      this.checkBulletOutCanvas();
      // Bullet Damage Crashed Terrain
      this.handleBulletCrashedDamage();
    }

    // Flying bullet. Track bullet flying positions 50 times within 1 frame
    else{
      for (let i = 0; i < 100; i++) {
        this.bullet.x += 0.01 * (this.bullet.velocity * Math.cos(this.bullet.bulletAngle));
        this.bullet.y -= 0.01 * ((-this.bullet.velocity * Math.sin(this.bullet.bulletAngle)) - ((1/2 * GRAVITY)*(Math.pow(this.bulletFlyingTime + 1,2) - Math.pow(this.bulletFlyingTime,2))));
        this.trackBulletX[i] = this.bullet.x;
        this.trackBulletY[i] = this.bullet.y;
      }
      this.bulletFlyingTime += 1;

      // Check if bullet flew out of canvas
      this.checkBulletOutCanvas();
      // Bullet Fly Crashed Terrain
      this.handleBulletCrashedFly();
    }
  }

  // **********************************
  // Handle if bullet DAMAGE had clashed with terrain
  // **********************************
  handleBulletCrashedDamage = () => {
    let clashPointX = 0;
    let clashPointY = 0;
    
    // Find first clash point
    for (let i = 0; i < 100; i++) {
      let tempCeilX = Math.ceil(this.trackBulletX[i]);
      let tempCeilY = Math.ceil(this.trackBulletY[i]);
      if (this.getColor(this.imageDataBackground.data, tempCeilX, tempCeilY).toString() !== this.getColor(this.imageDataForeground.data, tempCeilX, tempCeilY).toString()) {
        clashPointX = tempCeilX;
        clashPointY = tempCeilY;
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
            let distance = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));
            if (clashPointX + i*SIGN_X[k] >= 0 && clashPointX + i*SIGN_X[k] < WIDTH &&
                clashPointY + j*SIGN_Y[k] >= 0 && clashPointY + j*SIGN_Y[k] < HEIGHT &&
                distance < SPLASH_RADIUS) {
              let backgroundPixelColor = this.getColor(this.imageDataBackground.data, clashPointX + i*SIGN_X[k], clashPointY + j*SIGN_Y[k]);
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4] = backgroundPixelColor[0];
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4 + 1] = backgroundPixelColor[1];
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4 + 2] = backgroundPixelColor[2];
              tempImageDataForeground.data[((clashPointY + j*SIGN_Y[k]) * WIDTH + clashPointX + i*SIGN_X[k])*4 + 3] = backgroundPixelColor[3];
            }
          }
        }
      }
      this.imageDataForeground = tempImageDataForeground;
      // Checks if bullet splash hit the OTHER player
      if (this.checkSplashHitPlayer(clashPointX, clashPointY) && this.checkHit === 0){
        this.decreaseHealth(this.players[(this.turn + 1) % this.numPlayers]);
      }
      this.nextTurn();
    }
  }

  // **********************************
  // Handle if bullet FLY had clashed with terrain
  // **********************************
  
  // TODO: Limit pressing f while shooting
  handleBulletCrashedFly = () => {
    let clashCenterX = 0;
    let clashCenterY = 0;
    let iClash = null;

    // Find first clash point in each bullet circumference
    for (let i = 0; i < 100; i++) {
      let centerBulletX = Math.ceil(this.trackBulletX[i]);
      let centerBulletY = Math.ceil(this.trackBulletY[i]);
      if (this.getColor(this.imageDataBackground.data, centerBulletX, centerBulletY).toString() !== this.getColor(this.imageDataForeground.data, centerBulletX, centerBulletY).toString()){
        clashCenterX = centerBulletX;
        clashCenterY = centerBulletY;
        iClash = i;
        break;
      }
    }

    if (iClash){
      let currentX;
      let currentY;

      while (--iClash >= 0){
        currentX = Math.ceil(this.trackBulletX[iClash]);
        currentY = Math.ceil(this.trackBulletY[iClash]);
        let distanceSquared = Math.pow(currentX-clashCenterX,2) + Math.pow(currentY-clashCenterY,2)
        if (distanceSquared > Math.pow(PLAYER_RADIUS,2)) break;
      }

      this.players[this.turn].setX = currentX;
      this.players[this.turn].setY = currentY - PLAYER_RADIUS;
      this.nextTurn();
      return;
    }
  }

  // **********************************
  // Handle player fall
  // **********************************
  handlePlayerFall = () => {
    for (let i = 0; i < this.players.length; i++) {
      let currentPlayer = this.players[i];
      let currentX = Math.ceil(currentPlayer.getX);
      let currentY = Math.ceil(currentPlayer.getY + PLAYER_RADIUS + 1);

      while (currentY < HEIGHT && this.getColor(this.imageDataForeground.data, currentX, currentY).toString() === this.getColor(this.imageDataBackground.data, currentX, currentY).toString()) {
        currentY++;
        this.players[i].setY = currentY - PLAYER_RADIUS;
      }
    }
  }

  // **********************************
  // Change turn if bullet goes out of canvas (except for top side)
  // **********************************
  checkBulletOutCanvas = () => {
    if (this.bullet.x > WIDTH || this.bullet.x < 0 || this.bullet.y > HEIGHT) {
      this.nextTurn();
      return;
    }
  }
    
  // **********************************
  // Check direct player hit
  // **********************************
  checkDirectHitPlayer = () => {
    let distance = Math.sqrt(Math.pow((this.players[(this.turn + 1) % this.numPlayers].x - this.bullet.x), 2) + Math.pow((this.players[(this.turn + 1) % this.numPlayers].y - this.bullet.y), 2));
    if (distance < (PLAYER_RADIUS + BULLET_RADIUS)){
      return true;
    }
    return false;
  }

  // **********************************
  // Check splash player hit
  // **********************************
  checkSplashHitPlayer = (clashPointX, clashPointY) => {
    let distance = Math.sqrt(Math.pow((this.players[(this.turn + 1) % this.numPlayers].x - clashPointX), 2) + Math.pow((this.players[(this.turn + 1) % this.numPlayers].y - clashPointY), 2));
    if (distance < (PLAYER_RADIUS + SPLASH_RADIUS)){
      return true;
    }
    return false;
  }

  // **********************************
  // Decrease player health
  // **********************************
  decreaseHealth = (player) => {
    player.health -= DAMAGE;
    player.health = Math.max(player.health, 0);
    // This player loses
    if (this.players[(this.turn + 1) % this.numPlayers].health == 0){
      this.winner = this.players[this.turn];
    }
  }

  /////////////////////////////////////////////////////////////////////////
  // **********************************
  // Handle player climb
  // **********************************
  handlePlayerClimb = () => {
    let currentPlayer = this.players[this.turn];
    let currentX = Math.ceil(currentPlayer.getX);
    let currentY = Math.ceil(currentPlayer.getY + PLAYER_RADIUS + 1);
    if (currentY > 0 && this.getColor(this.imageDataForeground.data, currentX, currentY-1).toString() !== this.getColor(this.imageDataBackground.data, currentX, currentY-1).toString()) {
      currentY--;
      currentPlayer.setY = currentY - PLAYER_RADIUS - 1;
    }
  }

  // **********************************
  // Check if player is being blocked/reached boundary in either direction
  // **********************************
  blockCheck = () => {
    let currentPlayer = this.players[this.turn];
    let currentX = Math.ceil(currentPlayer.getX);
    let currentY = Math.ceil(currentPlayer.getY + PLAYER_RADIUS + 1);
    // Map boundaries
    if (this.players[this.turn].x < PLAYER_RADIUS) currentPlayer.allowMoveLeft = false;
    if (this.players[this.turn].x > WIDTH - PLAYER_RADIUS) currentPlayer.allowMoveRight = false;
    // Cannot climb
    for (let i = 0; i < CLIMBING_LIMIT; i++){
      if (this.getColor(this.imageDataForeground.data, currentX + PLAYER_RADIUS, currentY-PLAYER_RADIUS-i).toString() !== this.getColor(this.imageDataBackground.data, currentX + PLAYER_RADIUS, currentY-PLAYER_RADIUS-i).toString()){
        currentPlayer.allowMoveRight = false;
      }
      if (this.getColor(this.imageDataForeground.data, currentX - PLAYER_RADIUS, currentY-PLAYER_RADIUS-i).toString() !== this.getColor(this.imageDataBackground.data, currentX - PLAYER_RADIUS, currentY-PLAYER_RADIUS-i).toString()){
        currentPlayer.allowMoveLeft = false;
      }
    }
  }
  
  // **********************************
  // Get color data at position x, y
  // **********************************
  getColor = (imageData, x, y) => {
    const _rgba = [];
    _rgba.push(imageData[(y * WIDTH + x) * 4])
    _rgba.push(imageData[(y * WIDTH + x) * 4+1])
    _rgba.push(imageData[(y * WIDTH + x) * 4+2])
    _rgba.push(imageData[(y * WIDTH + x) * 4+3])
    return _rgba;
  }

  /////////////////////////////////////////////////////////////////////////
  // **********************************
  // Update turn
  // **********************************
  nextTurn = () => {
    // Reset changed value
    this.hasFlyingBullet = false;
    this.bullet = null;
    this.bulletFlyingTime = 0;
    this.players[this.turn].force = 0;
    this.checkHit = 0;
    this.players[this.turn].allowMoveLeft = true;
    this.players[this.turn].allowMoveRight = true;
    this.players[this.turn].allowForce = true;
    this.players[this.turn].allowF = true;
    this.players[this.turn].forceIncrease = true;
    this.bulletType = 'damage';
    // In case player never released key --> When turn comes back, value of _Pressed would still be true
    this.players[this.turn].spacePressed = false;
    this.players[this.turn].upPressed = false;
    this.players[this.turn].rightPressed = false;
    this.players[this.turn].downPressed = false;
    this.players[this.turn].leftPressed = false;
    this.players[this.turn].fPressed = false;
    // Change turn
    this.turn = (this.turn + 1) % this.numPlayers;
    this.players[this.turn].stamina = MAX_STAMINA;      // Restore stamina for player just received turn
    document.querySelector('#force-bar').style.width = this.players[this.turn].force + "%"
    document.querySelector('#last-force-bar').style.width = this.players[this.turn].lastForce + "%"
  }
}
