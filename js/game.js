let gameStarted = false;
let loopStarted = false;
let startTime = 0;
window.score = 0;

const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const playerImg = new Image(); playerImg.src = "img/player.png";
const enemyImg = new Image(); enemyImg.src = "img/125.png";
const bulletImg = new Image(); bulletImg.src = "img/shot.svg";

window.ctx = ctx;
window.GAME_WIDTH = GAME_WIDTH;
window.GAME_HEIGHT = GAME_HEIGHT;
window.playerImg = playerImg;
window.enemyImg = enemyImg;
window.bulletImg = bulletImg;

function resizeCanvas() {
  const scaleX = window.innerWidth / GAME_WIDTH;
  const scaleY = window.innerHeight / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  canvas.style.width = GAME_WIDTH * scale + "px";
  canvas.style.height = GAME_HEIGHT * scale + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const stars = [];
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.5 + 0.2
  });
}

function drawBackground() {
  ctx.fillStyle = "#05060f";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = "white";
  for (const s of stars) {
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    s.y += s.speed;
    if (s.y > GAME_HEIGHT) { s.y = 0; s.x = Math.random() * GAME_WIDTH; }
  }
}

function drawHUD() {
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    ctx.fillText(`TEMPO: ${elapsed}s`, 20, 40);
    ctx.fillText(`SCORE: ${window.score}`, 20, 70);
    
    if (window.availableAmmo === 0) ctx.fillStyle = "red";
    ctx.fillText(`MUNIÇÃO: ${window.availableAmmo}`, 20, 100);

    if (window.player) {
        ctx.fillStyle = (window.player.life <= 1) ? "red" : "white";
        ctx.fillText(`VIDAS: ${window.player.life}`, 20, 130);
    }
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    ctx.fillStyle = "red";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score Final: ${window.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
    ctx.fillText("Pressione F5 para reiniciar", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
}

let left = false, right = false, canShoot = true;

document.addEventListener("keydown", e => {
  if (!gameStarted || (window.player && window.player.life <= 0)) return;
  if (e.code === "ArrowLeft") left = true;
  if (e.code === "ArrowRight") right = true;
  
  if (e.code === "Space" && canShoot) {
    shootBullet(window.player);
    canShoot = false;
    setTimeout(() => canShoot = true, 200);
  }
});

document.addEventListener("keyup", e => {
  if (e.code === "ArrowLeft") left = false;
  if (e.code === "ArrowRight") right = false;
});

setInterval(() => {
  if (gameStarted && window.player && window.player.life > 0) createEnemy();
}, 3000);

function startGame() {
  if (loopStarted) return;
  
  if (window.player) {
      window.player.x = GAME_WIDTH / 2 - 32;
      window.player.y = GAME_HEIGHT - 80;
      window.player.life = 4;
  }

  window.score = 0;
  gameStarted = true;
  loopStarted = true;
  startTime = Date.now();
  requestAnimationFrame(loop);
}
window.startGame = startGame;

function loop() {
  if (!gameStarted) return;

  drawBackground();
  
  if (window.player && window.player.life > 0) {
      updatePlayer(left, right);
      drawPlayer();
      
      updateBullets(window.player);
      drawBullets();
      
      updateEnemies(window.player); 
      drawEnemies();
      
      drawHUD();
  } else {
      drawPlayer();
      drawEnemies();
      drawGameOver();
  }
  
  requestAnimationFrame(loop);
}

playerImg.onload = () => { drawBackground(); };