import { CONFIG } from '../config/config.js';
import Fish from './Fish.js';

export default class Player extends Fish {
    static instance = null;

    constructor(x, y, imagesArray) {
        if (Player.instance) {
            return Player.instance;
        }

        super(x, y, CONFIG.PLAYER.START_WIDTH, CONFIG.PLAYER.START_HEIGHT, imagesArray[CONFIG.SIZE.TINY]);

        Player.instance = this;
        this.images = imagesArray;
        this.level = CONFIG.SIZE.TINY;
        this.score = 0;
        this.speed = CONFIG.PLAYER.ACCELERATION;
        this.direction = CONFIG.DIRECTION.RIGHT;
    }

    update(mouthX, mouthY) {
        const dx = mouthX - this.x;

        if (dx !== 0) {
            this.direction = dx < 0 ? CONFIG.DIRECTION.LEFT : CONFIG.DIRECTION.RIGHT;
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

        if (this.score >= CONFIG.THRESHOLD.LARGE) {
            this.level = CONFIG.SIZE.LARGE;
        } else if (this.score >= CONFIG.THRESHOLD.MEDIUM) {
            this.level = CONFIG.SIZE.MEDIUM;
        } else if (this.score >= CONFIG.THRESHOLD.SMALL) {
            this.level = CONFIG.SIZE.SMALL;
        }

        if (this.level !== oldLevel) {
            this.width = CONFIG.sizeMap[this.level].width;
            this.height = CONFIG.sizeMap[this.level].height;
            this.element.src = this.images[this.level];
        } else {
            this.width += 1;
            this.height += 0.8;
        }

        this.openMouth();
        this.render();
    }
}