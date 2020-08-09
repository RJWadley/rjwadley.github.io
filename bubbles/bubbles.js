
let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};
let popCount = 0;
let maxRadius = 50;
let mouseHoldTimeout;
let mouseHoldInterval;

//prevent left click (it's problematic)
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

$("canvas").on("mousedown mousemove", function (event) {
    mouse.x = event.originalEvent.x;
    mouse.y = event.originalEvent.y;
});

$("canvas").on("touchstart touchmove", function (event) {
    mouse.x = event.originalEvent.touches[0].clientX;
    mouse.y = event.originalEvent.touches[0].clientY;
});

let handled = false;

$("canvas").on("mousedown touchstart", function (event) {
    event.stopImmediatePropagation();

    let handle = function () {

        if (bubblePop()) {
            try {
                clearTimeout(mouseHoldTimeout);
                clearInterval(mouseHoldInterval);
            } catch (err) {
                console.log("error, probs cool tho")
            }

            mouseHoldTimeout = window.setTimeout(function () {
                mouseHoldInterval = window.setInterval(function () {
                    bubblePop();
                }, 100)
            }, 500);
        } else {
            bubbleBlow();
            mouseHoldTimeout = window.setTimeout(function () {
                mouseHoldInterval = window.setInterval(function () {
                    bubbleBlow();
                }, 100)
            }, 500);
        }
    }

    if (event.type == "touchstart") {
        handled = true;
        handle();
    }
    else if (event.type == "mousedown" && !handled) {
        handle();
    }
    else {
        handled = false;
    }

});

$("canvas").on("mouseup touchend", function (event) {
    try {
        clearTimeout(mouseHoldTimeout);
        clearInterval(mouseHoldInterval);
    } catch (err) {
        console.log("error, probs cool tho")
    }
});

window.addEventListener("resize", function (event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

function distance(x1, y1, x2, y2) {
    let xDist = x2 - x1;
    let yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function bubblePop() {
    let target;
    for (let i = circlesArray.length - 1; i >= 0; i--) {
        let tested = circlesArray[i];
        let clickDist = distance(tested.x, tested.y, mouse.x, mouse.y);
        if (clickDist < tested.radius) {
            circlesArray.splice(i, 1);
            let pop = new Audio('pop.mp3');
            pop.play();
$("#counter").html(circlesArray.length);
            return true;
        }
    }

}

function bubbleBlow() {
    let radius = Math.random() * 80 + 20;
    let x = mouse.x;
    let y = mouse.y;
    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 4;
    circlesArray.push(new Circle(x, y, radius, dx, dy));

$("#counter").html(circlesArray.length);

    let blow = new Audio('blow.mp3');
    blow.play();
}

function Circle(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = r;
    this.hue = Math.random() * 360;

    this.draw = function () {
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 20%)`;
        ctx.lineWidth = 2;
        ctx.fillStyle = `hsl(${this.hue}, 96%, 79%)`;
        ctx.arc(Math.floor(this.x), Math.floor(this.y), this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fill();
    };

    this.update = function () {
        if (this.x + this.radius > innerWidth) {
            this.dx = -Math.abs(this.dx);
        }
        if (this.x - this.radius < 0) {
            this.dx = Math.abs(this.dx);
        }
        if (this.y + this.radius > innerHeight) {
            this.dy = -Math.abs(this.dy);
        }
        if (this.y - this.radius < 0) {
            this.dy = Math.abs(this.dy);
        }

        this.x += this.dx;
        this.y += this.dy;

        this.hue++;
        if (this.hue > 360) {
            this.hue = 0;
        }

        this.draw();
    };
}


let circlesArray = [];

function init() {
    for (let i = 0; i < Math.max(innerHeight / 50, innerWidth / 50); i++) {
        let radius = Math.random() * 80 + 20;
        let x = Math.random() * (innerWidth - 2 * radius) + radius;
        let y = Math.random() * (innerHeight - 2 * radius) + radius;
        let dx = (Math.random() - 0.5) * 4;
        let dy = (Math.random() - 0.5) * 4;
        circlesArray.push(new Circle(x, y, radius, dx, dy));
    }
}

function win() {

    for (let i = 0; i < (innerWidth + innerHeight) / 10; i++) {
        let randomQuad = Math.ceil(Math.random() * 4);
        let radius = Math.random() * 80 + 20;
        let x, y;
        switch (randomQuad) {
            case 1:
                x = Math.random() * (innerWidth - 2 * radius) + radius;
                y = -radius;
                break;
            case 2:
                x = innerWidth + radius;
                y = Math.random() * (innerHeight - 2 * radius) + radius;
                break;
            case 3:
                x = Math.random() * (innerWidth - 2 * radius) + radius;
                y = innerHeight + radius;
                break;
            case 4:
                x = -radius;
                y = Math.random() * (innerHeight - 2 * radius) + radius;
                break;
        }
        let dx = (Math.random() - 0.5) * 4;
        let dy = (Math.random() - 0.5) * 4;
        circlesArray.push(new Circle(x, y, radius, dx, dy));

        $(".win").removeClass("win__show");
        $(".win__button").prop('disabled', true);

        try {
            clearTimeout(blowTons);
            clearInterval(blowTonsInterval);
        } catch (err) {
            console.log("error, probs cool tho")
        }
    }
}

init();

function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
        then = now - elapsed % fpsInterval;

        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i in circlesArray) {
            circlesArray[i].update();
        }

        if (circlesArray.length == 0) {
            console.log("showing now")
            $(".win").addClass("win__show");
            $(".win__button").prop('disabled', false);
        }
    }
}

let fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

startAnimating(60);

setTimeout(function () {
    $("html, body").css("opacity", "1");
    $("html").css("visibility", "visible");
}, 100);


$(".no-way").click(function () {
    history.pushState({}, "sad violin");
    $("iframe").addClass("iframe-show");
})

window.addEventListener('popstate', function(event) {
    // The popstate event is fired each time when the current history entry changes.

    $("iframe").removeClass("iframe-show");

}, false);
