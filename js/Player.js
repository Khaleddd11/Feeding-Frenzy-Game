class Player extends Fish {
    constructor(x, y, imagesArray) {
        super(x, y, 60, 50, imagesArray[0]);

        if (Player.instance) return Player.instance;
        Player.instance = this;

        this.images = imagesArray; 
        this.level = 0;
        this.score = 0;
        this.speed = 0.15; 
    }

    update(mouseX, mouseY) {
        this.x += (mouseX - this.x) * this.speed;
        this.y += (mouseY - this.y) * this.speed;

        this.moveFishes();
    }

    grow() {
        this.score += 10;
        this.width += 5;
        this.height += 4;

        let oldLevel = this.level;
        if (this.score >= 150) this.level = 3;
        else if (this.score >= 100) this.level = 2;
        else if (this.score >= 50) this.level = 1;

        if (this.level !== oldLevel) {
            this.element.src = this.images[this.level];
        }
    }
}