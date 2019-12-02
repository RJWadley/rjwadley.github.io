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
var c = canvas.getContext('2d', { alpha: false });


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
addEventListener("mousemove", function() {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("touchmove", function() {
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

// Balls
function Ball(x, y, radius, hue) {
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 0;
  this.radius = radius;
  this.hue = hue;
  this.exists = true;


this.update = function() {
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
    //let distanceTo = distance(this.x, this.y, mouse.x, mouse.y);
    if (((mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2) < (dragArea ** 2)) {
        this.dx += (mouse.x-this.x) * .01;
        this.dy += (mouse.y-this.y) * .02;
    }
  }

  this.y += this.dy;
  this.x += this.dx;
  
  this.dx *= 0.99;

  this.draw();
};


this.draw = function() {
  c.beginPath();
  c.arc(Math.floor(this.x), Math.floor(this.y), this.radius, 0, Math.PI * 2, false);
  c.fillStyle = `hsl(${this.hue}, 100%, 56%)`;
  c.fill();
  c.closePath();
};


}

// Implementation
var balls = void 0;
var toDelete = void 0;

function init() {
  balls = [];
  toDelete = [];

  if (dragArea > canvas.width / 3) {
    dragArea = canvas.width / 3;
  }

  for (var i = 0; i < 400; i++) {
    let radius = randomIntFromRange(10, 30);
    balls.push(
      new Ball(
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
  c.fillStyle = '#000';
  c.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
    ball.update();
  });

  toDelete.forEach(ball => {
    ball.update();
    ball.exists = false;
  });

  if (balls.length < objCount) {
    balls.push(
      new Ball(
        Math.random() * canvas.width,
        canvas.height + 50,
        30,
        `${balls[0].hue + (Math.random() - 0.5) * 10}`
      )
    );
    output.style.display = "block";
    output.style.opacity = "1";
  } else if (balls.length > objCount) {
    toDelete.push(balls.pop());
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
