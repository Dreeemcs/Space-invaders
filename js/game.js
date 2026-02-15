const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const playerImg = new Image();
playerImg.src = "img/player.png";

const enemyImg = new Image();
enemyImg.src = "img/125.png";

const bulletImg = new Image();
bulletImg.src = "img/shot.svg";
let canShoot = true;

const player = {
  x: GAME_WIDTH / 2 - 32,
  y: GAME_HEIGHT - 64 - 20,
  w: 64,
  h: 64
};

function resizeCanvas(){
const scaleX = window.innerWidth / GAME_WIDTH;
const scaleY = window.innerHeight / GAME_HEIGHT;
const scale = Math.min(scaleX, scaleY);

canvas.style.width = GAME_WIDTH * scale + "px";
canvas.style.height = GAME_HEIGHT * scale + "px";

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawnEnemy(){
  enemies.push ({
    x: Math.random() * (GAME_WIDTH - 40),
    y: -40,
    w: 40,
    h: 40,
    speed: 1.5,
    life: 3
  });
}



const bullets = [];
const stars = [];
const enemies = [];


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


setInterval(spawnEnemy, 1200);

function rectsCollide(a, b){
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
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
  for (let i = 0; i < enemies.length; i++){
    const e = enemies[i];

    e.y += e.speed;
    
    if (rectsCollide(e, b)) {

      e.life--;
      bullets.splice(j, 1);
      j--;

      if (e.life <= 0){
        enemies.splice(i, 1);
        i--;
        break;
      }
    }

    if (!enemies[i]) continue;
    
    ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);

    if (e.y > GAME_HEIGHT + e.h){
      enemies.splice(i, 1);
      i--;


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
