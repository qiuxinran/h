document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有画布
    const fireworksCanvas = document.getElementById('fireworks');
    const lanternsCanvas = document.getElementById('lanterns');
    const trailCanvas = document.getElementById('mouseTrail');
    const fallingItemsCanvas = document.getElementById('fallingItems');
    
    // 设置所有画布的尺寸
    [fireworksCanvas, lanternsCanvas, trailCanvas, fallingItemsCanvas].forEach(canvas => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    const fireworks = new Firework(fireworksCanvas);
    const lanterns = new Lantern(lanternsCanvas);
    const fallingItems = new FallingItems(fallingItemsCanvas);
    
    // 初始化动画
    fireworks.animate();
    lanterns.animate();

    // 鼠标轨迹效果
    const trailCtx = trailCanvas.getContext('2d');
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    const trail = [];
    document.addEventListener('mousemove', (e) => {
        trail.push({
            x: e.clientX,
            y: e.clientY,
            age: 0
        });
    });

    function animateTrail() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        for (let i = trail.length - 1; i >= 0; i--) {
            const point = trail[i];
            point.age++;

            if (point.age > 50) {
                trail.splice(i, 1);
                continue;
            }

            const alpha = 1 - point.age / 50;
            trailCtx.beginPath();
            trailCtx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            trailCtx.fillStyle = `rgba(255, 182, 193, ${alpha})`;
            trailCtx.fill();
        }

        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // 音乐控制
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            musicToggle.textContent = '🔇';
        } else {
            music.play();
            musicToggle.textContent = '🎵';
        }
        isPlaying = !isPlaying;
    });

    // 问答逻辑
    const questions = {
        1: {
            text: "新的一年，最想实现什么愿望呢？",
            options: [
                { text: "事业蒸蒸日上 🚀", next: 3 },
                { text: "找到真爱 💕", next: 4 },
                { text: "身体健康最重要 💪", next: 5 }
            ]
        },
        2: {
            text: "别担心，让我们一起倒数！",
            options: [
                { text: "好啦好啦，我准备好啦 ���", next: 1 },
                { text: "再给我一分钟 ⏰", next: 2 }
            ]
        },
        3: {
            text: "事业上有什么具体目标吗？",
            options: [
                { text: "升职加薪 💰", next: 6 },
                { text: "开启新事业 🎯", next: 6 },
                { text: "学习新技能 📚", next: 6 }
            ]
        },
        4: {
            text: "相信爱情一定会如期而至~",
            options: [
                { text: "期待遇��对的人 💑", next: 6 },
                { text: "先把自己变���更好 ✨", next: 6 }
            ]
        },
        5: {
            text: "健康确实最重要！新的一年要：",
            options: [
                { text: "坚持运动 🏃‍♂️", next: 6 },
                { text: "规律作息 😴", next: 6 },
                { text: "健康饮食 🥗", next: 6 }
            ]
        },
        6: {
            text: "愿你新年心想事成！要开始倒计时了吗？",
            options: [
                { text: "开始倒计时吧！🎊", next: 7 },
                { text: "再许一个愿望 ⭐", next: 1 }
            ]
        },
        7: {
            text: "10秒倒计时开始！",
            options: [
                { text: "新年快乐！🎆", next: "end" }
            ]
        }
    };

    const questionBox = document.getElementById('questionBox');
    
    function showQuestion(id) {
        const question = questions[id];
        if (!question) return;

        // 如果是最后一个问题（倒计时）
        if (id === 7) {
            startCountdown();
            return;
        }

        questionBox.innerHTML = `
            <h1>${question.text}</h1>
            <div class="options">
                ${question.options.map(opt => 
                    `<button class="option" data-next="${opt.next}">${opt.text}</button>`
                ).join('')}
            </div>
        `;

        // 重新绑定事件监听器
        questionBox.querySelectorAll('.option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextId = e.target.dataset.next;
                if (nextId === "end") {
                    showFinalCelebration();
                } else {
                    showQuestion(parseInt(nextId));
                }
            });
        });
    }

    function startCountdown() {
        let count = 5;
        const countdownDisplay = () => `
            <div class="countdown">
                <h1>${count}</h1>
                <p>新年倒计时</p>
            </div>
        `;
        
        questionBox.innerHTML = countdownDisplay();
        
        // 每秒发射一个烟花
        const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
                questionBox.innerHTML = countdownDisplay();
                // 从底部随机位置发射烟花
                const x = Math.random() * window.innerWidth;
                fireworks.launchFirework(x);
            } else {
                clearInterval(countInterval);
                showFinalCelebration();
            }
        }, 1000);
    }

    function showFinalCelebration() {
        questionBox.innerHTML = `
            <div class="celebration">
                <h1>新年快乐！</h1>
                <p>愿你所有的愿望都能实现 ✨</p>
                <button class="option" onclick="location.reload()">重新开始 🎊</button>
            </div>
        `;
        
        // 开始飘落动画
        fallingItems.start();
        
        // 密集发射烟花
        let fireworkCount = 0;
        const maxFireworks = 20;
        let continuousFireworks;
        
        const launchInterval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            fireworks.launchFirework(x);
            fireworkCount++;
            
            if (fireworkCount >= maxFireworks) {
                clearInterval(launchInterval);
                // 继续间歇性发射烟花
                continuousFireworks = setInterval(() => {
                    if (Math.random() < 0.3) {
                        const x = Math.random() * window.innerWidth;
                        fireworks.launchFirework(x);
                    }
                }, 500);
            }
        }, 300);

        // 创建更多孔明灯
        let lanternInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                lanterns.createLantern();
            }
        }, 1000);
    }

    // 初始化第一个问题
    showQuestion(1);
}); 