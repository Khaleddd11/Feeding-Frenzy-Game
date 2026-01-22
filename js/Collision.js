import { CONFIG } from '../config/config.js';

export default class Collision {
    // Check if two fish are colliding using tolerance-based hitboxes
    static isColliding(fish1, fish2, tolerance = 0.4) {
        const f1Left = fish1.x + fish1.width * tolerance;
        const f1Right = fish1.x + fish1.width * (1 - tolerance);
        const f1Top = fish1.y + fish1.height * tolerance;
        const f1Bottom = fish1.y + fish1.height * (1 - tolerance);

        const f2Left = fish2.x + fish2.width * tolerance;
        const f2Right = fish2.x + fish2.width * (1 - tolerance);
        const f2Top = fish2.y + fish2.height * tolerance;
        const f2Bottom = fish2.y + fish2.height * (1 - tolerance);

        return (
            f1Left < f2Right &&
            f1Right > f2Left &&
            f1Top < f2Bottom &&
            f1Bottom > f2Top
        );
    }

    // Check if fish1 is facing fish2
    static isFacing(fish1, fish2) {
        const f1CenterX = fish1.x + fish1.width / 2;
        const f2CenterX = fish2.x + fish2.width / 2;
        
        // fish1.direction: 1 = right, -1 = left (for Player)
        // fish1.direction: 'right' or 'left' (for EnemyFish)
        const isDirectionRight = fish1.direction === 1 || fish1.direction === 'right';
        const isDirectionLeft = fish1.direction === -1 || fish1.direction === 'left';
        
        return (
            (isDirectionRight && f2CenterX > f1CenterX) ||
            (isDirectionLeft && f2CenterX < f1CenterX)
        );
    }

    // Check if fish1 can eat fish2 based on level
    static canEat(fish1, fish2) {
        return fish1.level >= fish2.level;
    }

    // Full collision check: colliding + facing + can eat
    static checkEat(eater, prey) {
        return (
            this.isColliding(eater, prey) &&
            this.isFacing(eater, prey) &&
            this.canEat(eater, prey)
        );
    }
}