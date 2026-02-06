export default class Fish {
  constructor(x, y, width, height, imageSrc) {
    if (this.constructor === Fish) throw new Error("Abstract Class");

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.imageSrc = imageSrc;

    this.element = document.createElement("img");
    this.element.src = this.imageSrc;
    this.element.className = "fish";
    this.element.style.position = "fixed";
    this.element.style.pointerEvents = "none";
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.style.zIndex = "10";
    this.element.style.imageRendering = "auto";
    this.element.style.display = "block";

    const container = document.querySelector("#game");
    container.appendChild(this.element);

    setTimeout(() => this.render(), 0);
  }

  render() {
    if (!this.element) return;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.transform =
      this.direction < 0 ? "scaleX(-1)" : "scaleX(1)";
  }

  isColliding(other) {
    const mouthSize = this.width * 0.2;
    let mouthX =
      this.direction === 1 ? this.x + this.width - mouthSize : this.x;
    const mouthY = this.y + this.height / 2 - mouthSize / 2;

    const paddingW = other.width * 0.3;
    const paddingH = other.height * 0.3;

    const victimBox = {
      x: other.x + paddingW,
      y: other.y + paddingH,
      w: other.width - paddingW * 2,
      h: other.height - paddingH * 2,
    };

    const collision =
      mouthX < victimBox.x + victimBox.w &&
      mouthX + mouthSize > victimBox.x &&
      mouthY < victimBox.y + victimBox.h &&
      mouthY + mouthSize > victimBox.y;

    return collision;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
    this.element = null;
  }

  openMouth() {
    if (!this.element) return;

    const currentSrc = this.element.src;
    this.element.src = currentSrc.replace("_closed", "_open");

    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.src = this.element.src.replace("_open", "_closed");
      }
    }, 200);
  }
}
