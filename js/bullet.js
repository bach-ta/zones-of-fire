import { canvas, context } from './game.js';

export default class Bullet {
    constructor(x, y, bulletAngle, velocity, radius, color) {
        //Bullet position
        this.x = x;
        this.y = y;
        this.bulletAngle = bulletAngle;
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