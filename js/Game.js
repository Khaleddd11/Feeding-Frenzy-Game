import Player from './Player.js';
import EnemyFish from './EnemyFish.js';
import Spawner from './Spawner.js';
import Shark from './Shark.js';
import Bomb from './Bomb.js';
import { CONFIG } from '../config/config.js';

export default class Game {
  constructor(container) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.frameCount = 0;
this.spawnStats = { 0:0, 1:0, 2:0, 3:0, 4:0 }
    
    this.state = 'STORY'; // Start with story
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    
    const playerImages = [
      'assets/characters/hero1_right_closed.png',
      'assets/characters/hero2_right_closed.png',
      'assets/characters/hero3_right_closed.png',
      'assets/characters/hero4_right_closed.png'
    ];
    
    this.player = new Player(this.width / 2, this.height / 2, playerImages);
    this.player.hide(); // Hide player until game starts
    this.enemies = [];
    this.sharks = [];
    this.bombs = [];
    this.spawner = new Spawner();

    this.lastSpawnTime = 0;
    this.spawnInterval = 1500; // 2 seconds
    this.maxEnemies = 15;       // Balanced - not too crowded, not too empty

    this.apexSpawned = false;
    this.storySlide = 0;
    
    this.createProgressBar();
    this.setupInput();
    this.setupStory();
    this.setupEndScreen();
  }
spawnShark() {
    if (this.sharks.length >= CONFIG.SHARK.MAX_COUNT) return;
    if (this.frameCount % CONFIG.SHARK.SPAWN_INTERVAL !== 0) return;
    
    const direction = Math.random() > 0.5 ? CONFIG.DIRECTION.RIGHT : CONFIG.DIRECTION.LEFT;
    const shark = new Shark(direction); 
    this.sharks.push(shark);
}

spawnBomb() {
    if (this.frameCount % CONFIG.BOMB.SPAWN_INTERVAL !== 0) return;
        const bomb = new Bomb(); 
    this.bombs.push(bomb);
}
  
  setupStory() {
    this.updateStorySlide();
    
    document.getElementById('next-btn').addEventListener('click', () => {
      this.storySlide++;
      if (this.storySlide < CONFIG.STORY_SLIDES.length) {
        this.updateStorySlide();
        
        // Change button text to "PLAY" on last slide
        if (this.storySlide === CONFIG.STORY_SLIDES.length - 1) {
          document.getElementById('next-btn').textContent = 'PLAY';
        }
      } else {
        this.showLoadingTransition();
      }
    });
    
    document.getElementById('skip-btn').addEventListener('click', () => {
      this.showLoadingTransition();
    });
  }
  
  updateStorySlide() {
    const slide = CONFIG.STORY_SLIDES[this.storySlide];
    document.getElementById('story-title').textContent = slide.title;
    document.getElementById('story-text').textContent = slide.text;
    document.getElementById('story-avatar').src = slide.imgSrc;
  }
  
  showLoadingTransition() {
    document.getElementById('story-container').classList.add('hidden');
    const transition = document.getElementById('bubble-transition');
    transition.classList.remove('hidden');
    
    setTimeout(() => {
      transition.classList.add('hidden');
      document.getElementById('ui-layer').classList.remove('hidden');
      this.start();
    }, 2600);
  }
  
  setupEndScreen() {
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restart();
    });
  }
  
  restart() {
    // Clear all entities
    this.enemies.forEach(e => e.destroy());
    this.sharks.forEach(s => s.destroy());
    this.bombs.forEach(b => b.destroy());
    
    this.enemies = [];
    this.sharks = [];
    this.bombs = [];
    this.frameCount = 0;
    this.apexSpawned = false;
    
    // Reset player
    this.player.reset();
    
    // Hide end screen
    document.getElementById('end-screen').classList.add('hidden');
    
    // Start game
    this.start();
  }
  
  spawnEnemy() {
    if (this.enemies.length >= this.maxEnemies) return;
    const enemy = this.spawner.spawn(this.player.level);
    if (enemy) {
        this.enemies.push(enemy);
        this.spawnStats[enemy.level]++; 
    }
  }
  
  setupInput() {
    this.container.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }
  
  start() {
    this.state = 'PLAYING';
    this.player.show(); // Show player when game starts
    document.getElementById('ui-layer').classList.remove('hidden'); 
    this.updateUI();
    
    const announcement = document.createElement('div');
    announcement.className = 'level-announcement';
    announcement.textContent = 'LEVEL 1';
    this.container.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 2000);
    
    for(let i = 0; i < 5; i++) this.spawnEnemy();
    
    this.gameLoop();
  }

  gameLoop() {
    if (this.state === 'PLAYING') {
      this.update();
      this.frameCount++; 
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  
update() {
    if (this.state !== 'PLAYING') return;

    
    this.maxEnemies = Math.min(10 + (this.player.level * 4), 25);
    this.spawnInterval = Math.max(600, 1400 - (this.player.level * 200));
    
    this.player.update(this.mouseX, this.mouseY);
    
    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
        const spawnCount = this.player.level >= 2 ? 2 : 1;
        for (let i = 0; i < spawnCount; i++) {
            this.spawnEnemy();
        }
        this.lastSpawnTime = currentTime;
    }

    console.log('About to call spawnShark and spawnBomb');
    this.spawnShark();
    this.spawnBomb();
    console.log('Called spawnShark and spawnBomb');

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update();
    }
    
    for (let i = this.sharks.length - 1; i >= 0; i--) {
        const shark = this.sharks[i];
        shark.update();
        
        if (!shark.isWarning) {
            
            if (this.checkSharkCollision(shark, this.player)) {
                this.gameOver("You were eaten by Eng. Mahmoud!");
                return;
            }
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.checkSharkCollision(shark, this.enemies[j])) {
                    this.enemies[j].destroy();
                    this.enemies.splice(j, 1);
                }
            }
        }
        
        if (shark.isOffscreen && shark.isOffscreen()) {
            console.log('Shark went offscreen, removing');
            shark.destroy();
            this.sharks.splice(i, 1);
        }
    }

    for (let i = this.bombs.length - 1; i >= 0; i--) {
        const bomb = this.bombs[i];
        bomb.update();
        
        if (!bomb.exploded) {
            if (bomb.checkCollision(this.player)) {
                bomb.explode();
                this.gameOver("You were hit by a bomb!");
                return;
            }
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (bomb.checkCollision(enemy)) {
                    bomb.explode();
                    enemy.destroy();
                    this.enemies.splice(j, 1);
                }
            }
            
            if (bomb.y > CONFIG.CANVAS_HEIGHT - 100) {
                bomb.explode();
            }
        }
        
        if (bomb.exploded) {
            bomb.destroy();
            this.bombs.splice(i, 1);
        }
        
        if (bomb.isOffscreen()) {
            bomb.destroy();
            this.bombs.splice(i, 1);
        }
    }

    this.cleanupOffscreenEnemies();

    if (this.player.level >= 3 && !this.apexSpawned) {
        this.apexSpawned = true;
        this.enemies.push(this.spawner.spawnApex());
    }
    
    this.checkPlayerCollisions();
    this.checkEnemyCollisions();
    this.updateProgressBar();
    this.updateUI(); 
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
                this.updateUI();
                
                if (this.player.score >= CONFIG.THRESHOLD.WIN) this.win();
            } else {
                enemy.openMouth();
                this.gameOver();
                break;
            }
        }
    }
}
// checkPlayerCollisions() {
//     if (this.state !== 'PLAYING') return;

//     const player = this.player;
//     const playerCenterX = player.x + player.width / 2;
//     const playerCenterY = player.y + player.height / 2;

//     for (let i = this.enemies.length - 1; i >= 0; i--) {
//       const enemy = this.enemies[i];
//       const enemyCenterX = enemy.x + enemy.width / 2;

//       const tolerance = 0.4;
//       const playerLeft = player.x + player.width * tolerance;
//       const playerRight = player.x + player.width * (1 - tolerance);
//       const playerTop = player.y + player.height * tolerance;
//       const playerBottom = player.y + player.height * (1 - tolerance);

//       const enemyLeft = enemy.x + enemy.width * tolerance;
//       const enemyRight = enemy.x + enemy.width * (1 - tolerance);
//       const enemyTop = enemy.y + enemy.height * tolerance;
//       const enemyBottom = enemy.y + enemy.height * (1 - tolerance);

//       const isColliding = 
//         playerLeft < enemyRight &&
//         playerRight > enemyLeft &&
//         playerTop < enemyBottom &&
//         playerBottom > enemyTop;

//       if (!isColliding) continue;

//       // player can only eat enemies at or below their level
//       if (player.level >= enemy.level) {
//         const isFacing = 
//           (player.direction === CONFIG.DIRECTION.RIGHT && enemyCenterX > playerCenterX) ||
//           (player.direction === CONFIG.DIRECTION.LEFT && enemyCenterX < playerCenterX);

//         if (isFacing) {
//           const previousLevel = player.level;  // Track level before eating
          
//           enemy.destroy();
//           this.enemies.splice(i, 1);
//           player.grow();
//           this.updateProgressBar();
          
//           // If player leveled up, spawn the new enemy type!
//           if (player.level > previousLevel) {
//             const newEnemyLevel = player.level + 1;  // Spawn the new threat level
//             const newEnemy = this.spawner.spawnByLevel(newEnemyLevel);
//             if (newEnemy) {
//               this.enemies.push(newEnemy);
//             }
//           }
          
//           if (player.score >= CONFIG.THRESHOLD.WIN) {
//             this.win();
//             return;
//           }
//         }
//       } else {
//         // Enemy level is higher - GAME OVER
//         enemy.openMouth();
//         this.gameOver();
//         return;
//       }
//     }
//   }

  gameOver(message = "GAME OVER") { 
    this.state = 'GAME_OVER';
    this.player.hide();
    document.getElementById('end-title').textContent = 'GAME OVER';
    document.getElementById('end-msg').innerHTML = `${message}<br>Final Score: ${this.player.score}`;
    document.getElementById('end-screen').classList.remove('hidden');
}

  win() {
    this.state = 'WIN';
    
    // Show VICTORY announcement
    const announcement = document.createElement('div');
    announcement.className = 'level-announcement';
    announcement.textContent = 'VICTORY!';
    document.querySelector('#game').appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
      document.getElementById('end-title').textContent = 'VICTORY!';
      document.getElementById('end-msg').innerHTML = `You are the Ocean King!<br>Final Score: ${this.player.score}`;
      document.getElementById('end-screen').classList.remove('hidden');
    }, 2000);
  }

  createProgressBar() {
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
  }

  updateProgressBar() {
    const progress = Math.min((this.player.score / CONFIG.THRESHOLD.WIN) * 100, 100);
    this.progressFill.style.width = progress + '%';
    this.progressText.textContent = `${this.player.score} / ${CONFIG.THRESHOLD.WIN}`;
    
    const colors = [
      'linear-gradient(90deg, #4CAF50, #8BC34A)',
      'linear-gradient(90deg, #2196F3, #03A9F4)',
      'linear-gradient(90deg, #FF9800, #FFC107)',
      'linear-gradient(90deg, #E91E63, #F44336)'
    ];
    this.progressFill.style.background = colors[this.player.level] || colors[0];
  }
  
  updateUI() {
    const scoreElement = document.getElementById('score-val');
    const levelElement = document.getElementById('level-name');
    
    if (scoreElement) scoreElement.textContent = this.player.score;
    if (levelElement) levelElement.textContent = CONFIG.LEVEL_NAMES[this.player.level] || "Explorer";
    
    const targetLevel = Math.min(this.player.level, 3);
    const targetData = this.spawner.getEnemyByLevel(targetLevel);
    
    if (targetData) {
      const targetImg = `assets/characters/${targetData.name}_right_closed.png`;
      const targetImgElement = document.getElementById('target-img');
      const targetNameElement = document.getElementById('target-name');
      
      if (targetImgElement) targetImgElement.src = targetImg;
      if (targetNameElement) targetNameElement.textContent = targetData.name.toUpperCase();
    }
  }
  
  checkEnemyCollisions() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
        const fishA = this.enemies[i];

        for (let j = this.enemies.length - 1; j >= 0; j--) {
            const fishB = this.enemies[j];
            
            if (i === j || !fishA || !fishB) continue;

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
  // Add this method to your Game class

checkSharkCollision(shark, fish) {
    // Don't check collision during warning phase
    if (shark.isWarning) return false;
    
    // Make sure shark element exists and has valid position
    if (!shark.element || shark.x === undefined || shark.y === undefined) return false;
    
    // Add tolerance/padding to make collision more accurate (reduce hitbox slightly)
    const padding = 50; // Reduce hitbox by 50px on each side
    
    const sharkLeft = shark.x + padding;
    const sharkRight = shark.x + shark.width - padding;
    const sharkTop = shark.y + padding;
    const sharkBottom = shark.y + shark.height - padding;
    
    const fishLeft = fish.x + padding;
    const fishRight = fish.x + fish.width - padding;
    const fishTop = fish.y + padding;
    const fishBottom = fish.y + fish.height - padding;
    
    // Simple AABB (Axis-Aligned Bounding Box) collision
    const isColliding = sharkLeft < fishRight &&
                       sharkRight > fishLeft &&
                       sharkTop < fishBottom &&
                       sharkBottom > fishTop;
    
   
    
    return isColliding;
}

checkBombExplosion(bomb) {
    console.log('Checking bomb explosion at:', bomb.x, bomb.y);
    
    // Check collision with player
    if (bomb.checkCollision(this.player)) {
        console.log('Bomb hit player!');
        this.gameOver("You were hit by a bomb!");
        return;
    }
    
    // Check collision with enemies
    let enemiesHit = 0;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
        if (bomb.checkCollision(this.enemies[i])) {
            console.log('Bomb hit enemy:', this.enemies[i]);
            this.enemies[i].destroy();
            this.enemies.splice(i, 1);
            enemiesHit++;
        }
    }
    
    
}
}