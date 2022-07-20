import { canvas, context } from './game.js';

export default class Bullet {
    constructor(x, y, angle, velocity, radius, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
    }

    drawBullet = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        context.fill();
    }
}