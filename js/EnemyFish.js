import Fish from './Fish.js';
import { CONFIG } from '../config/config.js';

export default class EnemyFish extends Fish {
    constructor(x, y, imgSrc, weight, direction, level = 1, useExactPosition = false) {
        const width = 100 * weight;
        const height = 60 * weight;

        let startX;
        if (useExactPosition) {
            startX = x;
        } else if (direction === CONFIG.DIRECTION.LEFT) {
            startX = CONFIG.CANVAS_WIDTH + width;
        } else {
            startX = -width;
        }

        super(startX, y, width, height, imgSrc);

        this.direction = direction;
        this.weight = weight;
        this.level = level;

        const speedMap = [1.8, 1.4, 1.0, 0.7];
        this.speed = speedMap[level] || 1.0;

        this.pickNewTarget();
        this.render();
    }

    pickNewTarget() {
        this.targetX = Math.random() * (CONFIG.CANVAS_WIDTH - this.width);
        this.targetY = Math.random() * (CONFIG.CANVAS_HEIGHT - this.height);
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 5) {
            this.pickNewTarget();
        } else if (distance > 0) {
            this.direction = dx > 0 ? CONFIG.DIRECTION.RIGHT : CONFIG.DIRECTION.LEFT;

            const vx = (dx / distance) * this.speed;
            const vy = (dy / distance) * this.speed;

            this.x += vx;
            this.y += vy;
        }

        this.render();
    }
}