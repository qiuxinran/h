class Lantern {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lanterns = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createLantern() {
        const x = Math.random() * this.canvas.width;
        this.lanterns.push({
            x,
            y: this.canvas.height + 50,
            speed: 1 + Math.random(),
            size: 30 + Math.random() * 20,
            wobble: Math.random() * Math.PI * 2
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.lanterns.length - 1; i >= 0; i--) {
            const l = this.lanterns[i];
            l.y -= l.speed;
            l.wobble += 0.02;
            l.x += Math.sin(l.wobble) * 0.5;

            if (l.y < -50) {
                this.lanterns.splice(i, 1);
                continue;
            }

            // 绘制孔明灯
            this.ctx.fillStyle = 'rgba(255, 200, 100, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        if (Math.random() < 0.02) {
            this.createLantern();
        }

        requestAnimationFrame(() => this.animate());
    }
} 