import Player from './Player.js';
import EnemyFish from './EnemyFish.js';
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

    // Spawn config - time-based for accurate timing
    this.lastSpawnTime = 0;
    this.spawnInterval = 2000; // 2 seconds in milliseconds
    this.maxEnemies = 15;
    
    this.setupInput();
  }
  
  spawnEnemy() {
    if (this.enemies.length >= this.maxEnemies) return;

    // Random 
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const x = direction === 'right' ? -150 : CONFIG.CANVAS_WIDTH + 150;
    const y = Math.random() * (CONFIG.CANVAS_HEIGHT - 100);
    
    // Random enemy type
    const enemyImages = [
      'assets/characters/tiny-fry_right_closed.png',
      'assets/characters/swift-minnow_right_closed.png',
      'assets/characters/spotted-reef_right_closed.png',
      'assets/characters/hunter_right_closed.png'
    ];
    const img = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    const weight = 0.8 + Math.random() * 1.2;

    const enemy = new EnemyFish(x, y, img, weight, direction, 'top', 1);
    this.enemies.push(enemy);
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
    
    // Check collisions
    this.checkEnemyCollisions();
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
