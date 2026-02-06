import { CONFIG } from "../config/config.js";
import Fish from "./Fish.js";

export default class Player extends Fish {
  static instance = null;

  constructor(x, y, imagesArray) {
    if (Player.instance) {
      return Player.instance;
    }

    super(
      x,
      y,
      CONFIG.PLAYER.START_WIDTH,
      CONFIG.PLAYER.START_HEIGHT,
      imagesArray[CONFIG.SIZE.TINY],
    );

    Player.instance = this;
    this.images = imagesArray;
    this.level = CONFIG.SIZE.TINY;
    this.score = 0;
    this.speed = CONFIG.PLAYER.ACCELERATION;
    this.direction = CONFIG.DIRECTION.RIGHT;

    this.levelUpSound = new Audio("assets/audio/level_up.wav");
    this.levelUpSound.preload = "auto";

    // Store initial values for reset
    this.initialX = x;
    this.initialY = y;
  }

  playLevelUpSound() {
    if (!this.levelUpSound) return;
    // Check if game has sfx muted
    if (window.game && window.game.sfxMuted) return;
    this.levelUpSound.currentTime = 0;
    this.levelUpSound.play().catch(() => {});
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;

    if (dx !== 0) {
      this.direction = dx < 0 ? CONFIG.DIRECTION.LEFT : CONFIG.DIRECTION.RIGHT;
    }

    this.x += (mouseX - this.x) * this.speed;
    this.y += (mouseY - this.y) * this.speed;
    // Use live window dimensions for full movement range
    this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));

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
      this.width = CONFIG.PLAYER.sizeMap[this.level].width;
      this.height = CONFIG.PLAYER.sizeMap[this.level].height;
      this.element.src = this.images[this.level];

      // Show level announcement
      this.playLevelUpSound();
      this.showLevelAnnouncement(this.level + 1);
    } else {
      this.width += CONFIG.PLAYER.GROWTH_WIDTH;
      this.height += CONFIG.PLAYER.GROWTH_HEIGHT;
    }

    this.openMouth();
    this.render();
  }

  showLevelAnnouncement(level) {
    const announcement = document.createElement("div");
    announcement.className = "level-announcement";
    announcement.textContent = `LEVEL ${level}`;
    document.querySelector("#game").appendChild(announcement);

    setTimeout(() => {
      announcement.remove();
    }, 2000);
  }

  reset() {
    this.score = 0;
    this.level = CONFIG.SIZE.TINY;
    this.x = this.initialX;
    this.y = this.initialY;
    this.width = CONFIG.PLAYER.START_WIDTH;
    this.height = CONFIG.PLAYER.START_HEIGHT;
    this.element.src = this.images[CONFIG.SIZE.TINY];
    this.show(); // Make sure player is visible on restart
    this.render();
  }

  hide() {
    if (this.element) {
      this.element.style.display = "none";
    }
  }

  show() {
    if (this.element) {
      this.element.style.display = "block";
    }
  }
}
