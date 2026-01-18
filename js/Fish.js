
class Fish {
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
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        
        document.body.appendChild(this.element);
    }

    moveFishes() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
    }

    destroy() {
        this.element.remove();
    }
}