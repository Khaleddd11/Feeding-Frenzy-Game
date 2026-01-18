import Player from './Player.js';

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
    
    this.setupInput();
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
  }
}
