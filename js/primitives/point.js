class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x == point.x && this.y == point.y;
    }

    draw(context,  {size = 18, colour = "black", outline = false, fill = false} = {}) {
        const radius = size / 2;
        context.beginPath();
        context.fillStyle = colour;
        context.arc(this.x, this.y, radius, 0, Math.PI * 2) // 360 = 2Pi
        context.fill();

        if (outline) {
            context.beginPath(); // create the outline
            context.lineWidth = 2;
            context.strokeStyle = "white"; 
            context.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
            context.stroke();
        }

        if (fill) {
            context.beginPath(); // begin new fill path
            context.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2);
            context.fillStyle = "white";
            context.fill();
        }
    }
}