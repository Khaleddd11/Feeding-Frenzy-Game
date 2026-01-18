
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
        this.element.style.pointerEvents = "none";
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        
        document.querySelector("#game").appendChild(this.element);
    }

    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
    }

    isColliding(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    destroy() {
        this.element.remove();
    }
}










