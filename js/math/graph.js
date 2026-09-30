class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(info) {
        const points = info.points.map((i) => new Point(i.x, i.y));
        const segments = info.segments.map((i) => new Segment(
            points.find((p) => p.equals(i.point1)),
            points.find((p) => p.equals(i.point2)),
        ));

        return new Graph(points, segments); // https://www.youtube.com/watch?v=5iHejdqYIa8 2:03:07
    }

    hash() {
        return JSON.stringify(this);
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    removePoint(point) {
        const segments = this.getSegmentsWithPoint(point);
        for (const seg of segments) {
            this.removeSegment(seg);
        }

        this.points.splice(this.points.indexOf(point), 1); // remove an element at the given index
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    containsSegment(segment) {
        return this.segments.find((s) => s.equals(segment));
    }

    tryAddSegment(segment) {
        if (!this.containsSegment(segment) && !segment.point1.equals(segment.point2)) {
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1); // remove an element at the given index
    }

    getSegmentsWithPoint(point) {
        const segments = [];
        for (const segment of this.segments) {
            if (segment.includes(point)) {
                segments.push(segment); // add to array
            }
        }

        return segments;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }
    draw(context) {
        for (const seg of this.segments) { // tell each segment to draw itself
            seg.draw(context); 
        }

        for (const point of this.points) {
            point.draw(context); // dont want segment lines to be ontop of the points
        }
    }
}