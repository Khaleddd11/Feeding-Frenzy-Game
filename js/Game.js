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

    // Spawn config - time-based for accurate timing
    this.lastSpawnTime = 0;
    this.spawnInterval = 2000; // 2 seconds
    this.maxEnemies = 6;       // Balanced - not too crowded, not too empty

    // track spawn distribution
    this.spawnStats = { 0: 0, 1: 0, 2: 0, 3: 0 };

    // Create simple progress bar
    this.createProgressBar();

    // Apex boss flag
    this.apexSpawned = false;
    
    this.setupInput();
  }
  
  spawnEnemy() {
    if (this.enemies.length >= this.maxEnemies) return;

    // Pass player level to spawn enemies progressively
    const enemy = this.spawner.spawn(this.player.level);
    this.enemies.push(enemy);
    
    this.spawnStats[enemy.level]++;
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
    this.player.update(this.mouseX, this.mouseY);
    
    // Spawn new enemies
    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
      this.spawnEnemy();
      this.lastSpawnTime = currentTime;
    }

    // Update all enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update();
    }
    
    // Clean up enemies that left the screen
    this.cleanupOffscreenEnemies();

    // Spawn APEX when player reaches Level 3
    if (this.player.level === CONFIG.SIZE.LARGE && !this.apexSpawned) {
      this.apexSpawned = true;
      const apex = this.spawner.spawnApex();
      this.enemies.push(apex);
    }
    
    // Check collisions
    this.checkPlayerCollisions();  // Player vs enemies
    this.checkEnemyCollisions();   // Enemies vs enemies
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

    const player = this.player;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const enemyCenterX = enemy.x + enemy.width / 2;
      // const enemyCenterY = enemy.y + enemy.height / 2;

      // Smaller hitbox - shrink by 40% on each side for fairer collisions
      const tolerance = 0.4;
      const playerLeft = player.x + player.width * tolerance;
      const playerRight = player.x + player.width * (1 - tolerance);
      const playerTop = player.y + player.height * tolerance;
      const playerBottom = player.y + player.height * (1 - tolerance);

      const enemyLeft = enemy.x + enemy.width * tolerance;
      const enemyRight = enemy.x + enemy.width * (1 - tolerance);
      const enemyTop = enemy.y + enemy.height * tolerance;
      const enemyBottom = enemy.y + enemy.height * (1 - tolerance);

      const isColliding = 
        playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop;

      if (!isColliding) continue;

      // player can only eat enemies at or below their level
      if (player.level >= enemy.level) {
        const isFacing = 
          (player.direction === 1 && enemyCenterX > playerCenterX) ||   // facing right
          (player.direction === -1 && enemyCenterX < playerCenterX);    // facing left

        if (isFacing) {
          const previousLevel = player.level;  // Track level before eating
          
          enemy.destroy();
          this.enemies.splice(i, 1);
          player.grow();
          this.updateProgressBar();
          
          // If player leveled up, spawn the new enemy type!
          if (player.level > previousLevel) {
            const newEnemyLevel = player.level + 1;  // Spawn the new threat level
            const newEnemy = this.spawner.spawnByLevel(newEnemyLevel);
            if (newEnemy) {
              this.enemies.push(newEnemy);
            }
          }
          
          // Check win condition
          if (player.score >= CONFIG.THRESHOLD.WIN) {
            this.win();
            return;
          }
        }
      } else {
        // Enemy level is higher - GAME OVER
        enemy.openMouth();
        this.gameOver();
        return;
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
      for (let j = this.enemies.length - 1; j > i; j--) {
        const e1 = this.enemies[i];
        const e2 = this.enemies[j];

        let smallFish, bigFish;
        if (e1.weight < e2.weight) {
          smallFish = e1;
          bigFish = e2;
        } else if (e2.weight < e1.weight) {
          smallFish = e2;
          bigFish = e1;
        } else {
          continue; 
        }

        // Direction check: big fish must be FACING the small fish
        // If big fish faces right, small fish must be to its right (smallFish.x > bigFish.x)
        // If big fish faces left, small fish must be to its left (smallFish.x < bigFish.x)
        const bigFishCenter = bigFish.x + bigFish.width / 2;
        const smallFishCenter = smallFish.x + smallFish.width / 2;
        
        const isFacingSmallFish = 
          (bigFish.direction === 'right' && smallFishCenter > bigFishCenter) ||
          (bigFish.direction === 'left' && smallFishCenter < bigFishCenter);
        
        if (!isFacingSmallFish) continue; // Can't eat from behind

        const horizontalTolerance = bigFish.width * 0.5; 
        const horizontalOverlap = (
          smallFish.x < bigFish.x + bigFish.width - horizontalTolerance &&
          smallFish.x + smallFish.width > bigFish.x + horizontalTolerance
        );

        const verticalTolerance = bigFish.height * 0.5;
        const verticalOverlap = (
          smallFish.y < bigFish.y + bigFish.height - verticalTolerance &&
          smallFish.y + smallFish.height > bigFish.y + verticalTolerance
        );

        if (horizontalOverlap && verticalOverlap) {
          bigFish.openMouth();  // Big fish opens mouth when eating
          smallFish.destroy();
          if (smallFish === e1) {
            this.enemies.splice(i, 1);
            break; 
          } else {
            this.enemies.splice(j, 1);
          }
      
        }
      }
    }
  }
}
