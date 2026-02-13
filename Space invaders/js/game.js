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

const bullets = [];

let left = false;
let right = false;

player.speed = 5;


function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (left) player.x -= player.speed;
  if (right) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.w)
    player.x = canvas.width - player.w;

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
}

