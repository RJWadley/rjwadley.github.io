"use strict";

/*! Fades out the whole page when clicking links */

var list = document.getElementsByTagName('a');
for (var i = 0; i < list.length; i++) {
  console.log(list[i].id); //second console output
  list[i].onclick = function(e) {
    e.preventDefault();
    let newLocation = this.href;

    document.body.style.opacity = "0";

    setTimeout(function() {
      window.location = newLocation;
    }, 600);

  }
}



// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var radius = 5;
var objectCount = 400;

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
  x: -1000,
  y: -1000 / 2
};

var dragArea = 200;

var mouseDown = true;

var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Event Listeners
addEventListener('mousemove', function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener('touchmove', function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

});

// Utility Functions
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

// Objects
function Object(x, y, radius, hue) {
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 0;
  this.radius = radius;
  this.hue = hue;
}

Object.prototype.update = function() {


  if (this.y < canvas.height) {
    this.dy += 0.4;
  }

  if (this.y + this.radius > canvas.height) {
    this.dy = -Math.abs(0.9 * this.dy);
    this.radius--;
    this.hue++;

    if (this.hue > 360) {
      this.hue = 0;
    }

    if (this.radius < 2) {
      this.radius = radius;
      this.dy = Math.random() * -30;
    }
  }

  if (this.x + this.radius > canvas.width) {
    this.dx = -Math.abs(10 + this.dx);
  } else if (this.x - this.radius < 0) {
    this.dx = Math.abs(10 + this.dx);
  }

  if (mouseDown) {
    let distanceTo = distance(this.x, this.y, mouse.x, mouse.y);
    if (distanceTo < dragArea) {
      if (this.x > mouse.x) {    
        this.dx += 2;
      } else if (this.x < mouse.x) {    
        this.dx -= 2;
      }
      if (this.y > mouse.y) {    
        this.dy += 2;
      } else if (this.y < mouse.y) {    
        this.dy -= 2;
      }
    }
  }

  this.y += this.dy;
  this.x += this.dx;

   
  this.dx *= 0.99;

  this.draw();

};

Object.prototype.draw = function() {
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fillStyle = `hsl(${this.hue}, 100%, 56%)`;
  c.fill();
  c.closePath();
};

// Implementation
var objects = void 0;
var startHue = Math.random() * 360;

function init() {
  objects = [];

  if (dragArea > canvas.width / 3) {
    dragArea = canvas.width / 3;
  }

  for (var i = 0; i < objectCount; i++) {


    objects.push(new Object(randomIntFromRange(radius, canvas.width - radius), randomIntFromRange(radius, canvas.height - radius), radius, startHue));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  objects.forEach(object => {
    object.update();
  });
}

init();
animate();