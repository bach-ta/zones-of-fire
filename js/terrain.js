/**
 * Terrain: Contain map configurations and keep track of the tiles in the map
 */
import { canvas, context } from './game.js'

export default class Terrain {
    /**
     * Construct initial terrain
     */
    constructor(mode="flat", width, height, fileName="") {
        this.width = width;
        this.height = height;
        this.tiles = [];

        switch(mode) {
            case "flat":
                for (let i = 0; i < height; i++) {
                    if (i < 2*height/3) {
                        this.tiles[i] = Array(width).fill(0);
                    } else {
                        this.tiles[i] = Array(width).fill(1);
                    }
                }
                break;
            case "random":
                for (let i = 0; i < height; i++) {
                    let tempArr = []
                    for (let j = 0; j < width; j++) {
                        tempArr[j] = Math.round(Math.random());
                    }
                    this.tiles[i] = tempArr;
                }
                break;
            case "custom":
                // TODO: Read a .txt file and construct a map   
                break;
        }
    }

    /**
     * Display
     */
    displayTerrain() {
        // Draw on the canvas
        if (!canvas.getContext) {
            return;
        }
        
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.tiles[i][j] === 1) {
                    context.fillStyle = '#3F301D';
                    context.fillRect(j,i,1,1);
                } else {
                    context.fillStyle = 'aqua';
                    context.fillRect(j,i,1,1);
                }
            }
        }

        // Set line stroke and line width
        context.strokeStyle = 'black';
        context.lineWidth = 1;

        // Draw borderline (Later migrate this to game instead)
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, this.height);
        context.lineTo(this.width, this.height);
        context.lineTo(this.width, 0);
        context.lineTo(0, 0);
        context.stroke();
    }
}
