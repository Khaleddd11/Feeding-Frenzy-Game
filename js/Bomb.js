import { CONFIG } from '../config/config.js';

export default class Bomb {
    constructor() {
        this.x = Math.random() * (CONFIG.CANVAS_WIDTH - 100) + 50;
        this.y = -80;
        this.speed = CONFIG.BOMB.SPEED;
        this.width = CONFIG.BOMB.WIDTH;
        this.height = CONFIG.BOMB.HEIGHT;
        this.exploded = false;
        this.explosionRadius = CONFIG.BOMB.EXPLOSION_RADIUS;
        
        const container = window.gameContainer || document.querySelector('#game') || document.querySelector('#game-container');
        
        if (!container) {
            console.error('Game container not found for bomb!');
            return;
        }
        
        this.element = document.createElement('img');
        this.element.src = 'assets/characters/bomb.png';
        this.element.className = 'bomb-img';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.position = 'fixed';
        this.element.style.zIndex = '10';
        
        container.appendChild(this.element);
        
        console.log('Bomb created at:', this.x, this.y);
        this.render();
    }

    update() {
        if (!this.exploded) {
            this.y += this.speed;
            this.render();
        }
    }

    render() {
        if (!this.element) return;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.position = 'fixed';
    }

    explode() {
        if (this.exploded) return;
        
        this.exploded = true;
        this.element.src = 'assets/characters/boom.png';
        
        console.log('BOOM! Bomb exploded at:', this.x, this.y);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    isOffscreen() {
        return this.y > CONFIG.CANVAS_HEIGHT + 100;
    }

   checkCollision(target) {
    const padding = 20; 
    return (
        this.x + padding < target.x + target.width - padding &&
        this.x + this.width - padding > target.x + padding &&
        this.y + padding < target.y + target.height - padding &&
        this.y + this.height - padding > target.y + padding
    );
}
}