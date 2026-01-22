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
        this.direction = 1;  
    }

     update(mouthX, mouthY) {
        const dx = mouthX - this.x;

        if (dx !== 0) {
         this.direction = dx < 0 ? -1 : 1;
     }

         this.x += (mouthX - this.x) * this.speed;
         this.y += (mouthY - this.y) * this.speed;
         this.x = Math.max(0, Math.min(this.x, CONFIG.CANVAS_WIDTH - this.width));
         this.y = Math.max(0, Math.min(this.y, CONFIG.CANVAS_HEIGHT - this.height));
         this.render();
     }
  

    grow() {
        this.score += CONFIG.PLAYER.EAT_POINTS; 

        const oldLevel = this.level;

        // Check for level up
        if (this.score >= CONFIG.THRESHOLD.LARGE) {
            this.level = CONFIG.SIZE.LARGE;
        } else if (this.score >= CONFIG.THRESHOLD.MEDIUM) {
            this.level = CONFIG.SIZE.MEDIUM;
        } else if (this.score >= CONFIG.THRESHOLD.SMALL) {
            this.level = CONFIG.SIZE.SMALL;
        }

        if (this.level !== oldLevel) {
            // Size jumps to match enemy sizes at each level
            const sizeMap = [
                { width: 55, height: 45 },    // Level 0 - smaller than tiny-fry
                { width: 110, height: 70 },   // Level 1 - can eat swift-minnow
                { width: 155, height: 100 },  // Level 2 - can eat spotted-reef
                { width: 200, height: 130 }   // Level 3 - can eat hunter, ready for apex
            ];
            
            this.width = sizeMap[this.level].width;
            this.height = sizeMap[this.level].height;
            this.element.src = this.images[this.level];
        } else {
            // Small growth per eat (within same level)
            this.width += 1;
            this.height += 0.8;
        }
        
        this.openMouth();        
        this.render();
    }

    openMouth() {
        const currentSrc = this.element.src;
        this.element.src = currentSrc.replace('_closed', '_open');
        
        setTimeout(() => {
            this.element.src = this.element.src.replace('_open', '_closed');
        }, 200);
    }
}