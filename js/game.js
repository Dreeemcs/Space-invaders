const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");



const playerImg = new Image();
playerImg.src = "img/player.png";

const bulletImg = new Image();
bulletImg.src = "img/shot.svg";
let canShoot = true;

const player = {
  x: 400,
  y: 500,
  w: 64,
  h: 64
};

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  player.y = canvas.height - 90;

  if (player.x > canvas.width - player.w)
    player.x = canvas.width - player.w;

}

window.addEventListener("resize", resize);
resize();

const bullets = [];
const stars = [];

for (let i = 0; i < 120; i++){
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.5 + 0.2
  });
}

let left = false;
let right = false;

player.speed = 5;


function drawBackground(){
  ctx.fillStyle = "#05060f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);  

  ctx.fillStyle = "white";

  for (let s of stars){
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    s.y += s.speed;

    if (s.y > canvas.height){
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  }
}


function loop() {

  drawBackground();

  if (left) player.x -= player.speed;
  if (right) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.w) {
    player.x = canvas.width - player.w;
  }

  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i];

    if (b.state === "up") {
      b.y -= b.speed;

      if (b.y <= 0) {
        b.y = 0;
        b.state = "stop";
      }
    } 
    else if (b.state === "back") {
      b.y += b.speed;

      if (b.y >= player.y) {
        bullets.splice(i, 1);
        i--;
        continue;
      }
    }

    ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h);
  }

  if (bullets.length === 2 && bullets.every(b => b.state === "stop")) {
    for (const b of bullets) {
      b.state = "back";
    }
  }

  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  requestAnimationFrame(loop);
}


document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') left = true;
  if (e.code === 'ArrowRight') right = true;

  if (e.code === 'Space' && canShoot && bullets.length < 2) {

    bullets.push({
      x: player.x + player.w / 2 - 4,
      y: player.y,
      w: 8,
      h: 16,
      speed: 8,
      state: "up"
    });

    canShoot = false;
    setTimeout(() => {
      canShoot = true;
    }, 250);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') left = false;
  if (e.code === 'ArrowRight') right = false;
});

playerImg.onload = () => {
  loop();
};
