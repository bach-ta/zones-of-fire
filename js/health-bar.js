import { HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, MAX_HEALTH } from "./constants.js";
import { context } from "./game.js";

export default class HealthBar {
    constructor(x, y, health = MAX_HEALTH, color){
        this.x = x;
        this.y = y;
        this.height = HEALTH_BAR_HEIGHT; 
        this.width = HEALTH_BAR_WIDTH;
        this.health = health;
        this.color = color;
    }

    drawHealth = () => {
        context.strokeStyle = "#333";
        context.lineWidth = 3;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.health, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}