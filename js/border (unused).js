import { context } from "./game.js";

export default class Border{
    constructor(x, y, color = 'red'){
        this.x = x;
        this.y = y;
        this.color = color;
    }
    drawBorder = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, Math.PI*2);
        context.fill();
    }
}