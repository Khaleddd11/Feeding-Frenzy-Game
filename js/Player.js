import { CONFIG } from '../config/config.js';
import { Fish } from './Fish.js';

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
    }

    update(mouseX, mouseY) {
        this.x += (mouseX - this.x) * this.speed;
        this.y += (mouseY - this.y) * this.speed;
        this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));
        this.render();
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
            
        }
        this.render();
    }
}