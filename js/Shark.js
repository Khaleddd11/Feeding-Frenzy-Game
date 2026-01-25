import { CONFIG } from '../config/config.js';

export default class Shark {
    constructor(direction) {
        this.direction = direction;
        this.width = CONFIG.SHARK.WIDTH;
        this.height = CONFIG.SHARK.HEIGHT;
        this.speed = CONFIG.SHARK.SPEED;
        this.level = 99;
        this.isWarning = true;
        
        // Get the game container
        const container = window.gameContainer || document.querySelector('#game') || document.querySelector('#game-container');
        
        if (!container) {
            console.error('Game container not found!');
            return;
        }
        
        // Warning position
        if (direction === CONFIG.DIRECTION.RIGHT) {
            this.warningX = 50;
        } else {
            this.warningX = CONFIG.CANVAS_WIDTH - 200;
        }
        this.warningY = Math.random() * (CONFIG.CANVAS_HEIGHT - this.height - 100) + 50;
        
        // Create warning element
        this.warningElement = document.createElement('div');
        this.warningElement.className = 'shark-warning';
        this.warningElement.innerHTML = '<img src="assets/characters/shark.png" alt="warning">';
        this.warningElement.style.position = 'fixed';
        this.warningElement.style.left = this.warningX + 'px';
        this.warningElement.style.top = this.warningY + 'px';
        this.warningElement.style.zIndex = '15';
        
        const warningImg = this.warningElement.querySelector('img');
        if (direction === CONFIG.DIRECTION.LEFT) {
            warningImg.style.transform = 'scaleX(-1)';
        }
        
        container.appendChild(this.warningElement);
        
        // Create warning text
        this.warningText = document.createElement('div');
        this.warningText.className = 'shark-warning-text';
        this.warningText.textContent = 'WARNING: Shark is COMING!!';
        this.warningText.style.position = 'fixed';
        this.warningText.style.top = '50%';
        this.warningText.style.left = '50%';
        this.warningText.style.transform = 'translate(-50%, -50%)';
        this.warningText.style.fontSize = '48px';
        this.warningText.style.fontWeight = 'bold';
        this.warningText.style.color = 'red';
        this.warningText.style.textShadow = '2px 2px 4px black';
        this.warningText.style.zIndex = '15';
        
        container.appendChild(this.warningText);
        
        console.log('Shark warning created at:', this.warningX, this.warningY);
        
        // After warning, spawn the actual shark
        setTimeout(() => {
            if (this.warningElement && this.warningElement.parentNode) {
                this.warningElement.remove();
            }
            if (this.warningText && this.warningText.parentNode) {
                this.warningText.remove();
            }
            this.isWarning = false;
            this.spawnShark(container);
        }, CONFIG.SHARK.WARNING_DURATION);
    }
    
    spawnShark(container) {
        const gameContainer = container || window.gameContainer || document.querySelector('#game') || document.querySelector('#game-container');
        
        if (!gameContainer) {
            console.error('Cannot spawn shark - container not found!');
            return;
        }
        
        // Start position based on direction
        if (this.direction === CONFIG.DIRECTION.RIGHT) {
            this.x = -this.width - 100;
        } else {
            this.x = CONFIG.CANVAS_WIDTH + 100;
        }
        
        this.y = this.warningY;
        
        this.element = document.createElement('img');
        this.element.src = 'assets/characters/shark.png';
        this.element.className = 'shark-img';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.position = 'fixed';
        this.element.style.zIndex = '10';
        
        gameContainer.appendChild(this.element);
        
        console.log('Shark spawned at:', this.x, this.y);
        this.render();
    }

    update() {
        if (this.isWarning) return;
        
        if (this.direction === CONFIG.DIRECTION.RIGHT) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
        
        this.render();
    }

    render() {
        if (!this.element) return;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.position = 'fixed';
        this.element.style.transform = this.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    }

    destroy() {
        if (this.warningElement && this.warningElement.parentNode) {
            this.warningElement.remove();
        }
        if (this.warningText && this.warningText.parentNode) {
            this.warningText.remove();
        }
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    isOffscreen() {
        if (this.isWarning) return false;
        return this.x < -this.width - 200 || this.x > CONFIG.CANVAS_WIDTH + 200;
    }
}