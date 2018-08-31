"use strict";

var slider = document.getElementById("range");
var objCount = 400;
var output = document.getElementById("label");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  objCount = this.value;
  output.innerHTML = this.value;
};

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

var dragArea = 200;

var mouseDown;

var colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("touchmove", function(event) {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

//prefent left click
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
  this.exists = true;
}

Object.prototype.update = function() {
  if (this.y < canvas.height) {
    this.dy += 0.4;
  }

  if (this.y + this.radius > canvas.height && this.exists) {
    this.dy = -Math.abs(0.9 * this.dy);
    this.radius--;
    this.hue++;

    if (this.hue > 360) {
      this.hue = 0;
    }

    if (this.radius < 2) {
      this.radius = 30;
      this.y = -30;
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
var toDelete = void 0;

function init() {
  objects = [];
  toDelete = [];

  if (dragArea > canvas.width / 3) {
    dragArea = canvas.width / 3;
  }

  for (var i = 0; i < 400; i++) {
    let radius = randomIntFromRange(10, 30);
    objects.push(
      new Object(
        randomIntFromRange(radius, canvas.width - radius),
        randomIntFromRange(radius, canvas.height - radius),
        radius,
        210
      )
    );
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  console.log(objects.length)
  c.clearRect(0, 0, canvas.width, canvas.height);

  objects.forEach(object => {
    object.update();
  });

  toDelete.forEach(object => {
    object.update();
    object.exists = false;
  });

  if (objects.length < objCount) {
    objects.push(
      new Object(
        Math.random() * canvas.width,
        canvas.height + 50,
        30,
        `${objects[0].hue + (Math.random() - 0.5) * 10}`
      )
    );
    output.style.display = "block";
    output.style.opacity = "1";
  } else if (objects.length > objCount) {
    toDelete.push(objects.pop());
    output.style.display = "block";
    output.style.opacity = "1";
  } else {
    output.style.opacity = "0";
    setTimeout(function() {
      output.style.display = "none";
    }, 500);
  }
  if (toDelete.length > 0) {
    if (toDelete[0].y - 30 > canvas.height) {
      toDelete.shift();
    }
  }
}

init();
animate();
