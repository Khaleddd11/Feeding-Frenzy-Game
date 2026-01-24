export default class Fish {
    constructor(x, y, width, height, imageSrc) {
        if (this.constructor === Fish) throw new Error("Abstract Class");

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc;

        this.element = document.createElement('img');
        this.element.src = this.imageSrc;
        this.element.style.position = 'absolute';
        this.element.style.pointerEvents = 'none';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';

        document.querySelector('#game').appendChild(this.element);
    }

    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.transform = this.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    }

isColliding(other) {
    const attackBoxWidth = this.width * 0.3;  
    const attackBoxHeight = this.height * 0.4; 
    
    let attackBoxX;
    const attackBoxY = this.y + (this.height / 2) - (attackBoxHeight / 2);

    if (this.direction === 1 || this.direction === 'right') {
        attackBoxX = this.x + this.width - attackBoxWidth; 
    } else {
        attackBoxX = this.x;
    }

    const padding = 0.15; 
    const targetX = other.x + (other.width * padding);
    const targetY = other.y + (other.height * padding);
    const targetW = other.width * (1 - (padding * 2));
    const targetH = other.height * (1 - (padding * 2));

    return (
        attackBoxX < targetX + targetW &&
        attackBoxX + attackBoxWidth > targetX &&
        attackBoxY < targetY + targetH &&
        attackBoxY + attackBoxHeight > targetY
    );
}

    destroy() {
        this.element.remove();
    }

    openMouth() {
        const currentSrc = this.element.src;
        this.element.src = currentSrc.replace('_closed', '_open');

        setTimeout(() => {
            if (this.element) {
                this.element.src = this.element.src.replace('_open', '_closed');
            }
        }, 200);
    }
}
