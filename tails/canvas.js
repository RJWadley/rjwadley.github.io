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
})


addEventListener("touchmove", function(event) {
	mouse.x = event.touches[0].clientX;
	mouse.y = event.touches[0].clientY;
})

addEventListener("click", function() {
	circlesArray.forEach(object => {
		object.x = mouse.x + 5 - Math.random() * 10;
		object.y = mouse.y + 5 - Math.random() * 10;
		object.dx = Math.random() * 10 - 5;
		object.dy = Math.random() * 10 - 5;
	});

});

addEventListener("resize", function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});


function Circle(x, y, r, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = r;
	this.hue = Math.random() * 360;

	this.draw = function() {
		c.beginPath();
		//c.strokeStyle = `hsl(${this.hue}, 100%, 20%)`;
		c.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		//c.stroke();
		c.fill();
	};

	this.update = function() {

		if (this.x > canvas.width) {
			this.dx = -Math.abs(this.dx);
		}
		if (this.y > canvas.height) {
			this.dy = -Math.abs(this.dy);
		}		
		if (this.x < 0) {
			this.dx = Math.abs(this.dx);
		}
		if (this.y < 0) {
			this.dy = Math.abs(this.dy);
		}


		this.x += this.dx;
		this.y += this.dy;
		
		let FRICTION_SPEED = 5;
		let MAX_SPEED = 7;
		let MIN_SPEED = 1;
		
		if (this.dx > FRICTION_SPEED || this.dy > FRICTION_SPEED) {
			this.dx *= 0.9;
			this.dy *= 0.9;
		}

		if (this.dx > MAX_SPEED || this.dy > MAX_SPEED) {
			this.dx = MAX_SPEED;
			this.dy = MAX_SPEED;
		}
		
		if (this.dx < MIN_SPEED || this.dy < MIN_SPEED) {
			this.dx *= 1.01;
			this.dy *= 1.01;
		}

		this.hue++;
		if (this.hue > 360) {
			this.hue = 0;
		}
		

		this.draw();
	};
}

function init() {
for (let i = 0; i < ((innerWidth + innerHeight) / 2 / 2); i++) {
	let radius = Math.random() + 2;
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
	c.fillStyle = "rgba(0, 0, 0, 0.05)";
    c.fillRect(0, 0, canvas.width, canvas.height);

	circlesArray.forEach(object => {
		object.update();
	});
	
}

animate();