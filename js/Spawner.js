import EnemyFish from './EnemyFish.js';
import { CONFIG } from '../config/config.js';

export default class Spawner {
    constructor() {
        // Enemy type definitions with their weights and levels
        this.enemyTypes = [
            { 
                name: 'tiny-fry', 
                level: CONFIG.SIZE.TINY,      // 0
                weight: 0.4,                   // smaller than player
                spawnWeight: 70                // 70% - lots of food
            },
            { 
                name: 'swift-minnow', 
                level: CONFIG.SIZE.SMALL,     // 1
                weight: 1.0,
                spawnWeight: 20               // 20% - good food
            },
            { 
                name: 'spotted-reef', 
                level: CONFIG.SIZE.MEDIUM,    // 2
                weight: 1.4,
                spawnWeight: 8                // 8% - rare threat
            },
            { 
                name: 'hunter', 
                level: CONFIG.SIZE.LARGE,     // 3
                weight: 1.8,
                spawnWeight: 2                // 2% - very rare!
            }
        ];
    }

    // Only spawns enemies player can eat + one level higher as threat
    selectEnemyType(playerLevel) {
        // Filter: spawn enemies up to playerLevel + 1 (gives one threat level)
        const maxLevel = playerLevel + 1;
        const availableTypes = this.enemyTypes.filter(t => t.level <= maxLevel);
        
        const totalWeight = availableTypes.reduce((sum, t) => sum + t.spawnWeight, 0);
        let random = Math.random() * totalWeight;
        
        for (const type of availableTypes) {
            random -= type.spawnWeight;
            if (random <= 0) {
                return type;
            }
        }
        // Fallback to first available type
        return availableTypes[0];
    }


    getEnemyByLevel(level) {
        return this.enemyTypes.find(t => t.level === level) || null;
    }

    spawnByLevel(level) {
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        const x = direction === 'right' ? -150 : CONFIG.CANVAS_WIDTH + 150;
        const y = Math.random() * (CONFIG.CANVAS_HEIGHT - 100) + 50;
        
        const enemyType = this.getEnemyByLevel(level);
        if (!enemyType) return null;
        
        const imgSrc = `assets/characters/${enemyType.name}_right_closed.png`;
        
        const enemy = new EnemyFish(
            x, y, imgSrc, 
            enemyType.weight, direction, 'top', 
            enemyType.level
        );
        
        return enemy;
    }

    spawn(playerLevel = 0) {
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        
        // Spawn from opposite edge
        const x = direction === 'right' ? -150 : CONFIG.CANVAS_WIDTH + 150;
        const y = Math.random() * (CONFIG.CANVAS_HEIGHT - 100) + 50;
        
        // Select enemy type based on player level
        const enemyType = this.selectEnemyType(playerLevel);
        const imgSrc = `assets/characters/${enemyType.name}_right_closed.png`;
        
        const enemy = new EnemyFish(
            x, 
            y, 
            imgSrc, 
            enemyType.weight,
            direction, 
            'top', 
            enemyType.level      // IMP: pass the level for collision logic
        );
        
        return enemy;
    }

    // Spawn the APEX boss fish - only when player reaches Level 3
    spawnApex() {
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        const x = direction === 'right' ? -50 : CONFIG.CANVAS_WIDTH + 50;
        const y = CONFIG.CANVAS_HEIGHT / 2; // Spawn in middle
        
        const imgSrc = 'assets/characters/apex_right_closed.png';
        
        // Apex is Level 4 (BOSS - player at Level 3 CANNOT eat it!)
        const apex = new EnemyFish(
            x,
            y,
            imgSrc,
            2.5,
            direction,
            'top',
            4,          // Level 4 - BOSS, player can't eat this!
            true        // spawn at exact x coordinate
        );
        
        // apex moves faster
        apex.speed = 2.5;
        apex.isApex = true;
        return apex;
    }
}
