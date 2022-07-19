/**
 * Terrain: Contain map configurations and keep track of the tiles in the map
 */
class Terrain {
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
        console.log(this.height);
        console.log(this.width);
        console.log(this.tiles);

        // Draw on the canvas
        const canvas = document.querySelector('#canvas');
        if (!canvas.getContext) {
            return;
        }
        const ctx = canvas.getContext('2d');
        
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.tiles[i][j] === 1) {
                    ctx.fillStyle = '#3F301D';
                    ctx.fillRect(j,i,1,1);
                } else {
                    ctx.fillStyle = 'aqua';
                    ctx.fillRect(j,i,1,1);
                }
            }
        }

        // Set line stroke and line width
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        // Draw borderline (Later migrate this to game instead)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.height);
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(this.width, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }
}

let d = new Terrain("flat", 200, 100);
d.displayTerrain();