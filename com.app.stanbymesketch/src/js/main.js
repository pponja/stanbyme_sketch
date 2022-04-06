// global Variables
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currPos = {x:-1, y:-1};
let lastPos = currPos;

// default setting
let lineWidth = 2;
let strokeStyle = '#000000'; // black
let fillStyle = '#FFFFFF'; // white
let scaleX = window.innerWidth / canvas.width;
let scaleY = window.innerHeight / canvas.height;

// get Mouse position
function getMousePos(event) {
    return {
        x: event.clientX * scaleX,
        y: event.clientY * scaleY
    }
}

// get Touch position
function getTouchPos(event) {
    return {
        x: event.touches[0].pageX * scaleX,
        y: event.touches[0].pageY * scaleY
    }
}

// Event Handler function
function handleDrawStart(event) {
    console.log("[main.js] handleDrawStart")
    if(event.type === 'mousedown') {
        lastPos = getMousePos(event)
    } else if(event.type === 'touchstart') {
        lastPos = getTouchPos(event)
    }

    console.log("[main.js] handleDrawStart - x:"+lastPos.x+", y:"+lastPos.y)

    isDrawing = true
}

function handleDrawEnd() {
    isDrawing = false
    lastPos = currPos = {x:-1, y:-1}
    ctx.closePath()
}

function handleDrawing(event) {
    if(!isDrawing) return;

    if(event.type === 'mousemove') {
        currPos = getMousePos(event)
    } else if(event.type === 'touchmove') {
        currPos = getTouchPos(event)
    }

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(currPos.x, currPos.y)
    ctx.stroke()
    
    lastPos = currPos    
}

// initial function
function init() {
    console.log("[main.js] init")

    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', handleDrawStart)
    canvas.addEventListener('touchstart', handleDrawStart)
    canvas.addEventListener('mousemove', handleDrawing)
    canvas.addEventListener('touchmove', handleDrawing)
    canvas.addEventListener('mouseup', handleDrawEnd)
    canvas.addEventListener('touchend', handleDrawEnd)
    canvas.addEventListener('touchcancel', handleDrawEnd)
}

init()