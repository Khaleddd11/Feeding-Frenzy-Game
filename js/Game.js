import Player from "./Player.js";
import EnemyFish from "./EnemyFish.js";
import Spawner from "./Spawner.js";
import Shark from "./Shark.js";
import Bomb from "./Bomb.js";
import { CONFIG } from "../config/config.js";

// Score popup effect when eating fish
function spawnEatEffect(x, y, points) {
  const container = document.querySelector("#game");
  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.textContent = `+${points}`;
  popup.style.cssText = `position: fixed; left: ${x}px; top: ${y}px; z-index: 100;`;
  container.appendChild(popup);
  setTimeout(() => popup.remove(), 800);
}

export default class Game {
  constructor(container) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.frameCount = 0;

    this.state = "STORY"; // Start with story
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;

    this.highScoreKey = "feeding-frenzy-high-score";
    this.highScore = this.loadHighScore();

    this.eatSound = new Audio("assets/audio/eat.mp3");
    this.eatSound.preload = "auto";

    this.gameOverSound = new Audio("assets/audio/game_over.mp3");
    this.gameOverSound.preload = "auto";

    this.winSound = new Audio("assets/audio/congratulation.wav");
    this.winSound.preload = "auto";

    this.bombHitSound = new Audio("assets/audio/bomb.mp3");
    this.bombHitSound.preload = "auto";

    this.backgroundMusic = new Audio("assets/audio/backgroundMusic.mp3");
    this.backgroundMusic.preload = "auto";
    this.backgroundMusic.loop = true;

    const playerImages = [
      "assets/characters/hero1_right_closed.png",
      "assets/characters/hero2_right_closed.png",
      "assets/characters/hero3_right_closed.png",
      "assets/characters/hero4_right_closed.png",
    ];

    this.player = new Player(this.width / 2, this.height / 2, playerImages);
    this.player.hide(); // Hide player until game starts
    this.enemies = [];
    this.sharks = [];
    this.bombs = [];
    this.spawner = new Spawner();

    this.lastSpawnTime = 0;
    this.spawnInterval = 1500;
    this.maxEnemies = 15;

    this.apexSpawned = false;
    this.storySlide = 0;

    // Endless Mode properties
    this.isEndlessMode = false;
    this.endlessStartScore = 0;
    this.endlessApexCount = 0;
    this.endlessSpeedMultiplier = 1.0;

    // Sound control properties
    this.musicMuted = false;
    this.sfxMuted = false;

    this.createProgressBar();
    this.setupInput();
    this.setupStory();
    this.setupEndScreen();
    this.setupSoundControls();
  }

  setupSoundControls() {
    const musicBtn = document.getElementById("music-toggle");
    const sfxBtn = document.getElementById("sfx-toggle");

    musicBtn.addEventListener("click", () => {
      this.musicMuted = !this.musicMuted;
      musicBtn.classList.toggle("muted", this.musicMuted);
      musicBtn.querySelector(".sound-on").style.display = this.musicMuted
        ? "none"
        : "inline";
      musicBtn.querySelector(".sound-off").style.display = this.musicMuted
        ? "inline"
        : "none";

      if (this.backgroundMusic) {
        this.backgroundMusic.muted = this.musicMuted;
      }
    });

    sfxBtn.addEventListener("click", () => {
      this.sfxMuted = !this.sfxMuted;
      sfxBtn.classList.toggle("muted", this.sfxMuted);
      sfxBtn.querySelector(".sfx-on").style.display = this.sfxMuted
        ? "none"
        : "inline";
      sfxBtn.querySelector(".sfx-off").style.display = this.sfxMuted
        ? "inline"
        : "none";
    });
  }

  playEatSound() {
    if (!this.eatSound || this.sfxMuted) return;
    this.eatSound.currentTime = 0;
    this.eatSound.play().catch(() => {});
  }

  loadHighScore() {
    try {
      const storedScore = localStorage.getItem(this.highScoreKey);
      const score = Number(storedScore);
      //  Validation: If it's a valid number, use it. If not (or if it's null), return 0.
      return Number.isFinite(score) ? score : 0;
    } catch {
      return 0;
    }
  }

  saveHighScore(score) {
    try {
      localStorage.setItem(this.highScoreKey, String(score));
    } catch {
      // Ignore storage errors maybe because of browser settings (private mode / blocked storage)
    }
  }

  updateHighScore() {
    if (this.player.score > this.highScore) {
      this.highScore = this.player.score;
      this.saveHighScore(this.highScore);
    }
    return this.highScore;
  }

  playGameOverSound() {
    if (!this.gameOverSound || this.sfxMuted) return;
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch(() => {});
  }

  playWinSound() {
    if (!this.winSound || this.sfxMuted) return;
    this.winSound.currentTime = 0;
    this.winSound.play().catch(() => {});
  }

  playBombHitSound() {
    if (!this.bombHitSound || this.sfxMuted) return;
    this.bombHitSound.currentTime = 0;
    this.bombHitSound.play().catch(() => {});
  }

  startBackgroundMusic() {
    if (!this.backgroundMusic) return;
    this.backgroundMusic.play().catch(() => {});
  }

  stopBackgroundMusic() {
    if (!this.backgroundMusic) return;
    this.backgroundMusic.pause();
  }

  spawnShark() {
    // More sharks in endless mode (3x more frequent)
    const maxSharks = this.isEndlessMode ? 2 : CONFIG.SHARK.MAX_COUNT;
    const interval = this.isEndlessMode
      ? Math.floor(CONFIG.SHARK.SPAWN_INTERVAL / 3)
      : CONFIG.SHARK.SPAWN_INTERVAL;

    if (this.sharks.length >= maxSharks) return;
    if (this.frameCount % interval !== 0) return;

    const direction =
      Math.random() > 0.5 ? CONFIG.DIRECTION.RIGHT : CONFIG.DIRECTION.LEFT;
    const shark = new Shark(direction);
    this.sharks.push(shark);
  }

  spawnBomb() {
    // More bombs in endless mode (2x more frequent)
    const interval = this.isEndlessMode
      ? Math.floor(CONFIG.BOMB.SPAWN_INTERVAL / 2)
      : CONFIG.BOMB.SPAWN_INTERVAL;

    if (this.frameCount % interval !== 0) return;
    const bomb = new Bomb();

    this.bombs.push(bomb);
  }

  setupStory() {
    this.updateStorySlide();

    document.getElementById("next-btn").addEventListener("click", () => {
      this.startBackgroundMusic();
      this.storySlide++;
      if (this.storySlide < CONFIG.STORY_SLIDES.length) {
        this.updateStorySlide();

        // Change button text to "PLAY" on last slide
        if (this.storySlide === CONFIG.STORY_SLIDES.length - 1) {
          document.getElementById("next-btn").textContent = "PLAY";
        }
      } else {
        this.showLoadingTransition();
      }
    });

    document.getElementById("skip-btn").addEventListener("click", () => {
      this.startBackgroundMusic();
      this.showLoadingTransition();
    });
  }

  updateStorySlide() {
    const slide = CONFIG.STORY_SLIDES[this.storySlide];
    document.getElementById("story-title").textContent = slide.title;
    document.getElementById("story-text").textContent = slide.text;
    document.getElementById("story-avatar").src = slide.imgSrc;
  }

  showLoadingTransition() {
    document.getElementById("story-container").classList.add("hidden");
    const transition = document.getElementById("bubble-transition");
    transition.classList.remove("hidden");

    setTimeout(() => {
      transition.classList.add("hidden");
      document.getElementById("ui-layer").classList.remove("hidden");
      this.start();
    }, 2600);
  }

  setupEndScreen() {
    document.getElementById("restart-btn").addEventListener("click", () => {
      this.restart();
    });

    // Endless Mode button - only shown after winning
    document.getElementById("endless-btn").addEventListener("click", () => {
      this.startEndlessMode();
    });
  }

  startEndlessMode() {
    // Hide end screen
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("endless-btn").classList.add("hidden");

    // Clear all dangerous entities for a fresh start
    this.sharks.forEach((s) => s.destroy());
    this.bombs.forEach((b) => b.destroy());
    this.enemies.forEach((e) => e.destroy());
    this.sharks = [];
    this.bombs = [];
    this.enemies = [];

    // Set endless mode flag
    this.isEndlessMode = true;
    this.endlessStartScore = this.player.score;
    this.endlessApexCount = 0;
    this.endlessSpeedMultiplier = 1.0;

    // Reset some properties but keep player state
    this.frameCount = 0;
    this.state = "PLAYING";

    // Reset player position to center for safety
    this.player.x = this.width / 2;
    this.player.y = this.height / 2;

    // Show player
    this.player.show();

    // Start background music again
    this.startBackgroundMusic();

    // Show endless mode announcement
    const announcement = document.createElement("div");
    announcement.className = "level-announcement";
    announcement.textContent = "🔥 ENDLESS MODE 🔥";
    announcement.style.color = "#ff6b6b";
    this.container.appendChild(announcement);
    setTimeout(() => announcement.remove(), 2000);

    // Update progress bar text for endless
    this.progressText.textContent = "ENDLESS MODE - SURVIVE!";
    this.progressFill.style.background =
      "linear-gradient(90deg, #ff6b6b, #ffa500)";
    this.progressFill.style.width = "100%";

    // Spawn initial Apex for endless (after a short delay for safety)
    setTimeout(() => {
      if (this.state === "PLAYING" && this.isEndlessMode) {
        this.enemies.push(this.spawner.spawnApex());
        this.endlessApexCount++;
      }
    }, 1000);

    this.gameLoop();
  }

  restart() {
    // Clear all entities
    this.enemies.forEach((e) => e.destroy());
    this.sharks.forEach((s) => s.destroy());
    this.bombs.forEach((b) => b.destroy());

    this.enemies = [];
    this.sharks = [];
    this.bombs = [];
    this.frameCount = 0;
    this.apexSpawned = false;

    // Reset endless mode
    this.isEndlessMode = false;
    this.endlessStartScore = 0;
    this.endlessApexCount = 0;
    this.endlessSpeedMultiplier = 1.0;

    // Reset player
    this.player.reset();

    // Hide end screen and endless button
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("endless-btn").classList.add("hidden");

    // Reset progress bar
    this.progressFill.style.background =
      "linear-gradient(90deg, #4CAF50, #8BC34A)";

    // Restart background music from beginning
    if (this.backgroundMusic) {
      this.backgroundMusic.currentTime = 0;
      this.startBackgroundMusic();
    }

    // Start game
    this.start();
  }

  spawnEnemy() {
    if (this.enemies.length >= this.maxEnemies) return;
    const enemy = this.spawner.spawn(this.player.level);
    if (enemy) {
      if (this.isEndlessMode) {
        enemy.speed *= this.endlessSpeedMultiplier;
      }
      this.enemies.push(enemy);
    }
  }

  setupInput() {
    this.container.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }

  start() {
    this.state = "PLAYING";
    this.player.show(); // Show player when game starts
    document.getElementById("ui-layer").classList.remove("hidden");
    this.updateUI();

    const announcement = document.createElement("div");
    announcement.className = "level-announcement";
    announcement.textContent = "LEVEL 1";
    this.container.appendChild(announcement);

    setTimeout(() => announcement.remove(), 2000);

    // Show thought bubble with target fish
    this.showThoughtBubble();

    for (let i = 0; i < 5; i++) this.spawnEnemy();

    this.gameLoop();
  }

  showThoughtBubble() {
    const targetData = this.spawner.enemyTypes[this.player.level];
    if (!targetData || this.state !== "PLAYING") return;

    this.bubble = document.createElement("div");
    this.bubble.style.cssText = `
      position: fixed;
      background: #e8f5e9;
      border: 3px solid #4caf50;
      border-radius: 15px;
      padding: 15px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      z-index: 99999;
      pointer-events: none;
      transform: translateX(-50%);
      left: ${this.player.x + this.player.width / 2}px;
      top: ${this.player.y - 100}px;
    `;
    this.bubble.innerHTML = `
      <img src="assets/characters/${targetData.name}_right_closed.png" style="width: 60px;">
      <span style="font-family: 'Fredoka One', cursive; font-size: 1.2rem; color: #2e7d32;">Yummy!</span>
    `;
    document.body.appendChild(this.bubble);

    // Follow player
    this.bubbleInterval = setInterval(() => {
      if (!this.bubble) return;
      this.bubble.style.left = this.player.x + this.player.width / 2 + "px";
      this.bubble.style.top = this.player.y - 100 + "px";
    }, 16);

    setTimeout(() => this.hideThoughtBubble(), 3000);
  }

  hideThoughtBubble() {
    if (this.bubbleInterval) clearInterval(this.bubbleInterval);
    if (this.bubble) this.bubble.remove();
    this.bubble = null;
    this.bubbleInterval = null;
  }

  gameLoop() {
    if (this.state === "PLAYING") {
      this.update();
      this.frameCount++;
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  update() {
    if (this.state !== "PLAYING") return;

    // Check win condition FIRST - before any collisions can kill the player
    // This prevents the race condition where shark can kill you in the same frame you win
    if (!this.isEndlessMode && this.player.score >= CONFIG.THRESHOLD.WIN) {
      this.win();
      return;
    }

    // Progressive difficulty for Endless Mode
    if (this.isEndlessMode) {
      const endlessScore = this.player.score - this.endlessStartScore;

      // Increase speed multiplier every 100 points (up to 2x)
      this.endlessSpeedMultiplier = Math.min(1.0 + endlessScore / 500, 2.0);

      const expectedApexes = 1 + Math.floor(endlessScore / 100);
      if (expectedApexes > this.endlessApexCount && this.endlessApexCount < 5) {
        this.enemies.push(this.spawner.spawnApex());
        this.endlessApexCount++;
      }

      // Faster spawns and more enemies in endless
      this.maxEnemies = Math.min(15 + Math.floor(endlessScore / 50), 35);
      this.spawnInterval = Math.max(300, 800 - Math.floor(endlessScore / 2));

      // Update endless progress display
      this.progressText.textContent = `ENDLESS - Score: ${this.player.score} | Speed: ${Math.round(this.endlessSpeedMultiplier * 100)}%`;
    } else {
      this.maxEnemies = Math.min(10 + this.player.level * 4, 25);
      this.spawnInterval = Math.max(600, 1400 - this.player.level * 200);
    }

    this.player.update(this.mouseX, this.mouseY);

    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
      const spawnCount = this.player.level >= 2 ? 2 : 1;
      for (let i = 0; i < spawnCount; i++) {
        this.spawnEnemy();
      }
      this.lastSpawnTime = currentTime;
    }

    this.spawnShark();
    this.spawnBomb();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update();
    }

    for (let i = this.sharks.length - 1; i >= 0; i--) {
      const shark = this.sharks[i];
      shark.update();

      if (!shark.isWarning) {
        if (this.checkSharkCollision(shark, this.player)) {
          this.gameOver("You were eaten by Eng. Mahmoud!");
          return;
        }

        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          // Don't let sharks eat the Apex boss!
          if (!enemy.isApex && this.checkSharkCollision(shark, enemy)) {
            enemy.destroy();
            this.enemies.splice(j, 1);
          }
        }
      }

      if (shark.isOffscreen && shark.isOffscreen()) {
        shark.destroy();
        this.sharks.splice(i, 1);
      }
    }

    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const bomb = this.bombs[i];
      bomb.update();

      if (!bomb.exploded) {
        if (bomb.checkCollision(this.player)) {
          // Play bomb sound on hit
          this.playBombHitSound();
          bomb.explode();
          // Delay gameover sound slightly so it won't overlap the bomb-hit sound
          this.gameOver("You were hit by a bomb!", 400);
          return;
        }

        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          // Don't let bombs destroy the Apex boss!
          if (!enemy.isApex && bomb.checkCollision(enemy)) {
            // Play bomb sound on hit
            this.playBombHitSound();
            bomb.explode();
            enemy.destroy();
            this.enemies.splice(j, 1);
          }
        }

        if (bomb.y > CONFIG.CANVAS_HEIGHT - 100) {
          bomb.explode();
        }
      }

      if (bomb.exploded) {
        bomb.destroy();
        this.bombs.splice(i, 1);
      }

      if (bomb.isOffscreen()) {
        bomb.destroy();
        this.bombs.splice(i, 1);
      }
    }

    this.cleanupOffscreenEnemies();

    if (this.player.level >= 3 && !this.apexSpawned) {
      this.apexSpawned = true;
      this.enemies.push(this.spawner.spawnApex());
    }

    this.checkPlayerCollisions();
    this.checkEnemyCollisions();
    this.updateProgressBar();
    this.updateUI();
  }

  cleanupOffscreenEnemies() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      // Don't cleanup Apex - it's the boss and must stay!
      if (
        !enemy.isApex &&
        (enemy.x < -200 || enemy.x > CONFIG.CANVAS_WIDTH + 200)
      ) {
        enemy.destroy();
        this.enemies.splice(i, 1);
      }
    }
  }

  checkPlayerCollisions() {
    if (this.state !== "PLAYING") return;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (this.player.isColliding(enemy)) {
        // Apex is invincible - player can NEVER eat it
        if (enemy.isApex) {
          enemy.openMouth();
          setTimeout(() => this.gameOver("You were eaten by the Apex!"), 100);
          break;
        }

        if (this.player.level >= enemy.level) {
          // Spawn particle effects
          spawnEatEffect(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            CONFIG.PLAYER.EAT_POINTS,
          );

          enemy.destroy();
          this.enemies.splice(i, 1);

          const oldLevel = this.player.level;
          this.playEatSound();
          this.player.grow();

          // Show thought bubble when level changes
          if (this.player.level !== oldLevel) {
            this.showThoughtBubble();
          }

          this.updateProgressBar();
          this.updateUI();

          // Only trigger win in normal mode, not endless
          if (!this.isEndlessMode && this.player.score >= CONFIG.THRESHOLD.WIN)
            this.win();
        } else {
          enemy.openMouth();
          setTimeout(() => this.gameOver(), 100); // Delay to show mouth animation
          break;
        }
      }
    }
  }

  gameOver(message = "You were eaten!", soundDelayMs = 0) {
    if (this.state === "GAME_OVER") return;
    this.state = "GAME_OVER";
    const highScore = this.updateHighScore();
    this.stopBackgroundMusic();
    if (soundDelayMs > 0) {
      setTimeout(() => {
        // If player restarted quickly, don't play delayed gameover sound
        if (this.state === "GAME_OVER") this.playGameOverSound();
      }, soundDelayMs);
    } else {
      this.playGameOverSound();
    }
    this.player.hide();
    this.hideThoughtBubble();
    document.getElementById("end-title").textContent = "GAME OVER";
    document.getElementById("end-msg").innerHTML = `
      <div class="death-reason">${message}</div>
      <div class="score-display">
        <div class="score-item"><span class="score-label">🐟 Final Score</span><span class="score-value">${this.player.score}</span></div>
        <div class="score-item"><span class="score-label">🏆 High Score</span><span class="score-value">${highScore}</span></div>
      </div>
    `;
    document.getElementById("end-screen").classList.remove("hidden");
  }

  win() {
    this.state = "WIN";
    const highScore = this.updateHighScore();
    this.stopBackgroundMusic();
    this.playWinSound();

    // Show VICTORY announcement
    const announcement = document.createElement("div");
    announcement.className = "level-announcement";
    announcement.textContent = "VICTORY!";
    document.querySelector("#game").appendChild(announcement);

    setTimeout(() => {
      announcement.remove();
      document.getElementById("end-title").textContent = "VICTORY!";
      document.getElementById("end-msg").innerHTML = `
        <div class="death-reason">You are the Ocean King! 👑</div>
        <div class="score-display">
          <div class="score-item"><span class="score-label">🐟 Final Score</span><span class="score-value">${this.player.score}</span></div>
          <div class="score-item"><span class="score-label">🏆 High Score</span><span class="score-value">${highScore}</span></div>
        </div>
      `;
      document.getElementById("end-screen").classList.remove("hidden");

      // Show Endless Mode button after winning!
      document.getElementById("endless-btn").classList.remove("hidden");
    }, 2000);
  }

  createProgressBar() {
    this.progressFill = document.getElementById("progress-fill");
    this.progressText = document.getElementById("progress-text");
  }

  updateProgressBar() {
    const progress = Math.min(
      (this.player.score / CONFIG.THRESHOLD.WIN) * 100,
      100,
    );
    this.progressFill.style.width = progress + "%";
    this.progressText.textContent = `${this.player.score} / ${CONFIG.THRESHOLD.WIN}`;

    const colors = [
      "linear-gradient(90deg, #4CAF50, #8BC34A)",
      "linear-gradient(90deg, #2196F3, #03A9F4)",
      "linear-gradient(90deg, #FF9800, #FFC107)",
      "linear-gradient(90deg, #E91E63, #F44336)",
    ];
    this.progressFill.style.background = colors[this.player.level] || colors[0];
  }

  updateUI() {
    const scoreElement = document.getElementById("score-val");
    const levelElement = document.getElementById("level-name");
    const highScoreElement = document.getElementById("high-score-val");

    if (scoreElement) scoreElement.textContent = this.player.score;
    if (levelElement)
      levelElement.textContent =
        CONFIG.LEVEL_NAMES[this.player.level] || "Explorer";
    if (highScoreElement) highScoreElement.textContent = this.highScore;

    const targetLevel = Math.min(this.player.level, 3);
    const targetData = this.spawner.getEnemyByLevel(targetLevel);

    if (targetData) {
      const targetImg = `assets/characters/${targetData.name}_right_closed.png`;
      const targetImgElement = document.getElementById("target-img");
      const targetNameElement = document.getElementById("target-name");

      if (targetImgElement) targetImgElement.src = targetImg;
      if (targetNameElement)
        targetNameElement.textContent = targetData.name.toUpperCase();
    }
  }

  checkEnemyCollisions() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const fishA = this.enemies[i];

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const fishB = this.enemies[j];

        if (i === j || !fishA || !fishB) continue;

        if (fishA.level > fishB.level && fishA.isColliding(fishB)) {
          fishA.openMouth();
          fishB.destroy();
          this.enemies.splice(j, 1);

          if (j < i) i--;
          break;
        }
      }
    }
  }

  checkSharkCollision(shark, fish) {
    if (shark.isWarning) return false;
    if (!shark.element || shark.x === undefined || shark.y === undefined)
      return false;

    const padding = 50;

    const sharkLeft = shark.x + padding;
    const sharkRight = shark.x + shark.width - padding;
    const sharkTop = shark.y + padding;
    const sharkBottom = shark.y + shark.height - padding;

    const fishLeft = fish.x + padding;
    const fishRight = fish.x + fish.width - padding;
    const fishTop = fish.y + padding;
    const fishBottom = fish.y + fish.height - padding;

    return (
      sharkLeft < fishRight &&
      sharkRight > fishLeft &&
      sharkTop < fishBottom &&
      sharkBottom > fishTop
    );
  }
}
