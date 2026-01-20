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
      'assets/characters/hero1_right_closed.png',  // TINY
      'assets/characters/hero2_right_closed.png',  // SMALL
      'assets/characters/hero3_right_closed.png',  // MEDIUM
      'assets/characters/hero4_right_closed.png'   // LARGE
    ];
    
    this.player = new Player(this.width / 2, this.height / 2, playerImages);
    
    // Initialize enemies array
    this.enemies = [];
    
    // Create some test enemies
    this.createEnemies();
    
    this.setupInput();
  }
  
  createEnemies() {
    // Create 5 test enemies with random positions and sizes
    const enemyImages = [
      'assets/characters/tiny-fry_right_closed.png',
      'assets/characters/swift-minnow_right_closed.png',
      'assets/characters/spotted-reef_right_closed.png',
      'assets/characters/hunter_right_closed.png'
    ];
    
    for (let i = 0; i < 5; i++) {
      const randomX = Math.random() * CONFIG.CANVAS_WIDTH;
      const randomY = Math.random() * CONFIG.CANVAS_HEIGHT;
      const randomImg = enemyImages[Math.floor(Math.random() * enemyImages.length)];
      const randomWeight = 0.8 + Math.random() * 1.2; // Weight between 0.8 and 2.0
      const randomDirection = Math.random() > 0.5 ? 'right' : 'left';
      const randomVertical = Math.random() > 0.5 ? 'top' : 'bottom';
      const level = 1;
      
      const enemy = new EnemyFish(
        randomX,
        randomY,
        randomImg,
        randomWeight,
        randomDirection,
        randomVertical,
        level
      );
      
      this.enemies.push(enemy);
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
    
    // Update all enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update();
      
    }
  }
}
