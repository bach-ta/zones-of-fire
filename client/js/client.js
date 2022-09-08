// ******************************************************************************
// Server-client communication
//
// (1)	Client keeps sending game info to server	                        --> in client loop
// (2)	When server receives game info from client, server send to everyone	--> server don’t need to loop
// (3)	Client keeps receiving game info		                            --> in client loop
// (4)	Client renders on screen			                                --> in client loop
// Whenever an event happens on the client side, client changes game info sent at (1)
//
// ******************************************************************************

const getBoard = (canvas) => {
    const ctx = canvas.getContext('2d');

    const fillRect = (x,y,color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 20, 20);
    }
    return { fillRect };
}

const canvas = document.querySelector('#canvas');
const { fillRect } = getBoard(canvas);

// fillRect(50, 50, 'green');

class Test{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    adding = () => {
        this.x += 10;
        this.y += 10;
    }
}

const sock = io();

// Client sends value to server when an event happens
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32){
        sock.emit('message',"okokokok");
    }
});

function loop(){
    const player = new Test(2,2);
    player.adding();
    // Send
    sock.emit("player",player);
    // Receive
    sock.on("player",(player) => {
        console.log(player.x);
    })
    window.requestAnimationFrame(loop);
}
loop();

// Client do something when it receives a value from server
sock.on('message', (text) => {
    console.log(text); // logs 'you are connected'
})
