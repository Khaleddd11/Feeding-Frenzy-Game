import EnemyFish from './EnemyFish.js';
import { CONFIG } from '../config/config.js';

export default class Spawner {
    constructor() {
        this.enemyTypes = [
            { name: 'tiny-fry', level: CONFIG.SIZE.TINY, weight: 0.4, spawnWeight: 70 },
            { name: 'swift-minnow', level: CONFIG.SIZE.SMALL, weight: 1.0, spawnWeight: 20 },
            { name: 'spotted-reef', level: CONFIG.SIZE.MEDIUM, weight: 1.4, spawnWeight: 8 },
            { name: 'hunter', level: CONFIG.SIZE.LARGE, weight: 1.8, spawnWeight: 2 }
        ];
    }

  selectEnemyType(playerLevel) {
    const availableTypes = this.enemyTypes.filter(t => t.level <= playerLevel + 1);

    const weightedTypes = availableTypes.map(type => {
        let weight = type.spawnWeight;

        if (type.level === playerLevel) {
            weight = type.spawnWeight * 1.5; 
        } 
        else if (type.level === playerLevel + 1) {
            weight = type.spawnWeight * 1.0;
        } 
        else if (type.level < playerLevel) {
            const levelDiff = playerLevel - type.level;
            const reductionFactor = Math.pow(0.4, levelDiff); 
            weight = type.spawnWeight * reductionFactor;
        }

        return { ...type, currentWeight: weight };
    });

    const totalWeight = weightedTypes.reduce((sum, t) => sum + t.currentWeight, 0);
    let random = Math.random() * totalWeight;

    for (const type of weightedTypes) {
        random -= type.currentWeight;
        if (random <= 0) return type;
    }

    return availableTypes[0];
}

    getEnemyByLevel(level) {
        return this.enemyTypes.find(t => t.level === level) || null;
    }

    getRandomDirection() {
        return Math.random() > 0.5 ? CONFIG.DIRECTION.RIGHT : CONFIG.DIRECTION.LEFT;
    }

    spawnByLevel(level) {
        const direction = this.getRandomDirection();
        const x = direction === CONFIG.DIRECTION.RIGHT ? -150 : CONFIG.CANVAS_WIDTH + 150;
        const y = Math.random() * (CONFIG.CANVAS_HEIGHT - 100) + 50;

        const enemyType = this.getEnemyByLevel(level);
        if (!enemyType) return null;

        const imgSrc = `assets/characters/${enemyType.name}_right_closed.png`;
        return new EnemyFish(x, y, imgSrc, enemyType.weight, direction, enemyType.level);
    }

    spawn(playerLevel = 0) {
        const direction = this.getRandomDirection();
        const x = direction === CONFIG.DIRECTION.RIGHT ? -150 : CONFIG.CANVAS_WIDTH + 150;
        const y = Math.random() * (CONFIG.CANVAS_HEIGHT - 100) + 50;

        const enemyType = this.selectEnemyType(playerLevel);
        const imgSrc = `assets/characters/${enemyType.name}_right_closed.png`;

        return new EnemyFish(x, y, imgSrc, enemyType.weight, direction, enemyType.level);
    }

    spawnApex() {
        const direction = this.getRandomDirection();
        const x = direction === CONFIG.DIRECTION.RIGHT ? -50 : CONFIG.CANVAS_WIDTH + 50;
        const y = CONFIG.CANVAS_HEIGHT / 2;

        const imgSrc = 'assets/characters/apex_right_closed.png';
        const apex = new EnemyFish(x, y, imgSrc, 2.5, direction, 4, true);

        apex.speed = 2.5;
        apex.isApex = true;
        return apex;
    }
}
