import EnemyFish from "./EnemyFish.js";
import { CONFIG } from "../config/config.js";

export default class Spawner {
  constructor() {
    this.enemyTypes = [
      {
        name: "tiny-fry",
        level: CONFIG.SIZE.TINY,
        weight: 0.4,
        spawnWeight: 50,
      },
      {
        name: "swift-minnow",
        level: CONFIG.SIZE.SMALL,
        weight: 1.0,
        spawnWeight: 30,
      },
      {
        name: "spotted-reef",
        level: CONFIG.SIZE.MEDIUM,
        weight: 1.4,
        spawnWeight: 15,
      },
      { name: "hunter", level: CONFIG.SIZE.LARGE, weight: 1.8, spawnWeight: 5 },
    ];
  }

  selectEnemyType(playerLevel) {
    const availableTypes = this.enemyTypes.filter(
      (t) => t.level <= playerLevel + 1,
    );

    const weightedTypes = availableTypes.map((type) => {
      let weight = type.spawnWeight;

      if (type.level === playerLevel) {
        weight = type.spawnWeight * 2.0;
      } else if (type.level === playerLevel + 1) {
        weight = type.spawnWeight * 1.5;
      } else if (type.level === playerLevel - 1) {
        weight = type.spawnWeight * 0.8;
      } else if (type.level < playerLevel - 1) {
        const levelDiff = playerLevel - type.level;
        const reductionFactor = Math.pow(0.3, levelDiff);
        weight = type.spawnWeight * reductionFactor;
      }

      return { ...type, currentWeight: weight };
    });

    const totalWeight = weightedTypes.reduce(
      (sum, t) => sum + t.currentWeight,
      0,
    );
    let random = Math.random() * totalWeight;

    for (const type of weightedTypes) {
      random -= type.currentWeight;
      if (random <= 0) return type;
    }

    return availableTypes[0];
  }

  getEnemyByLevel(level) {
    return this.enemyTypes.find((t) => t.level === level) || null;
  }

  getRandomDirection() {
    return Math.random() > 0.5 ? CONFIG.DIRECTION.RIGHT : CONFIG.DIRECTION.LEFT;
  }

  spawn(playerLevel = 0) {
    const direction = this.getRandomDirection();

    const x =
      direction === CONFIG.DIRECTION.RIGHT ? -200 : window.innerWidth + 200;
    const y = Math.random() * (window.innerHeight - 150) + 75;

    const enemyType = this.selectEnemyType(playerLevel);

    const imgSrc = `assets/characters/${enemyType.name}_right_closed.png`;

    return new EnemyFish(
      x,
      y,
      imgSrc,
      enemyType.weight,
      direction,
      enemyType.level,
    );
  }

  spawnApex() {
    const direction = this.getRandomDirection();
    const x =
      direction === CONFIG.DIRECTION.RIGHT ? -150 : window.innerWidth + 150;
    const y = Math.random() * (window.innerHeight - 150) + 75;

    const imgSrc = "assets/characters/apex_right_closed.png";
    const apex = new EnemyFish(x, y, imgSrc, 2.5, direction, 3, true);

    apex.speed = 2.5;
    apex.isApex = true;
    return apex;
  }
}
