const { context, ARROW_LENGTH, ARROW_WIDTH, HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, MAX_HEALTH, STAMINA_BAR_HEIGHT, STAMINA_BAR_WIDTH, MAX_STAMINA, PLAYER_RADIUS } = require ("./constants.js");

// **********************************************************************
// Player Arrow
// **********************************************************************

class Arrow{
    constructor(angle, color, length = ARROW_LENGTH, width = ARROW_WIDTH){
        this.color = color;
        this.angle = angle;
        this.length = length;
        this.width = width;
    }

    drawArrow = (player) => {
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.moveTo(player.x, player.y)
        context.lineTo((player.x + this.length*Math.cos(this.angle)), (player.y + this.length*Math.sin(this.angle)))
        context.stroke();
    }
}

// **********************************************************************
// Health Bar
// **********************************************************************

class HealthBar {
    constructor(x, y, health = MAX_HEALTH, color){
        this.x = x;
        this.y = y;
        this.height = HEALTH_BAR_HEIGHT; 
        this.width = HEALTH_BAR_WIDTH;
        this.health = health;
        this.color = color;
    }

    drawHealth = () => {
        context.strokeStyle = "white";
        context.lineWidth = PLAYER_RADIUS*1/20;
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.health, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// **********************************************************************
// Stamina Bar
// **********************************************************************

class StaminaBar {
    constructor(x, y, stamina = MAX_STAMINA, color){
        this.x = x;
        this.y = y;
        this.height = STAMINA_BAR_HEIGHT; 
        this.width = STAMINA_BAR_WIDTH;
        this.stamina = stamina;
        this.color = color;
    }

    drawStamina = () => { 
        context.strokeStyle = "white";
        context.lineWidth = PLAYER_RADIUS*1/20;
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.stamina, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// **********************************************************************
// Turn Arrow
// **********************************************************************

class TurnArrow{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.color = 'orange';
    }

    drawTurnArrow = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(this.x - PLAYER_RADIUS, this.y - PLAYER_RADIUS*4);
        context.lineTo(this.x + PLAYER_RADIUS, this.y - PLAYER_RADIUS*4);
        context.lineTo(this.x, this.y - PLAYER_RADIUS*3);
        context.closePath();
        context.fill();
    }
}

module.exports = { Arrow, HealthBar, StaminaBar, TurnArrow };
