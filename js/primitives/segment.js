class Segment {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }

    length() {
        return distance(this.point1, this.point2);
    }

    directionVector() {
        return normalize(subtract(this.point2, this.point1));
    }

    equals(segment) {
        return this.includes(segment.point1) && this.includes(segment.point2);
    }

    includes(point) { // helper func for equals
        return this.point1.equals(point) || this.point2.equals(point);
    }

    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
            return distance(point, proj.point);
        }

        const distToP1 = distance(point, this.point1);
        const distToP2 = distance(point, this.point2);

        return Math.min(distToP1, distToP2);
    }

    projectPoint(point) {
        const a = subtract(point, this.point1);
        const b = subtract(this.point2, this.point1);

        const normB = normalize(b);
        const scaler = dot(a, normB);

        return {
            point: add(this.point1, scale(normB, scaler)),
            offset: scaler / magnitude(b),
        };
    }

    draw(context, {width = 2, colour = "black", dash = [] } = {}) {
        context.beginPath();
        context.lineWidth = width;
        context.strokeStyle = colour;
        context.setLineDash(dash);
        context.moveTo(this.point1.x, this.point1.y);
        context.lineTo(this.point2.x, this.point2.y);
        context.stroke();
        context.setLineDash([]);
    }
}