var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

var mouse = {
	x: undefined,
	y: undefined
};

var circlesArray = [];

// Event Listeners
addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("mousedown", function() {
	if (player.radius > 4) {
        let radius = Math.random() * 80 + 20;
        let x = Math.random() * (innerWidth - 2 * radius) + radius;
        let y = Math.random() * (innerHeight - 2 * radius) + radius;
        let dx = (Math.random() - 0.5) * 10;
        let dy = (Math.random() - 0.5) * 10;
        if (((player.x - x) ** 2 + (player.y - y) ** 2) < ((radius + player.radius) ** 2)) {
            x += player.radius * 2;
        }
        new Circle(200, 200, 30, 3, 3);
        circlesArray.push(new Circle(x, y, radius, dx, dy));
        player.circumference -= 1;
    }
});

addEventListener("touchstart", function(event) {
	mouse.x = event.touches[0].clientX;
	mouse.y = event.touches[0].clientY;
});

addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("touchmove", function(event) {
	mouse.x = event.touches[0].clientX;
	mouse.y = event.touches[0].clientY;
});

addEventListener("resize", function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

function distance(x1, y1, x2, y2) {
	var xDist = x2 - x1;
	var yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

window.addEventListener("mousemove", function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

function Circle(x, y, r, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = r / 10;
	this.hue = Math.random() * 360;

	this.draw = function() {
		c.beginPath();
		c.strokeStyle = `hsl(${this.hue}, 100%, 20%)`;
		c.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.stroke();
		c.fill();
	};

	this.update = function() {
		if (this.x > canvas.width - this.radius + player.radius + this.radius*2) {
			this.dx = -Math.abs(this.dx);
		}

		if (this.x < this.radius - player.radius - this.radius*2) {
			this.dx = Math.abs(this.dx);
		}

		if (this.y > canvas.height - this.radius + player.radius + this.radius*2) {
			this.dy = -Math.abs(this.dy);
		}

		if (this.y < this.radius - player.radius - this.radius*2) {
			this.dy = Math.abs(this.dx);
		}


		this.x += this.dx;
		this.y += this.dy;

		this.hue++;
		if (this.hue > 360) {
			this.hue = 0;
        }

        this.dx += Math.random() * 1 - 0.5;
        this.dy += Math.random() * 1 - 0.5;

        if (((player.x - this.x) ** 2 + (player.y - this.y) ** 2) < ((this.radius * 2 + player.radius + 50) ** 2)) {
            this.dx -= (player.x-this.x) * .01;
            this.dy -= (player.y-this.y) * .01;
        }

        if (Math.abs(this.dx) > 5 || Math.abs(this.dy) > 5) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }

        if (Math.abs(this.dx) < 1 || Math.abs(this.dy) < 1) {
            this.dx *= 1.1;
            this.dy *= 1.1;
        }

		this.draw();
	};
}

let player = new Circle(200, 200, 30, 0, 0);

player.velocityPercent = 0.5;
player.circumference = 10;

player.update = function() {

    //this.velocityPercent = 4 / this.radius;

	//movement and velocity
	if (this.y > mouse.y) {
		this.dy = Math.abs(this.y - mouse.y) * -this.velocityPercent;
	} else if (this.y < mouse.y) {
		this.dy = Math.abs(this.y - mouse.y) * this.velocityPercent;
	} else if (this.y == mouse.y) {
		this.dy = 0;
	}
	this.y += this.dy;

	if (this.x > mouse.x) {
		this.dx = Math.abs(this.x - mouse.x) * -this.velocityPercent;
	} else if (this.x < mouse.x) {
		this.dx = Math.abs(this.x - mouse.x) * this.velocityPercent;
	} else if (this.x == mouse.x) {
		this.dx = 0;
	}
	this.x += this.dx;

      for (let i in circlesArray) {
		let currentDistance = distance(this.x, this.y, circlesArray[i].x, circlesArray[i].y);
		if (currentDistance < circlesArray[i].radius + this.radius) {
			if (currentDistance == 0) {
				return;
			}
			circlesArray[i].radius--;

			if (circlesArray[i].radius < 2) {
				  circlesArray.splice(i, 1);
                  this.circumference += 0.1;
                  this.radius = (this.circumference ** 2/(4*3.14));
			}

		}
      }

    if (circlesArray.length < 1) {
        player.circumference = -10;
        init();
        for (let i in circlesArray) {
            circlesArray[i].x = player.x;
            circlesArray[i].y = player.y;
        }
        window.setTimeout(function(){
            player.circumference = 10;
        },2000)
    }

	this.draw();
};

function init() {
    for (let i = 0; i < ((innerWidth + innerHeight) / 2 / 2); i++) {
        let radius = Math.random() * 80 + 20;
        let x = Math.random() * (innerWidth - 2 * radius) + radius;
        let y = Math.random() * (innerHeight - 2 * radius) + radius;
        let dx = (Math.random() - 0.5) * 10;
        let dy = (Math.random() - 0.5) * 10;
        new Circle(200, 200, 30, 3, 3);
        circlesArray.push(new Circle(x, y, radius, dx, dy));
    }
}

init();

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	circlesArray.forEach(object => {
		object.update();
	});

		player.update();
}

animate();