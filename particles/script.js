// Constants

const C = document.getElementById('canvas');
C.width = innerWidth;
C.height = innerHeight;
let ctx = C.getContext('2d');
let mouse = {
    x : -1000,
    y : -1000
};

let colors = [
    '#324D5C',
    '#46B29D',
    '#F0CA4D',
    '#E37B40',
    '#DE5B49'
];

// Event Listeners

addEventListener('touchstart', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
})

addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
})

addEventListener('touchend', function(event){
    mouse.x = -1000;
    mouse.y = -1000;
})

addEventListener('mousemove', function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

addEventListener('resize', function(event){
    C.width = innerWidth;
    C.height = innerHeight;

    // Clear and redraw everything on resize
    //init();
})

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

function randomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1) ** 2 + (y2-y1) ** 2);
}

function randomArrayIndex(arr){
    // Takes an array as input and returns an random index of that array
    return( arr[Math.floor( Math.random() * arr.length )] );
}

// Object

function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random()-.5) *5,
        y: (Math.random()-.5) *5
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;

    this.update = particles => {

        //collision detection
        for (let i = 0; i < particles.length; i++) {

            if (this === particles[i]) continue;

            if (distance(this.x, this.y, particles[i].x, particles[i].y) < this.radius + particles[i].radius) {
                resolveCollision(this, particles[i]);
            }
        }

        //mouse

        if (distance(this.x, this.y, mouse.x, mouse.y) < 200) {
            this.opacity = Math.min(this.opacity += 0.02, 0.5);

        } else {
            this.opacity = Math.max(this.opacity -= 0.02, 0);
        }
        
        //edges
        if (this.x < this.radius) this.velocity.x = Math.abs(this.velocity.x)
        if (this.x > innerWidth - this.radius) this.velocity.x = -Math.abs(this.velocity.x)
        if (this.y < this.radius) this.velocity.y = Math.abs(this.velocity.y)
        if (this.y > innerHeight - this.radius) this.velocity.y = -Math.abs(this.velocity.y)

        //movement
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.draw();
    }

    this.draw = () => {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();

    }
}

// Init

let particles

function init() {
    // Clear all and reset
    
    particles = []

    let check = 0;


    for (let i=0; i < 400; i++) {
        let radius = 15;// + Math.round((Math.random()-.5) * 10);
        let x = randomIntRange(radius, innerWidth - radius);
        let y = randomIntRange(radius, innerHeight - radius);
        const color = randomArrayIndex(colors);

        check = 0;

        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (distance(x, y, particles[j].x, particles[j].y) < radius * 2) {
                    check++;
                    if (check > 100) {
                        console.log("I can't find a place for this. Skipping.");
                        continue;
                    }
                    let x = randomIntRange(radius, innerWidth - radius);
                    let y = randomIntRange(radius, innerHeight - radius);
                    j = -1;
                }
            }
        }

        if (check < 100) {
            particles.push(new Particle(x,y,radius,color));

        }
    }

};

// Animation loop

function draw() {
    // clear canvas
    ctx.clearRect(0,0, C.width, C.height);

	//ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw on canvas
    particles.forEach(particle => {
        particle.update(particles);
    })

    // loop
    requestAnimationFrame(draw);
}


init();
draw();