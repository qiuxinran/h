class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, isFinal = false) {
        const colors = ['#ff69b4', '#ff1493', '#ff69b4', '#ff8da1', '#ffc0cb', '#ffb6c1'];
        // 烟花上升轨迹
        if (!isFinal) {
            this.particles.push({
                x,
                y: this.canvas.height,
                targetY: y,
                phase: 'rise',
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 10 + Math.random() * 5
            });
            return;
        }

        // 烟花爆炸效果
        const particleCount = 120;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 6 + Math.random() * 4;
            const life = 100 + Math.random() * 50;
            this.particles.push({
                x,
                y,
                phase: 'explode',
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: colors[Math.floor(Math.random() * colors.length)],
                life,
                alpha: 1
            });
        }
    }

    animate() {
        // 使用透明背景清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            if (p.phase === 'rise') {
                // 上升阶段
                p.y -= p.speed;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.fill();

                // 到达目标高度后爆炸
                if (p.y <= p.targetY) {
                    this.particles.splice(i, 1);
                    this.createParticle(p.x, p.y, true);
                }
            } else {
                // 爆炸阶段
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.12;
                p.life--;
                p.alpha = p.life / 100;

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)},${p.alpha})`;
                this.ctx.fill();
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : 
            '255,255,255';
    }

    launchFirework(x) {
        const targetY = this.canvas.height * (0.3 + Math.random() * 0.3);
        this.createParticle(x, targetY);
    }
} 