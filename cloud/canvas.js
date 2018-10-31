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

switch (randomIntFromRange(0,8)) {
  case 0:
    var colors = ["#B7D3F2", "#AFAFDC", "#8A84E2", "#84AFE6", "#79BEEE"];
    break;
  case 1:
    var colors = ["#1A1423", "#60D394", "#AAF683", "#FFD97D", "#FF9B85"];
    break;
  case 2:
    var colors = ["#FFDDE2", "#EFD6D2", "#FF8CC6", "#DE369D", "#6F5E76"];
    break;
  case 3:
    var colors = ["#0FA3B1", "#B5E2FA", "#F9F7F3", "#EDDEA4", "#F7A072"];
    break;
  case 4:
    var colors = ["#CFFCFF", "#AAEFDF", "#9EE37D", "#63C132", "#358600"];
    break;    
  case 5:
    var colors = ["#D72638", "#3F88C5", "#F49D37", "#140F2D", "#F22B29"];
    break;    
  case 6:
    var colors = ["#982649", "#7C8483", "#71A2B6", "#60B2E5", "#53F4FF"];
    break;      
  case 7:
    var colors = ["#1B2F33", "#28502E", "#47682C", "#8C7051", "#EF3054"];
    break;    
   case 8:
    var colors = ["#AF3800", "#FE621D", "#FD5200", "#00CFC1", "#00FFE7"];
    break;    
}


// Event Listeners
addEventListener("mousemove", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("touchmove", function(event) {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

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
  this.color = colors[randomIntFromRange(0, 4)];

  this.move = function(point, angle, unit) {
    var x = point[0];
    var y = point[1];
    var rad = Math.radians(angle % 360);

    this.dx += unit * Math.sin(rad);
    this.dy += unit * Math.cos(rad);
  };

  this.radius = radius;
}

Player.prototype.update = function() {
  let thisDistance = distance(this.x, this.y, mouse.x, mouse.y);

  this.dx += (mouse.x - this.x) * (1 / thisDistance) * 0.1;
  this.dy += (mouse.y - this.y) * (1 / thisDistance) * 0.1;

  this.y += this.dy;
  this.x += this.dx;

  /*if (this.x < this.radius) {
    this.x = this.radius;
  }
  if (this.x > canvas.width - this.radius) {
    this.x = canvas.width - this.radius;
  }
   if (this.y < this.radius) {
    this.y = this.radius;
  }
  if (this.y > canvas.height - this.radius) {
    this.y = canvas.height - this.radius;
  }
*/
  this.dy *= 0.999;
  this.dx *= 0.999;

  this.draw();
};

Player.prototype.draw = function() {
  //fill
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fillStyle = this.color;
  c.lineWidth = 5;
  c.fill();
  c.closePath();
};

// Implementation
var playerCollection = void 0;

function newPlayer() {
  playerCollection.push(
    new Player(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 10
    )
  );
}

function init() {
  playerCollection = [];

  for (let i = 0; i < 500; i++) {
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
