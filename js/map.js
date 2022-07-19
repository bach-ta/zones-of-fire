/**
 * Map: Contain map configurations and keep track of the tiles in the map
 */
class Map {
    /**
     * Construct flattened or random map
     */
    constructor(mode, height, width) {
        this.height = height
        this.width = width 
        this.tiles = []

        if (mode === "flat") {
            for (let i = 0; i < height; i++) {
                if (i < height/2) {
                    this.tiles[i] = Array(width).fill(1)
                } else {
                    this.tiles[i] = Array(width).fill(0)
                }
            }
        } else if (mode == "random") {
            for (let i = 0; i < height; i++) {
                let tempArr = []
                for (let j = 0; j < width; j++) {
                    tempArr[j] = Math.round(Math.random());
                }
                this.tiles[i] = tempArr;
            }  
        }
    }

    /**
     * Read a .txt file and construct a map
     * @param {*} fileName Directory of the input file
     */
    constructor(fileName) {
        // TODO: Read and parse .txt file to tiles
    }
}