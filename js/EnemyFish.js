import Fish from './Fish.js';
import { CONFIG } from '../config/config.js';

export default class EnemyFish extends Fish {
    constructor(x, y, imgSrc, weight, direction, directionVertical, level = 1, useExactPosition = false) {
        // Calculate size based on weight
        const width = 100 * weight;
        const height = 60 * weight;
        
        // Calculate starting X position unless exact position is requested
        let startX;
        if (useExactPosition) {
            startX = x;  // Use exact x for apex/special spawns
        } else if (direction === "left") {
            startX = CONFIG.CANVAS_WIDTH + width;
        } else {
            startX = -width;
        }

        // Use the image path directly as provided
        super(startX, y, width, height, imgSrc);
        
        this.direction = direction;
        this.directionVertical = directionVertical;
        this.imgSrc = imgSrc;
        this.weight = weight;
        this.level = level;
        
        // smaller fish are FASTER
        const speedMap = [1.8, 1.4, 1.0, 0.7];
        this.speed = speedMap[level] || 1.0;

        // for debug
        // this.fishName = imgSrc.split('/').pop().split('_')[0];

        this.updateSprite();

        // random target point inside the container
        this.pickNewTarget();
    }

    pickNewTarget() {
        this.targetX = Math.random() * (CONFIG.CANVAS_WIDTH - this.width);
        this.targetY = Math.random() * (CONFIG.CANVAS_HEIGHT - this.height);
    }

    update() {
        // move smoothly towards current target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.hypot(dx, dy);

        // if close enough, choose a new random target
        if (distance < 5) {
            this.pickNewTarget();
        } else if (distance > 0) {
            // Determine movement direction and flip sprite if needed
            const newDirection = dx > 0 ? 'right' : 'left';
            if (newDirection !== this.direction) {
                this.direction = newDirection;
                this.updateSprite();
            }

            const vx = (dx / distance) * this.speed;
            const vy = (dy / distance) * this.speed;

            this.x += vx;
            this.y += vy;
        }

        // Only keep Y inside bounds (vertical movement still bounded)
        // X can go off-screen freely (open ocean)
        this.y = Math.max(0, Math.min(this.y, CONFIG.CANVAS_HEIGHT - this.height));

        this.render();
    }

    updateSprite() {
        const currentSrc = this.element.src;
        if (this.direction === 'left') {
            this.element.src = currentSrc.replace('_right_', '_left_');
        } else {
            this.element.src = currentSrc.replace('_left_', '_right_');
        }
    }

    openMouth() {
        const currentSrc = this.element.src;
        this.element.src = currentSrc.replace('_closed.png', '_open.png');
        
        setTimeout(() => {
            if (this.element) {  // if still exists
                this.element.src = this.element.src.replace('_open.png', '_closed.png');
            }
        }, 200);
    }
}