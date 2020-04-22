"use strict";
/*! Fades out the whole page when clicking links */

let list = document.getElementsByTagName('a');
for (let i = 0; i < list.length; i++) {
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
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
let mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
};

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
	let xDist = x2 - x1;
	let yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

// player
function Player(x, y, radius, hue) {
	this.dx = 0;
	this.dy = 0;
	this.x = x;
	this.y = y;
	this.hue = hue;

    this.radius = radius;
    
    this.draw = () => {
        //fill
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = "hsl(" + this.hue + ",100%, 50%)";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
    }

    this.update = () => {
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
            this.radius = 50; //canvas.width * Math.random();
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.hue += 10;
            if (this.hue > 360) {
                this.hue = 0;
            }
        }

        this.draw();
    }

}

// Implementation
let playerCollection;

function newPlayer(hue) {
	playerCollection.push(
		new Player(
			Math.random() * canvas.width,
			Math.random() * canvas.height,
            Math.random() * 100,
            hue
		)
	);
}

function init() {
	playerCollection = [];

    let hue = Math.floor(Math.random() * 360)

	for (let i = 0; i < 100; i++) {
		newPlayer(hue);
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

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		playerCollection.forEach(object => {
			object.update();
		});
	}
}

init();


let fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

function startAnimating(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	animate();
}

startAnimating(60);

setTimeout(function() {
    document.body.className += ' fade-in';
    console.log(document.getElementById("html"))
    document.getElementById("html").style.opacity = "1";
    document.getElementById("html").style.visibility = 'visible';
}, 500);
