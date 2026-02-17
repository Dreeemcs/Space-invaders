const enemies = [];
const enemyBullets = [];

function createEnemy() {
    const size = 40;
    enemies.push({
        x: Math.random() * (window.GAME_WIDTH - size),
        y: -size,
        targetY: Math.random() * 200 + 50, 
        w: size,
        h: size,
        speed: 2,
        life: 3,
        lastShot: Date.now()
    });
}

function updateEnemies(p) {
    const now = Date.now();

    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];

        if (e.y < e.targetY) {
            e.y += e.speed;
        } else {
            if (now - e.lastShot > 2500) {
                enemyBullets.push({ 
                    x: e.x + e.w/2 - 5, y: e.y + e.h, w: 10, h: 10, speed: 4 
                });
                e.lastShot = now;
            }
        }

        for (let j = 0; j < bullets.length; j++) {
            const b = bullets[j];
            if (b.state === "up" && rectsCollide(e, b)) {
                e.life--;
                bullets.splice(j, 1);
                j--;
                if (e.life <= 0) {
                    enemies.splice(i, 1);
                    window.score += 100;
                    i--;
                    break;
                }
            }
        }
    }

    for (let k = 0; k < enemyBullets.length; k++) {
        const eb = enemyBullets[k];
        eb.y += eb.speed;

        if (p.life > 0 && rectsCollide(eb, p)) {
            p.life--;
            enemyBullets.splice(k, 1);
            k--;
            continue;
        }

        if (eb.y > window.GAME_HEIGHT) {
            enemyBullets.splice(k, 1);
            k--;
        }
    }
}

function drawEnemies() {
    if (!window.ctx) return;

    for (const e of enemies) {
        window.ctx.drawImage(window.enemyImg, e.x, e.y, e.w, e.h);
    }
    
    window.ctx.fillStyle = "red";
    for (const eb of enemyBullets) {
        window.ctx.fillRect(eb.x, eb.y, eb.w, eb.h);
    }
}

window.enemies = enemies;
window.createEnemy = createEnemy;
window.updateEnemies = updateEnemies;
window.drawEnemies = drawEnemies;