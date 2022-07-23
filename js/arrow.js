import { ARROW_LENGTH, ARROW_WIDTH } from './constants.js';
import { context } from './game.js';

export default class Arrow{
    constructor(color, length = ARROW_LENGTH, width = ARROW_WIDTH) {
        //Arrow tail position
        this.color = color;
        this.length = length;
        this.width = width;
    }

    drawArrow = (player) => {
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.moveTo(player.x, player.y)
        context.lineTo((player.x + this.length*Math.cos(player.angle)), (player.y + this.length*Math.sin(player.angle)))
        context.stroke();
    }
}