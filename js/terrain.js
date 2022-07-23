/**
 * Terrain: Contain map configurations and keep track of the tiles in the map
 */
import { canvas, context } from './game.js'

export default class Terrain {
    // Construct initial terrain
    constructor(mode="flat", width, height, fileName="") {
        this.width = width;
        this.height = height;
        this.tiles = [];

        if (mode === "flat") {
            for (let i = 0; i < width; i++) {
                this.tiles[i] = [];
                for(let j = 0; j < height; j++) {
                    if (j < 2*height/3) {
                        this.tiles[i][j] = 0;
                    } else {
                        this.tiles[i][j] = 1;
                    }
                }
            }
        } else if (mode === "random") {
                for (let i = 0; i < height; i++) {
                    let tempArr = []
                    for (let j = 0; j < width; j++) {
                        tempArr[j] = Math.round(Math.random());
                    }
                    this.tiles[i] = tempArr;
                }
        } else if (mode === "custom") {
                // TODO: Read a .txt file and construct a map
        }

        // Construct ImageData object
        this.imageData = this.convertTilesToImageData(this.tiles);
    }

    // Getter
    get getTiles() {
        return this.tiles;
    }

    set setTiles(tiles) {
        this.tiles = tiles;
    }

    /**
     * Display
     */
    drawTerrain = () => {
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

    updateImageData = () => {
        // Update tiles also update image data
        this.imageData = this.convertTilesToImageData(this.tiles);
    }

    /* Helper function */
    convertTilesToImageData = (tiles) => {
        let data32 = new Uint32Array(this.width * this.height);
        let colorMap = [];
        for(let i = 0; i < this.width; i++) {
            colorMap[i] = [];
            for(let j = 0; j < this.height; j++) {
                if (tiles[i][j] === 0) {
                    colorMap[i][j] = "#000000";
                } else {
                    colorMap[i][j] = "#52525C";
                }
            }
        }
        // Flatten array
        for(let x, y = 0, p = 0; y < this.height; y++) {
            for(x = 0; x < this.width; x++) {
                data32[p++] = this.str2uint32(colorMap[x][y]);
            }
        }
        // Construct ImageData object
        return new ImageData(new Uint8ClampedArray(data32.buffer), this.width, this.height);
    }

    str2uint32 = (str) => {
        var n = ("0x" + str.substr(1))|0;
        return 0xff000000 | (n << 16) | (n & 0xff00) | (n >>> 16)
    }
}
