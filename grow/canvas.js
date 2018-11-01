
    var canvas = document.querySelector("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var c = canvas.getContext("2d");
    /*s
    c.fillStyle = "pink";
    c.fillRect(100, 100, 100, 100);
    c.fillStyle = "dodgerblue";
    c.fillRect(500, 400, 60, 40);
    c.fillStyle = "orange";
    c.fillRect(200, 500, 200, 89)
    //line

    c.beginPath();
    c.moveTo(50,100);
    c.lineTo(300,300);
    c.lineTo(100,50);
    c.lineTo(100,500);
    c.strokeStyle = 'blue';
    c.stroke();

    //arc
    var circle = function(x, y, r) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2, false);
      c.stroke();
    };

    c.strokeStyle = "green";
    circle(300,400,50);

    for (let i = 0; i < 1000; i++) {
      c.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
      circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 30);
    }
    */

addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

    let maxRadius = 50;

    let mouse = {
      x: undefined,
      y: undefined
    };

    window.addEventListener("mousemove", function(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });



    function Circle(x, y, r, dx, dy) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.permRadius = r;
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
        if (this.x > canvas.width - this.radius) {
          this.dx = -Math.abs(this.dx);
        }

        if (this.x < this.radius) {
          this.dx = Math.abs(this.dx);
        }
        
           if (this.y > canvas.height - this.radius) {
          this.dy = -Math.abs(this.dy);
        }

        if (this.y < this.radius) {
          this.dy = Math.abs(this.dx);
        }

        
        this.x += this.dx;
        this.y += this.dy;

        this.hue++;
        if (this.hue > 360) {
          this.hue = 0;
        }

        //interactivity

        if (
          mouse.x - this.x < 100 &&
          mouse.x - this.x > -100 &&
          mouse.y - this.y < 100 &&
          mouse.y - this.y > -100
        ) {

          if (this.radius < this.permRadius) {
            this.radius += 2;
          }
        } else if (this.radius > this.permRadius/10) {
          this.radius -= 2;
        }

        this.draw();
      };
    }

    let circle = new Circle(200, 200, 30, 3, 3);

    let circlesArray = [];

    for (let i = 0; i < ((innerWidth + innerHeight) / 2 / 2); i++) {
      let radius = Math.random() * 80 + 20;
      let x = Math.random() * (innerWidth - 2 * radius) + radius;
      let y = Math.random() * (innerHeight - 2 * radius) + radius;
      let dx = (Math.random() - 0.5) * 10;
      let dy = (Math.random() - 0.5) * 10;
      new Circle(200, 200, 30, 3, 3);
      circlesArray.push(new Circle(x, y, radius, dx, dy));
    }

    function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, innerWidth, innerHeight);

      circle.update();

      for (let i in circlesArray) {
        circlesArray[i].update();
      }
    }

    animate();