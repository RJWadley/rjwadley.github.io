"use strict";

// Initial Setup
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

var mouseDown;

var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;

// Event Listeners
addEventListener("mousemove", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("touchmove", function(event) {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

document.onkeydown = checkKey;

//keydown handler
function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "38" || e.keyCode == "87") {
    // up arrow
    upPressed = true;
  } else if (e.keyCode == "40" || e.keyCode == "83") {
    // down arrow
    downPressed = true;
  } else if (e.keyCode == "37" || e.keyCode == "65") {
    // left arrow
    leftPressed = true;
  } else if (e.keyCode == "39" || e.keyCode == "68") {
    // right arrow
    rightPressed = true;
  }
}

//keyup handler
document.onkeyup = function(e) {
  {
    e = e || window.event;

    if (e.keyCode == "38" || e.keyCode == "87") {
      // up arrow
      upPressed = false;
    } else if (e.keyCode == "40" || e.keyCode == "83") {
      // down arrow
      downPressed = false;
    } else if (e.keyCode == "37" || e.keyCode == "65") {
      // left arrow
      leftPressed = false;
    } else if (e.keyCode == "39" || e.keyCode == "68") {
      // right arrow
      rightPressed = false;
    }
  }
};

//prevent left click
document.addEventListener(
  "contextmenu",
  function(e) {
    e.preventDefault();
  },
  false
);

addEventListener("mousedown", function() {
  mouseDown = true;
});

addEventListener("mouseup", function() {
  mouseDown = false;
});

addEventListener("touchstart", function() {
  console.log("touchstart");
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
  mouseDown = true;
});

addEventListener("touchend", function() {
  console.log("touchend");
  mouseDown = false;
});

addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

// Utility Functions
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

this.move = function(point, angle, unit) {
  var x = point[0];
  var y = point[1];
  var rad = Math.radians(angle % 360);

  this.x += unit * Math.sin(rad);
  this.y += unit * Math.cos(rad);
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
window.onerror = function(msg, url, linenumber) {
  document.write(
    "Error message: " + msg + "\nURL: " + url + "\nLine Number: " + linenumber
  );
  return true;
};

// player
function Player(x, y, radius) {
  this.dx = 0;
  this.dy = 0;
  this.x = x;
  this.y = y;
  this.hue = Math.random() * 360;

  this.radius = radius;
}

Player.prototype.update = function() {
  if (upPressed) {
    this.dy--;
  }
  if (downPressed) {
    this.dy++;
  }
  if (leftPressed) {
    this.dx--;
  }
  if (rightPressed) {
    this.dx++;
  }

  this.y += this.dy / this.radius * 10;
  this.x += this.dx / this.radius * 10;

  if (this.x < 0 - this.radius) {
    this.x = canvas.width - 10 + this.radius;
  }
  if (this.x > canvas.width + this.radius) {
    this.x = -this.radius + 10 //canvas.width - this.radius;
  }
   if (this.y < 0 - this.radius) {
    this.y = canvas.height - 10 + this.radius;
  }
  if (this.y > canvas.height + this.radius) {
    this.y = -this.radius + 10 //canvas.width - this.radius;
  }

  playerCollection.forEach(object => {
    let currentDistance = distance(this.x, this.y, object.x, object.y);
    if (currentDistance < object.radius + this.radius) {
      if (currentDistance == 0) {
        return;
      }
      this.radius--;
      return;
    }
  });

  this.dx += (Math.random() - 0.6);
  this.dy += (Math.random() - 0.3);

  this.dx *= 0.9;
  this.dy *= 0.9;

  if (this.radius <= 3) {
    this.radius = 50;//canvas.width * Math.random();
    this.x = mouse.x; Math.random() * canvas.width;
    this.y = mouse.y;Math.random() * canvas.height;
    this.hue += 10;
    if (this.hue > 360) {
      this.hue = 0;
    }
  }

  this.draw();
};

Player.prototype.draw = function() {
  //fill
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.strokeStyle = "hsl(" + this.hue + ",100%, 50%)";
  c.lineWidth = 5;
  c.stroke();
  c.closePath();
};

// Implementation
var playerCollection = void 0;

function newPlayer() {
  playerCollection.push(
    new Player(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 100
    )
  );
}

function init() {
  playerCollection = [];

  for (let i = 0; i < 100; i++) {
    newPlayer();
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {
    then = now - elapsed % fpsInterval;

    c.clearRect(0, 0, canvas.width, canvas.height);

    playerCollection.forEach(object => {
      object.update();
    });
  }
}

init();
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

startAnimating(60);
