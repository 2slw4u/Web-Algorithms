var canvas = document.getElementById("fieldCanvas");
canvas.width = 500;
canvas.height = 500;

var RADIUS = 10;

var deleteModeOn = false;

document.querySelector('#modeSelector').onclick = function() {
    if (deleteModeOn) {
        document.getElementById('modeSelector').textContent = '🧽 Удалить точки';
        deleteModeOn = false;
    }
    else {
        document.getElementById('modeSelector').textContent = '✏️ Рисовать точки';
        deleteModeOn = true;
    }
}

document.querySelector('#clearCanvas').onclick = function() {
    var clearing = canvas.getContext("2d");
    clearing.clearRect(0, 0, canvas.width, canvas.height);
    circles = [];
}

function getPosition(event) {
    var posX = 0;
    var posY = 0;

    if (!event) var event = window.event;

    if (event.pageX || event.pageY) {
        posX = event.pageX;
        posY = event.pageY;
    }
    else if (event.clientX || event.clientY) {
        posX = event.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posY = event.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }

    return {
        x: posX,
        y: posY
    }
}

function drawCircle(circle, color) {
    var circleDraw = canvas.getContext("2d");
    circleDraw.beginPath();
    circleDraw.arc(circle.x, circle.y, RADIUS, 0, 2 * Math.PI);
    circleDraw.fillStyle = color;
    circleDraw.fill();
}

function circlesDistance(circle1, circle2) {
    return Math.sqrt(Math.pow(circle2.x - circle1.x, 2) + Math.pow(circle2.y - circle1.y, 2)) - RADIUS * 2;
}

function distanceToCircle(x, y, circle) {
    return Math.sqrt(Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2)) - RADIUS;
}

function isNoCirclesNearby(circle) {
    for (let i = 0; i < circles.length; i++) {
        if (circlesDistance(circle, circles[i]) < 0) {
            return false;
        }
    }
    return true;
}

function findSelectedCircle(x, y) {
    for (let i = 0; i < circles.length; i++) {
        if (distanceToCircle(x, y, circles[i]) < 0) {
            return i;
        }
    }
    return -1;
}

function isWithinCanvas(circle) {
    if (circle.x >= RADIUS && canvas.offsetWidth - circle.x >= RADIUS &&
        circle.y >= RADIUS && canvas.offsetHeight - circle.y >= RADIUS) {
        return true;
    }
    return false;
}

function drawOrErase(event) {
    var absoluteX = getPosition(event).x;
    var absoluteY = getPosition(event).y;
    var x = absoluteX - canvas.offsetLeft;
    var y = absoluteY - canvas.offsetTop;

    if (!deleteModeOn) {
        if (isNoCirclesNearby(new Circle(x, y)) && isWithinCanvas(new Circle(x, y))) {
            drawCircle(new Circle(x, y), "black");
            circles.push(new Circle(x, y));
        }
    }
    else {
        var i = findSelectedCircle(x, y);
        if (i >= 0) {
            for (let j = 0; j < 5; j++) {
                drawCircle(circles[i], "white");
            }
            circles.splice(i, 1);
        }
    }
}

function drawStart() {
    document.addEventListener('click', drawOrErase);
    document.addEventListener('mousemove', drawOrErase);
}

function drawStop() {
    document.removeEventListener('mousemove', drawOrErase);
}

document.addEventListener('mousedown', drawStart);
document.addEventListener('mouseup', drawStop);
document.addEventListener('mouseleave', drawStop);