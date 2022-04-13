// global Variables
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currPos = {x:-1, y:-1};
let lastPos = currPos;
let shapeMode = "line"
let startPos = {x:-1, y:-1};
let shapes = [];
let screens = [];

// default setting
let lineWidth = 2;
let strokeStyle = '#000000'; // black
let fillStyle = '#FFFFFF'; // white
let scaleX = canvas.width / window.innerWidth;
let scaleY = canvas.height / window.innerHeight;

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

    isDrawing = true;
    ctx.beginPath();
    startPos = lastPos;

    // 1. get screen image
    screens.push({screen:ctx.getImageData(0, 0, canvas.width, canvas.height)})
}

function handleDrawEnd() {
    isDrawing = false

    // 2. save drawing info in history array
    if(shapeMode === "circle") {
        shapes.push({
            mode:shapeMode,
            x:startPos.x + (currPos.x-startPos.x)/2,
            y:startPos.y + (currPos.y-startPos.y)/2,
            radius:(currPos.x-startPos.x)/2,
            color: ctx.fillStyle})
    } else if(shapeMode === "triangle") {

    } else if(shapeMode === "rectangle") {
        shapes.push({
            mode:shapeMode,
            x:startPos.x,
            y:startPos.y,
            width:currPos.x-startPos.x,
            height:currPos.y-startPos.y,
            color:ctx.fillStyle})
    }

    lastPos = currPos = startPos = {x:-1, y:-1}
    ctx.closePath()
}

function handleDrawing(event) {
    if(!isDrawing) return;

    if(event.type === 'mousemove') {
        currPos = getMousePos(event)
    } else if(event.type === 'touchmove') {
        currPos = getTouchPos(event)
    }

    switch(shapeMode) {
        case "line":
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = strokeStyle;
            ctx.moveTo(lastPos.x, lastPos.y)
            ctx.lineTo(currPos.x, currPos.y)
            ctx.stroke();
            shapes.push({
                mode:shapeMode,
                startX: lastPos.x,
                startY: lastPos.y,
                endX: currPos.x,
                endY: currPos.y,
                color: ctx.strokeStyle,
                lineWidth: ctx.lineWidth
            }) 
            break;
        case "circle":
            drawAll()
            ctx.beginPath();
            let centerX = startPos.x + (currPos.x-startPos.x)/2;
            let centerY = startPos.y + (currPos.y-startPos.y)/2;
            let radius = (currPos.x-startPos.x)/2
            ctx.arc(centerX, centerY, radius, 0, Math.PI*2, false)
            ctx.stroke();
            break;
        case "triangle":
            break;
        case "rectangle":
            drawAll()
            ctx.strokeRect(startPos.x, startPos.y, currPos.x-startPos.x, currPos.y-startPos.y)
            break;
    }
        
    lastPos = currPos
}

// select draw menu
function selectDraw() {
    document.querySelector('.firstCtrlPanel').style.visibility = "hidden"
    document.querySelector('.secondCtrlPanel').style.visibility = "visible"
}

// select shape
function selectShape(shape) {
    shapeMode = shape
}

// clear canvas and redraw all shapes
function drawAll() {
    // clear canvas
    canvas.width = canvas.width;

    // 1. draw screen image
    if(screens.length > 0)
        ctx.putImageData(screens[screens.length-1].screen, 0, 0)
    /*
    // 2. draw shapes in history array
    for(var i=0; i<shapes.length; i++) {
        var shape = shapes[i]
        if(shape.mode === "line") {
            ctx.lineWidth = shape.lineWidth;
            ctx.strokeStyle = shape.color;
            ctx.moveTo(shape.startX, shape.startY)
            ctx.lineTo(shape.endX, shape.endY)
            ctx.stroke();
        } else if(shape.mode === "circle") {
            ctx.beginPath();
            ctx.fillStyle = shape.color
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI*2, false)
            ctx.stroke();
        } else if(shape.mode === "triangle") {
        } else if(shape.mode === "rectangle") {
            ctx.fillStyle = shape.color
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    }
    */
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