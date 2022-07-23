import { STAMINA_BAR_HEIGHT, STAMINA_BAR_WIDTH, MAX_STAMINA } from "./constants.js";
import { context } from "./game.js";

export default class StaminaBar {
    constructor(x, y, stamina = MAX_STAMINA, color){
        this.x = x;
        this.y = y;
        this.height = STAMINA_BAR_HEIGHT; 
        this.width = STAMINA_BAR_WIDTH;
        this.stamina = stamina;
        this.color = color;
    }

    drawStamina = () => { 
        context.strokeStyle = "#333";
        context.lineWidth = 3;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.stamina, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}