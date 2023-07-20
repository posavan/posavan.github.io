const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let ballColor = "#0095DD";
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let count = 0;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let lives = 3;
let score = 0;

// generate brick array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    };
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// change color of ball
function changeColor(c){
    if(c === 0)
        ballColor = "#0095DD";
    else if(c === 1)
        ballColor = "red";
    else if(c === 2)
        ballColor = "yellow";
    else if(c === 3)
        ballColor = "gray";
    else if(c === 4) {
        ballColor = "green";
        count = 0;
    };
};

// move paddle with keys
function keyDownHandler(e) {
    if(e.key === 'Right' || e.key === "ArrowRight")
        rightPressed = true;
    else if (e.key === 'Left' || e.key === "ArrowLeft")
        leftPressed = true;
};

function keyUpHandler(e) {
    if(e.key === 'Right' || e.key === "ArrowRight")
        rightPressed = false;
    else if (e.key === 'Left' || e.key === "ArrowLeft")
        leftPressed = false;
};

// move paddle with mouse
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    };
};

// colliding with bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && y > b.y &&
                        x < b.x + brickWidth &&
                        y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    changeColor(count++);
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    };
                };
            };
        };
    };
};

// draws score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(`Score: ${score}`, 8, 20);
};

// track lives
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
};

// create ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
};

// create paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

// create bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            };
        };
    };
};

// draw paddle and ball
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    };

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        changeColor(count++);
    } if (y + dy < ballRadius) {
        dy = -dy;
        changeColor(count++);
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            changeColor(count++);
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            };
        };
    };

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
};

draw();
