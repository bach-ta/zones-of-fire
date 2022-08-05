import { context } from './constants.js';

export default class Bullet {
    constructor(x, y, bulletAngle, velocity, radius, type='damage') {
        //Bullet position
        this.x = x;
        this.y = y;
        this.bulletAngle = bulletAngle;
        this.velocity = velocity;
        this.radius = radius;
        this.type = type;
        this.color = 'grey';
    }

    drawBullet = () => {
        if (this.type === 'fly') this.color = 'purple';
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        context.fill();
    }
}