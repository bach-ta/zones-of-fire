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

        // TEMPORARY FIXED COLOR MAP
        let data32 = new Uint32Array(this.width * this.height);
        let colorMap = [];

        for(let x = 0; x < width; x++ ){
            colorMap[x] = [];
            for(var y = 0; y < height; y++ ){
                if (y < 2*height/3) {
                    colorMap[x][y] = "#00FFFF";
                } else {
                    colorMap[x][y] = "#3F301D";
                }
            }
          }

        // Flatten array
        for(let x, y = 0, p = 0; y < this.height; y++){
            for(x = 0; x < this.width; x++) {
                data32[p++] = this.str2uint32(colorMap[x][y]);
            }
        }

        // Construct ImageData object
        this.imageData = new ImageData(new Uint8ClampedArray(data32.buffer), this.width, this.height);

        // for (let i = 0; i < this.imageData.data.length; i++) {
        //     let row = Math.round(i/this.width);
        //     let col = Math.round(i%this.width);
        //     this.imageData.data[i] = this.tiles[row][col];
        // }
    }

    /**
     * Display
     */
    drawTerrain() {
        // Draw on the canvas
        if (!canvas.getContext) {
            return;
        }

        // Draw terrain
        context.putImageData(this.imageData, 0, 0);

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

    /* Helper function */
    str2uint32(str) {
        var n = ("0x" + str.substr(1))|0;
        return 0xff000000 | (n << 16) | (n & 0xff00) | (n >>> 16)
    }
}
