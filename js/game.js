/**
 * 坦克大战游戏引擎
 * 包含地图、坦克、子弹、碰撞检测、AI等完整功能
 */

// ==================== 常量定义 ====================
const TILE_SIZE = 26;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const CANVAS_SIZE = 520;

// 方向枚举
const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

// 地形类型
const TileType = {
    EMPTY: 0,
    BRICK: 1,      // 砖墙 - 可破坏
    STEEL: 2,      // 钢墙 - 不可破坏
    WATER: 3,      // 水 - 不可通过
    GRASS: 4,      // 草地 - 可隐藏
    BASE: 5        // 基地
};

// 坦克类型
const TankType = {
    PLAYER: 0,
    ENEMY_BASIC: 1,
    ENEMY_FAST: 2,
    ENEMY_HEAVY: 3
};

// 颜色配置
const Colors = {
    BRICK: '#c0392b',
    BRICK_DARK: '#922b21',
    STEEL: '#7f8c8d',
    STEEL_LIGHT: '#95a5a6',
    WATER: '#2980b9',
    GRASS: '#27ae60',
    BASE: '#f39c12',
    PLAYER: '#3498db',
    ENEMY_BASIC: '#e74c3c',
    ENEMY_FAST: '#1abc9c',
    ENEMY_HEAVY: '#9b59b6',
    BULLET: '#f1c40f'
};

// ==================== 地图数据 ====================
// 关卡地图 (0=空, 1=砖墙, 2=钢墙, 3=水, 4=草地, 5=基地)
const LEVELS = [
    // 第1关
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    // 第2关 - 增加钢墙
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,0,0,1,1,0,0,0,1,1,0,0,2,2,0,0,0],
        [0,0,2,2,0,0,1,1,0,0,0,1,1,0,0,2,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,2,2,0,0,0,2,2,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,2,2,0,0,0,2,2,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,2,2,0,0,0,2,2,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,2,2,0,0,0,2,2,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    // 第3关 - 增加水和复杂地形
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,3,3,1,1,0,0,0,1,1,3,3,1,1,0,0,0],
        [0,0,1,1,3,3,1,1,0,0,0,1,1,3,3,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,0,0,1,1,3,3,3,3,1,1,0,0,2,2,0,0],
        [0,0,2,2,0,0,1,1,3,3,3,3,1,1,0,0,2,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,2,2,0,0,0,2,2,0,0,1,1,0,0,0],
        [0,0,1,1,0,0,2,2,0,0,0,2,2,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,0,0,1,1,0,0,0,1,1,0,0,2,2,0,0,0],
        [0,0,2,2,0,0,1,1,0,0,0,1,1,0,0,2,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
];

// ==================== 子弹类 ====================
class Bullet {
    constructor(x, y, direction, owner, speed = 5) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.owner = owner; // 'player' 或 'enemy'
        this.speed = speed;
        this.width = 4;
        this.height = 4;
        this.active = true;
    }

    update() {
        switch (this.direction) {
            case Direction.UP: this.y -= this.speed; break;
            case Direction.DOWN: this.y += this.speed; break;
            case Direction.LEFT: this.x -= this.speed; break;
            case Direction.RIGHT: this.x += this.speed; break;
        }

        // 检查是否超出边界
        if (this.x < 0 || this.x > CANVAS_SIZE ||
            this.y < 0 || this.y > CANVAS_SIZE) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = Colors.BULLET;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    getRect() {
        return {
            x: this.x - 2,
            y: this.y - 2,
            width: 4,
            height: 4
        };
    }
}

// ==================== 坦克类 ====================
class Tank {
    constructor(x, y, type, direction = Direction.UP) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.direction = direction;
        this.width = 24;
        this.height = 24;
        this.active = true;
        this.bullets = [];
        this.lastShotTime = 0;
        this.invincible = false;
        this.invincibleTimer = 0;

        // 根据类型设置属性
        switch (type) {
            case TankType.PLAYER:
                this.speed = 2;
                this.color = Colors.PLAYER;
                this.maxBullets = 1;
                this.health = 1;
                this.shootCooldown = 300;
                break;
            case TankType.ENEMY_BASIC:
                this.speed = 1;
                this.color = Colors.ENEMY_BASIC;
                this.maxBullets = 1;
                this.health = 1;
                this.shootCooldown = 2000;
                this.score = 1;
                break;
            case TankType.ENEMY_FAST:
                this.speed = 2.5;
                this.color = Colors.ENEMY_FAST;
                this.maxBullets = 1;
                this.health = 1;
                this.shootCooldown = 1500;
                this.score = 2;
                break;
            case TankType.ENEMY_HEAVY:
                this.speed = 0.8;
                this.color = Colors.ENEMY_HEAVY;
                this.maxBullets = 1;
                this.health = 3;
                this.shootCooldown = 2500;
                this.score = 3;
                break;
        }
    }

    move(direction, map) {
        if (!this.active) return;

        this.direction = direction;
        let newX = this.x;
        let newY = this.y;

        switch (direction) {
            case Direction.UP: newY -= this.speed; break;
            case Direction.DOWN: newY += this.speed; break;
            case Direction.LEFT: newX -= this.speed; break;
            case Direction.RIGHT: newX += this.speed; break;
        }

        // 边界检查
        if (newX < 0) newX = 0;
        if (newX > CANVAS_SIZE - this.width) newX = CANVAS_SIZE - this.width;
        if (newY < 0) newY = 0;
        if (newY > CANVAS_SIZE - this.height) newY = CANVAS_SIZE - this.height;

        // 地图碰撞检测
        if (!this.checkMapCollision(newX, newY, map)) {
            this.x = newX;
            this.y = newY;
        }
    }

    checkMapCollision(x, y, map) {
        const tiles = this.getOccupiedTiles(x, y);
        for (const tile of tiles) {
            if (tile.row >= 0 && tile.row < MAP_HEIGHT &&
                tile.col >= 0 && tile.col < MAP_WIDTH) {
                const tileType = map[tile.row][tile.col];
                if (tileType === TileType.BRICK ||
                    tileType === TileType.STEEL ||
                    tileType === TileType.WATER) {
                    return true;
                }
            }
        }
        return false;
    }

    getOccupiedTiles(x, y) {
        const tiles = [];
        const left = Math.floor(x / TILE_SIZE);
        const right = Math.floor((x + this.width - 1) / TILE_SIZE);
        const top = Math.floor(y / TILE_SIZE);
        const bottom = Math.floor((y + this.height - 1) / TILE_SIZE);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                tiles.push({ row: r, col: c });
            }
        }
        return tiles;
    }

    shoot() {
        if (!this.active) return;

        const now = Date.now();
        if (now - this.lastShotTime < this.shootCooldown) return;

        // 检查当前子弹数量
        const activeBullets = this.bullets.filter(b => b.active).length;
        if (activeBullets >= this.maxBullets) return;

        this.lastShotTime = now;

        let bx, by;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        switch (this.direction) {
            case Direction.UP:
                bx = centerX;
                by = this.y;
                break;
            case Direction.DOWN:
                bx = centerX;
                by = this.y + this.height;
                break;
            case Direction.LEFT:
                bx = this.x;
                by = centerY;
                break;
            case Direction.RIGHT:
                bx = this.x + this.width;
                by = centerY;
                break;
        }

        const bulletSpeed = this.type === TankType.ENEMY_FAST ? 6 : 5;
        const owner = this.type === TankType.PLAYER ? 'player' : 'enemy';
        this.bullets.push(new Bullet(bx, by, this.direction, owner, bulletSpeed));
    }

    update(map) {
        // 更新子弹
        this.bullets = this.bullets.filter(b => b.active);
        for (const bullet of this.bullets) {
            bullet.update();
        }

        // 更新无敌时间
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // 无敌闪烁效果
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        ctx.save();

        // 绘制坦克主体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 绘制坦克边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // 绘制炮塔
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.fillStyle = this.color;

        switch (this.direction) {
            case Direction.UP:
                ctx.fillRect(centerX - 3, this.y - 4, 6, 14);
                break;
            case Direction.DOWN:
                ctx.fillRect(centerX - 3, this.y + this.height - 10, 6, 14);
                break;
            case Direction.LEFT:
                ctx.fillRect(this.x - 4, centerY - 3, 14, 6);
                break;
            case Direction.RIGHT:
                ctx.fillRect(this.x + this.width - 10, centerY - 3, 14, 6);
                break;
        }

        // 绘制履带纹理
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
            ctx.beginPath();
            ctx.moveTo(this.x + 4, this.y);
            ctx.lineTo(this.x + 4, this.y + this.height);
            ctx.moveTo(this.x + this.width - 4, this.y);
            ctx.lineTo(this.x + this.width - 4, this.y + this.height);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 4);
            ctx.lineTo(this.x + this.width, this.y + 4);
            ctx.moveTo(this.x, this.y + this.height - 4);
            ctx.lineTo(this.x + this.width, this.y + this.height - 4);
            ctx.stroke();
        }

        // 重型坦克显示血条
        if (this.type === TankType.ENEMY_HEAVY && this.health > 1) {
            const barWidth = this.width;
            const barHeight = 3;
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 6, barWidth, barHeight);
            ctx.fillStyle = this.health >= 2 ? '#e74c3c' : '#f39c12';
            ctx.fillRect(this.x, this.y - 6, barWidth * (this.health / 3), barHeight);
        }

        ctx.restore();

        // 绘制子弹
        for (const bullet of this.bullets) {
            bullet.draw(ctx);
        }
    }

    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    hit() {
        this.health--;
        if (this.health <= 0) {
            this.active = false;
            return true; // 坦克被摧毁
        }
        return false;
    }
}

// ==================== 粒子效果类 ====================
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 30;
        this.maxLife = 30;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vx *= 0.95;
        this.vy *= 0.95;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

// ==================== 爆炸效果类 ====================
class Explosion {
    constructor(x, y, size = 'normal') {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.active = true;
        const count = size === 'big' ? 30 : 15;
        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#e67e22'];

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(
                x, y,
                colors[Math.floor(Math.random() * colors.length)]
            ));
        }
    }

    update() {
        for (const p of this.particles) {
            p.update();
        }
        this.particles = this.particles.filter(p => p.life > 0);
        if (this.particles.length === 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            p.draw(ctx);
        }
    }
}

// ==================== 游戏主类 ====================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 游戏状态
        this.state = 'start'; // start, playing, paused, gameover, levelcomplete
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.enemiesKilled = 0;
        this.totalEnemies = 20;
        this.enemiesSpawned = 0;
        this.maxEnemiesOnScreen = 4;

        // 游戏对象
        this.map = [];
        this.player = null;
        this.enemies = [];
        this.explosions = [];
        this.spawnPoints = [
            { x: 0, y: 0 },
            { x: CANVAS_SIZE / 2 - 12, y: 0 },
            { x: CANVAS_SIZE - 24, y: 0 }
        ];
        this.lastSpawnTime = 0;
        this.spawnInterval = 3000;

        // 输入状态
        this.keys = {};
        this.lastPlayerShot = 0;

        // 动画帧ID
        this.animationId = null;

        this.init();
    }

    init() {
        // 绑定事件
        this.bindEvents();

        // 绑定按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resume());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());

        // 开始渲染循环
        this.render();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            if (e.code === 'Space') {
                e.preventDefault();
                if (this.state === 'playing' && this.player && this.player.active) {
                    this.player.shoot();
                }
            }

            if (e.key.toLowerCase() === 'p') {
                if (this.state === 'playing') {
                    this.pause();
                } else if (this.state === 'paused') {
                    this.resume();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    loadLevel(levelIndex) {
        // 加载地图
        const levelData = LEVELS[(levelIndex - 1) % LEVELS.length];
        this.map = levelData.map(row => [...row]);

        // 创建玩家坦克
        this.player = new Tank(
            CANVAS_SIZE / 2 - 12,
            CANVAS_SIZE - 40,
            TankType.PLAYER,
            Direction.UP
        );
        this.player.invincible = true;
        this.player.invincibleTimer = 120;

        // 重置敌人
        this.enemies = [];
        this.enemiesSpawned = 0;
        this.enemiesKilled = 0;
        this.totalEnemies = 15 + levelIndex * 5;
        this.lastSpawnTime = Date.now();

        // 重置爆炸效果
        this.explosions = [];

        this.updateUI();
    }

    start() {
        this.state = 'playing';
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.loadLevel(1);
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        this.gameLoop();
    }

    restart() {
        this.start();
    }

    pause() {
        this.state = 'paused';
        document.getElementById('pauseScreen').classList.remove('hidden');
    }

    resume() {
        this.state = 'playing';
        document.getElementById('pauseScreen').classList.add('hidden');
        this.lastSpawnTime = Date.now();
        this.gameLoop();
    }

    nextLevel() {
        this.level++;
        this.state = 'playing';
        this.loadLevel(this.level);
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        this.gameLoop();
    }

    gameOver(reason) {
        this.state = 'gameover';
        document.getElementById('gameOverTitle').textContent =
            reason === 'base' ? '🏠 基地被毁!' : '💥 游戏结束';
        document.getElementById('gameOverReason').textContent =
            reason === 'base' ? '你的基地被敌人摧毁了！' : '你的坦克被摧毁了！';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    levelComplete() {
        this.state = 'levelcomplete';
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
    }

    spawnEnemy() {
        if (this.enemiesSpawned >= this.totalEnemies) return;
        if (this.enemies.filter(e => e.active).length >= this.maxEnemiesOnScreen) return;

        const now = Date.now();
        if (now - this.lastSpawnTime < this.spawnInterval) return;

        this.lastSpawnTime = now;

        // 随机选择出生点
        const spawn = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

        // 检查出生点是否被占用
        const spawnRect = { x: spawn.x, y: spawn.y, width: 24, height: 24 };
        let occupied = false;

        if (this.player && this.player.active && this.checkRectCollision(spawnRect, this.player.getRect())) {
            occupied = true;
        }

        for (const enemy of this.enemies) {
            if (enemy.active && this.checkRectCollision(spawnRect, enemy.getRect())) {
                occupied = true;
                break;
            }
        }

        if (occupied) return;

        // 随机选择敌人类型
        const rand = Math.random();
        let enemyType;
        if (rand < 0.5) {
            enemyType = TankType.ENEMY_BASIC;
        } else if (rand < 0.8) {
            enemyType = TankType.ENEMY_FAST;
        } else {
            enemyType = TankType.ENEMY_HEAVY;
        }

        const enemy = new Tank(spawn.x, spawn.y, enemyType, Direction.DOWN);
        enemy.aiTimer = 0;
        enemy.aiDirectionTimer = 0;
        this.enemies.push(enemy);
        this.enemiesSpawned++;
        this.updateUI();
    }

    updateAI() {
        for (const enemy of this.enemies) {
            if (!enemy.active) continue;

            enemy.aiTimer++;
            enemy.aiDirectionTimer++;

            // 随机改变方向
            if (enemy.aiDirectionTimer > 60 + Math.random() * 60) {
                enemy.aiDirectionTimer = 0;
                const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
            }

            // 尝试移动
            const oldX = enemy.x;
            const oldY = enemy.y;
            enemy.move(enemy.direction, this.map);

            // 如果移动被阻挡，随机换个方向
            if (enemy.x === oldX && enemy.y === oldY) {
                const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
            }

            // 随机射击
            if (Math.random() < 0.02) {
                enemy.shoot();
            }

            // 如果玩家存在，偶尔向玩家方向射击
            if (this.player && this.player.active && Math.random() < 0.01) {
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                if (Math.abs(dx) > Math.abs(dy)) {
                    enemy.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
                } else {
                    enemy.direction = dy > 0 ? Direction.DOWN : Direction.UP;
                }
                enemy.shoot();
            }
        }
    }

    updatePlayer() {
        if (!this.player || !this.player.active) return;

        if (this.keys['w'] || this.keys['arrowup']) {
            this.player.move(Direction.UP, this.map);
        } else if (this.keys['s'] || this.keys['arrowdown']) {
            this.player.move(Direction.DOWN, this.map);
        } else if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.move(Direction.LEFT, this.map);
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.player.move(Direction.RIGHT, this.map);
        }
    }

    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    checkBulletMapCollision() {
        const allBullets = [];
        if (this.player) {
            allBullets.push(...this.player.bullets.map(b => ({ bullet: b, owner: 'player' })));
        }
        for (const enemy of this.enemies) {
            allBullets.push(...enemy.bullets.map(b => ({ bullet: b, owner: 'enemy' })));
        }

        for (const { bullet } of allBullets) {
            if (!bullet.active) continue;

            const bx = Math.floor(bullet.x / TILE_SIZE);
            const by = Math.floor(bullet.y / TILE_SIZE);

            if (bx >= 0 && bx < MAP_WIDTH && by >= 0 && by < MAP_HEIGHT) {
                const tileType = this.map[by][bx];

                if (tileType === TileType.BRICK) {
                    // 破坏砖墙
                    this.map[by][bx] = TileType.EMPTY;
                    bullet.active = false;
                    this.explosions.push(new Explosion(bullet.x, bullet.y));
                } else if (tileType === TileType.STEEL) {
                    // 钢墙无法破坏
                    bullet.active = false;
                    this.explosions.push(new Explosion(bullet.x, bullet.y, 'small'));
                } else if (tileType === TileType.BASE) {
                    // 基地被击中
                    this.map[by][bx] = TileType.EMPTY;
                    bullet.active = false;
                    this.explosions.push(new Explosion(bullet.x, bullet.y, 'big'));
                    this.gameOver('base');
                    return;
                }
            }

            // 检查子弹是否超出边界
            if (bullet.x < 0 || bullet.x > CANVAS_SIZE ||
                bullet.y < 0 || bullet.y > CANVAS_SIZE) {
                bullet.active = false;
            }
        }
    }

    checkBulletTankCollision() {
        const allBullets = [];
        if (this.player) {
            allBullets.push(...this.player.bullets.map(b => ({ bullet: b, owner: 'player' })));
        }
        for (const enemy of this.enemies) {
            allBullets.push(...enemy.bullets.map(b => ({ bullet: b, owner: 'enemy' })));
        }

        for (const { bullet, owner } of allBullets) {
            if (!bullet.active) continue;

            const bulletRect = bullet.getRect();

            // 检查击中玩家
            if (owner === 'enemy' && this.player && this.player.active) {
                if (!this.player.invincible && this.checkRectCollision(bulletRect, this.player.getRect())) {
                    bullet.active = false;
                    this.explosions.push(new Explosion(this.player.x + 12, this.player.y + 12, 'big'));

                    this.lives--;
                    this.updateUI();

                    if (this.lives <= 0) {
                        this.player.active = false;
                        this.gameOver('player');
                        return;
                    } else {
                        // 重生玩家
                        this.player.x = CANVAS_SIZE / 2 - 12;
                        this.player.y = CANVAS_SIZE - 40;
                        this.player.direction = Direction.UP;
                        this.player.invincible = true;
                        this.player.invincibleTimer = 120;
                    }
                    continue;
                }
            }

            // 检查击中敌人
            if (owner === 'player') {
                for (const enemy of this.enemies) {
                    if (!enemy.active) continue;

                    if (this.checkRectCollision(bulletRect, enemy.getRect())) {
                        bullet.active = false;

                        if (enemy.hit()) {
                            // 敌人被摧毁
                            this.explosions.push(new Explosion(enemy.x + 12, enemy.y + 12, 'big'));
                            this.score += enemy.score * 100;
                            this.enemiesKilled++;
                            this.updateUI();

                            // 检查是否完成关卡
                            if (this.enemiesKilled >= this.totalEnemies) {
                                this.levelComplete();
                                return;
                            }
                        } else {
                            // 敌人受伤但未死
                            this.explosions.push(new Explosion(enemy.x + 12, enemy.y + 12));
                        }
                        break;
                    }
                }
            }
        }
    }

    checkTankCollision() {
        if (!this.player || !this.player.active) return;

        const playerRect = this.player.getRect();

        for (const enemy of this.enemies) {
            if (!enemy.active) continue;

            if (this.checkRectCollision(playerRect, enemy.getRect())) {
                // 碰撞推开
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;

                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) {
                        this.player.x = enemy.x + enemy.width;
                    } else {
                        this.player.x = enemy.x - this.player.width;
                    }
                } else {
                    if (dy > 0) {
                        this.player.y = enemy.y + enemy.height;
                    } else {
                        this.player.y = enemy.y - this.player.height;
                    }
                }
            }
        }
    }

    update() {
        if (this.state !== 'playing') return;

        // 更新玩家
        this.updatePlayer();
        if (this.player) {
            this.player.update(this.map);
        }

        // 更新敌人AI
        this.updateAI();
        for (const enemy of this.enemies) {
            enemy.update(this.map);
        }

        // 生成新敌人
        this.spawnEnemy();

        // 碰撞检测
        this.checkBulletMapCollision();
        this.checkBulletTankCollision();
        this.checkTankCollision();

        // 更新爆炸效果
        this.explosions = this.explosions.filter(e => e.active);
        for (const explosion of this.explosions) {
            explosion.update();
        }

        // 清理不活跃的敌人
        this.enemies = this.enemies.filter(e => e.active);
    }

    drawMap() {
        for (let row = 0; row < MAP_HEIGHT; row++) {
            for (let col = 0; col < MAP_WIDTH; col++) {
                const tileType = this.map[row][col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                switch (tileType) {
                    case TileType.BRICK:
                        this.drawBrick(x, y);
                        break;
                    case TileType.STEEL:
                        this.drawSteel(x, y);
                        break;
                    case TileType.WATER:
                        this.drawWater(x, y);
                        break;
                    case TileType.GRASS:
                        this.drawGrass(x, y);
                        break;
                    case TileType.BASE:
                        this.drawBase(x, y);
                        break;
                }
            }
        }
    }

    drawBrick(x, y) {
        // 砖块纹理
        this.ctx.fillStyle = Colors.BRICK;
        this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        this.ctx.fillStyle = Colors.BRICK_DARK;

        // 砖块图案
        const brickH = TILE_SIZE / 2;
        const brickW = TILE_SIZE / 2;

        this.ctx.fillRect(x + 2, y + 2, brickW - 2, brickH - 2);
        this.ctx.fillRect(x + brickW, y + 2, brickW - 2, brickH - 2);
        this.ctx.fillRect(x + 2, y + brickH, brickW - 2, brickH - 2);
        this.ctx.fillRect(x + brickW, y + brickH, brickW - 2, brickH - 2);
    }

    drawSteel(x, y) {
        this.ctx.fillStyle = Colors.STEEL;
        this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        this.ctx.fillStyle = Colors.STEEL_LIGHT;
        this.ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        this.ctx.fillStyle = Colors.STEEL;
        this.ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
    }

    drawWater(x, y) {
        const time = Date.now() / 1000;
        const offset = Math.sin(time * 2 + x * 0.1) * 2;
        this.ctx.fillStyle = Colors.WATER;
        this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
        this.ctx.fillRect(x + 2, y + 4 + offset, TILE_SIZE - 4, 3);
        this.ctx.fillRect(x + 4, y + 12 - offset, TILE_SIZE - 8, 2);
    }

    drawGrass(x, y) {
        this.ctx.fillStyle = Colors.GRASS;
        this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(x + 3, y + 3, 4, 8);
        this.ctx.fillRect(x + 10, y + 5, 3, 10);
        this.ctx.fillRect(x + 16, y + 2, 4, 7);
    }

    drawBase(x, y) {
        // 基地背景
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x, y, TILE_SIZE * 2, TILE_SIZE * 2);

        // 基地图标
        const cx = x + TILE_SIZE;
        const cy = y + TILE_SIZE;

        this.ctx.fillStyle = Colors.BASE;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 8);
        this.ctx.lineTo(cx + 8, cy + 4);
        this.ctx.lineTo(cx - 8, cy + 4);
        this.ctx.closePath();
        this.ctx.fill();

        // 闪烁效果
        const alpha = 0.5 + Math.sin(Date.now() / 200) * 0.3;
        this.ctx.fillStyle = `rgba(243, 156, 18, ${alpha})`;
        this.ctx.fillRect(x + 4, y + 4, TILE_SIZE * 2 - 8, TILE_SIZE * 2 - 8);
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 绘制网格背景
        this.ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= MAP_WIDTH; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * TILE_SIZE, 0);
            this.ctx.lineTo(i * TILE_SIZE, CANVAS_SIZE);
            this.ctx.stroke();
        }
        for (let i = 0; i <= MAP_HEIGHT; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * TILE_SIZE);
            this.ctx.lineTo(CANVAS_SIZE, i * TILE_SIZE);
            this.ctx.stroke();
        }

        // 绘制地图
        this.drawMap();

        // 绘制玩家
        if (this.player) {
            this.player.draw(this.ctx);
        }

        // 绘制敌人
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }

        // 绘制爆炸效果
        for (const explosion of this.explosions) {
            explosion.draw(this.ctx);
        }
    }

    render() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.render());
    }

    gameLoop() {
        if (this.state !== 'playing') return;

        this.update();

        // 使用requestAnimationFrame继续游戏循环
        // 注意：render已经在单独的循环中运行了
        if (this.state === 'playing') {
            setTimeout(() => {
                if (this.state === 'playing') {
                    this.gameLoop();
                }
            }, 1000 / 60);
        }
    }

    updateUI() {
        // 更新生命值显示
        const livesEl = document.getElementById('lives');
        livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives));

        // 更新得分
        document.getElementById('score').textContent = this.score;

        // 更新关卡
        document.getElementById('level').textContent = this.level;

        // 更新剩余敌人
        const remaining = this.totalEnemies - this.enemiesKilled;
        document.getElementById('enemies-left').textContent = Math.max(0, remaining);
    }
}

// ==================== 启动游戏 ====================
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
