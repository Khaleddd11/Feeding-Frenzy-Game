import Player from './Player.js';
import EnemyFish from './EnemyFish.js';
import Spawner from './Spawner.js';
import { CONFIG } from '../config/config.js';

export default class Game {
  constructor(container) {
    this.container = container;
    this.width = 1200;
    this.height = 700;
    
    this.state = 'MENU';
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    
    const playerImages = [
      'assets/characters/hero1_right_closed.png',
      'assets/characters/hero2_right_closed.png',
      'assets/characters/hero3_right_closed.png',
      'assets/characters/hero4_right_closed.png'
    ];
    
    this.player = new Player(this.width / 2, this.height / 2, playerImages);
    this.enemies = [];
    this.spawner = new Spawner();

    this.lastSpawnTime = 0;
    this.spawnInterval = 1500; // 2 seconds
    this.maxEnemies = 8;       // Balanced - not too crowded, not too empty

    this.spawnStats = { 0: 0, 1: 0, 2: 0, 3: 0 };

    // Create simple progress bar
    this.createProgressBar();

    // Apex boss flag
    this.apexSpawned = false;
    
    this.setupInput();
  }
 spawnEnemy() {
    while (this.enemies.length < this.maxEnemies) {
        const enemy = this.spawner.spawn(this.player.level);
        if (enemy) {
            this.enemies.push(enemy);
            this.spawnStats[enemy.level]++;
        } else {
            break;
        }
    }
}
  
  setupInput() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
  }
  
  start() {
    this.state = 'PLAYING';
    // Spawn initial batch
    for(let i = 0; i < 5; i++) this.spawnEnemy();
    this.gameLoop();
  }
  
  gameLoop() {
    this.update();
    if (this.state === 'PLAYING') {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  
 update() {
    this.maxEnemies = 8 + (this.player.level * 4);
    this.spawnInterval = Math.max(700, 1600 - (this.player.level * 300));
    this.player.update(this.mouseX, this.mouseY);
    
    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
        this.spawnEnemy(); 
        this.lastSpawnTime = currentTime;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        enemy.update();

        if (this.isOffscreen(enemy)) {
            enemy.destroy();
            this.enemies.splice(i, 1);
        }
    }

    if (this.player.level === CONFIG.SIZE.LARGE && !this.apexSpawned) {
        this.apexSpawned = true;
        const apex = this.spawner.spawnApex();
        this.enemies.push(apex);
    }

    this.checkPlayerCollisions(); 
    this.checkEnemyCollisions();
    this.updateProgressBar();
}

isOffscreen(enemy) {
    return (
        enemy.x < -200 || 
        enemy.x > CONFIG.CANVAS_WIDTH + 200 ||
        enemy.y < -100 ||
        enemy.y > CONFIG.CANVAS_HEIGHT + 100
    );
}

  cleanupOffscreenEnemies() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.x < -200 || enemy.x > CONFIG.CANVAS_WIDTH + 200) {
        enemy.destroy();
        this.enemies.splice(i, 1);
      }
    }
  }

checkPlayerCollisions() {
    if (this.state !== 'PLAYING') return;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];

        if (this.player.isColliding(enemy)) {
            if (this.player.level >= enemy.level) {
                enemy.destroy();
                this.enemies.splice(i, 1);
                this.player.grow();
                this.updateProgressBar();
                
                if (this.player.score >= CONFIG.THRESHOLD.WIN) {
                    this.win();
                }
            } else {
                this.gameOver();
                break;
            }
        }
    }
}

  // testing
  gameOver() {
    this.state = 'GAME_OVER';
    this.player.destroy();
    setTimeout(() => {
      alert('Game Over!');
    }, 100);
  }

  // testing
  win() {
    this.state = 'WIN';
    setTimeout(() => {
      alert('Winner Winner Chicken Dinner!');
    }, 100);
  }

  // testing
  createProgressBar() {
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
  }

  // testing
  updateProgressBar() {
    const progress = Math.min((this.player.score / CONFIG.THRESHOLD.WIN) * 100, 100);
    this.progressFill.style.width = progress + '%';
    this.progressText.textContent = `${this.player.score} / ${CONFIG.THRESHOLD.WIN}`;
    
    const colors = [
      'linear-gradient(90deg, #4CAF50, #8BC34A)',  // Level 0 - Green
      'linear-gradient(90deg, #2196F3, #03A9F4)',  // Level 1 - Blue
      'linear-gradient(90deg, #FF9800, #FFC107)',  // Level 2 - Orange
      'linear-gradient(90deg, #E91E63, #F44336)'   // Level 3 - Red/Pink
    ];
    this.progressFill.style.background = colors[this.player.level] || colors[0];
  }
  
 checkEnemyCollisions() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
            if (i === j) continue; 

            const fishA = this.enemies[i];
            const fishB = this.enemies[j];

            if (!fishA || !fishB) continue;

            if (fishA.level > fishB.level && fishA.isColliding(fishB)) {
                fishA.openMouth();
                fishB.destroy();
                this.enemies.splice(j, 1);
                
                if (j < i) i--; 
                break; 
            }
        }
    }
}
}
