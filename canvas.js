"use strict";

/*! Fades out the whole page when clicking links */

let list = document.getElementsByTagName("a");

for (let i = 0; i < list.length; i++) {
    list[i].onclick = function (e) {
        e.preventDefault();
        let newLocation = this.href;

        $(".parallax").addClass("moveup");

        for (let i = 0; i < 4; i++) {
            window.setTimeout(function(){
            $(".wave-bottom").children().eq(i).addClass("moveup-floor");}, i * 100)
        }

        setTimeout(function () {
            window.location = newLocation;
        }, 700);

    }
}

// Utility functions
/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
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

//event listeners

addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Utility Functions
Math.radians = function (degrees) {
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

// circles function
function Circle(x, y, radius, z, hue) {
    this.velocity = {
        x: 10,
        y: -10
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.hue = hue;
    this.mass = Math.PI * radius ** 2;

    this.radius = radius;

    this.draw = () => { //draw circle
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = "hsl(" + this.hue + ",100%, 50%)";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
    }

    this.update = () => {

        //wrapping off screen
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

        //update mass of object;


        circleCollection.forEach(object => {
            let currentDistance = distance(this.x, this.y, object.x, object.y);
            if (currentDistance < object.radius + this.radius) {
                if (currentDistance == 0) {
                    return;
                }

                resolveCollision(object, this);

                this.radius -= 1;
                this.mass = Math.PI * radius ** 2;
                object.radius -= 1;
                object.mass = Math.PI * radius ** 2;

                return;
            }
        });

        this.velocity.x += (Math.random() - 0.6) * 0.05 * this.z;
        this.velocity.y += (Math.random() - 0.3) * 0.05 * this.z;

        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;

        if (this.radius <= 3) {
            this.radius = 50; canvas.width / canvas.height * Math.random();
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.hue += 10;
            if (this.hue > 360) {
                this.hue = 0;
            }
        }

        this.y += this.velocity.y;
        this.x += this.velocity.x;

        this.draw();
    }

}

// Implementation
let circleCollection;

function newCircle(hue) {
    circleCollection.push(
        new Circle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 100,
            Math.random() * 5,
            hue
        )
    );
}

function init() {
    circleCollection = [];

    let hue = Math.floor(Math.random() * 360)

    for (let i = 0; i < Math.max(canvas.width, canvas.height) / 50; i++) {
        newCircle(hue);
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

        circleCollection.forEach(object => {
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

startAnimating(30);

setTimeout(function () {
    document.body.className += " fade-in";
    console.log(document.getElementById("html"))
    document.getElementById("html").style.opacity = "1";
    document.getElementById("html").style.visibility = "visible";
}, 500);
