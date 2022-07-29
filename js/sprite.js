import { context } from "./game.js";

export const background = new Image()
background.src = '../Finalbackground.png';

export const foreground = new Image()
foreground.src = '../Finalforeground.png';

export default class Sprite {
    constructor(image, x, y, velocity){
        this.x = x;
        this.y = y;
        this.image = image;
    }

    draw = () => {
        context.drawImage(this.image, this.x, this.y)
    }
}