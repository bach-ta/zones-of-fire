import Game from './game.js';
import Bullet from './bullet.js';
import { canvas, context } from './game.js';

const game = new Game();
game.loop();

var width = 500, height = 500;
var data32 = new Uint32Array(width * height);
var screen = [];

// Fill with orange color
for(var x = 0; x < width; x++ ){
  screen[x] = [];
  for(var y = 0; y < height; y++ ){
    screen[x][y] = "#ff7700";  // orange to check final byte-order
  }
}

// Flatten array
for(var x, y = 0, p = 0; y < height; y++){
  for(x = 0; x < width; x++) {
    data32[p++] = str2uint32(screen[x][y]);
  }
}

function str2uint32(str) {
  var n = ("0x" + str.substr(1))|0;
  return 0xff000000 | (n << 16) | (n & 0xff00) | (n >>> 16)
}

var idata = new ImageData(new Uint8ClampedArray(data32.buffer), width, height);
canvas.getContext("2d").putImageData(idata, 0, 0);