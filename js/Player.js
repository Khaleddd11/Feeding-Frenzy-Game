import { CONFIG } from '../config/config.js';
import Fish from './Fish.js';

export default class Player extends Fish {
    static instance = null;

    constructor(x, y, imagesArray) {
        if (Player.instance) {
            return Player.instance;
        }
        super(x, y, 
              CONFIG.PLAYER.START_WIDTH, 
              CONFIG.PLAYER.START_HEIGHT, 
              imagesArray[CONFIG.SIZE.TINY]);

        Player.instance = this;

        this.images = imagesArray; 
        this.level = CONFIG.SIZE.TINY; 
        this.score = 0;
        this.speed = CONFIG.PLAYER.ACCELERATION;
        this.direction = 'right';  // Default direction
    }

    update(mouseX, mouseY) {
        // flip direction based on movement
        if (mouseX > this.x) {
            if (this.direction !== 'right') {
                this.direction = 'right';
                this.updateSprite();
            }
        } else if (mouseX < this.x) {
            if (this.direction !== 'left') {
                this.direction = 'left';
                this.updateSprite();
            }
        }

        this.x += (mouseX - this.x) * this.speed;
        this.y += (mouseY - this.y) * this.speed;
        this.x = Math.max(0, Math.min(this.x, CONFIG.CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CONFIG.CANVAS_HEIGHT - this.height));
        this.render();
    }

    // update player direction
    updateSprite() {
        const currentSrc = this.element.src;
        if (this.direction === 'left') {
            this.element.src = currentSrc.replace('_right_', '_left_');
        } else {
            this.element.src = currentSrc.replace('_left_', '_right_');
        }
    }

    grow() {
        this.score += CONFIG.PLAYER.EAT_POINTS; 
        this.width += CONFIG.PLAYER.GROWTH_WIDTH;
        this.height += CONFIG.PLAYER.GROWTH_HEIGHT;

        const oldLevel = this.level;

        if (this.score >= CONFIG.THRESHOLD.LARGE) {
            this.level = CONFIG.SIZE.LARGE;
        } else if (this.score >= CONFIG.THRESHOLD.MEDIUM) {
            this.level = CONFIG.SIZE.MEDIUM;
        } else if (this.score >= CONFIG.THRESHOLD.SMALL) {
            this.level = CONFIG.SIZE.SMALL;
        }

        if (this.level !== oldLevel) {
            this.element.src = this.images[this.level];
            this.updateSprite();
        }
        this.render();
    }
}