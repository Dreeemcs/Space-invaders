const player = {
    x: 0,
    y: 0,
    w: 64,
    h: 64,
    speed: 5,
    life: 4
};

function updatePlayer(left, right) {
    if (left) player.x -= player.speed;
    if (right) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.x > window.GAME_WIDTH - player.w) {
        player.x = window.GAME_WIDTH - player.w;
    }
}

function drawPlayer() {
    if (player.life > 0) {
        if (window.ctx && window.playerImg) {
            window.ctx.drawImage(window.playerImg, player.x, player.y, player.w, player.h);
        }
    }
}

window.player = player;
window.updatePlayer = updatePlayer;
window.drawPlayer = drawPlayer;