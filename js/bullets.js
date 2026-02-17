const bullets = [];
let availableAmmo = 2;
let lastSide = "left"; 

setInterval(() => {
    if (availableAmmo < 2) availableAmmo++;
}, 1000);

function shootBullet(p) {
    if (availableAmmo > 0) {
        const offsetX = (lastSide === "left") ? 10 : p.w - 20;
        bullets.push({
            x: p.x + offsetX,
            y: p.y + 10,
            w: 10, h: 20, speed: 7, state: "up", side: lastSide
        });
        lastSide = (lastSide === "left") ? "right" : "left";
        availableAmmo--;
    }
}

function updateBullets(p) {
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        if (b.state === "up") {
            b.y -= b.speed;
            if (b.y < -b.h) b.state = "returning";
        } else if (b.state === "returning") {
            const targetOffsetX = (b.side === "left") ? 10 : p.w - 20;
            const targetX = p.x + targetOffsetX;
            const targetY = p.y + 10;
            
            b.x += (targetX - b.x) * 0.08;
            b.y += (targetY - b.y) * 0.08;
            
            const dist = Math.sqrt(Math.pow(targetX - b.x, 2) + Math.pow(targetY - b.y, 2));
            if (dist < 20) {
                bullets.splice(i, 1);
                availableAmmo = Math.min(2, availableAmmo + 1);
                i--;
            }
        }
    }
}

function drawBullets() {
    if (!window.ctx) return;
    for (const b of bullets) {
        window.ctx.drawImage(window.bulletImg, b.x, b.y, b.w, b.h);
    }
}

window.bullets = bullets;
window.availableAmmo = availableAmmo;
window.shootBullet = shootBullet;
window.updateBullets = updateBullets;
window.drawBullets = drawBullets;   