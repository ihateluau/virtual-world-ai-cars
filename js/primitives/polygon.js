class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];

        for (let i = 1; i <= points.length; i++) {
            this.segments.push(
                new Segment(points[i - 1], points[i % points.length])
            );
        }
    }

    static union(polys) {
        Polygon.multiBreak(polys);

        const keptSegments = [];
        for (let i = 0; i < polys.length; i++) {
            for (const segment of polys[i].segments) {
                let keep = true;
                for (let j = 0; j < polys.length; j++) {
                    if (i != j) { // dont want to check if a segment is inside its polygon
                        if (polys[j].containsSegment(segment)) {
                            keep = false;
                            break;
                        }
                    }
                }

                if (keep) {
                    keptSegments.push(segment);
                }
            }
        }

        return keptSegments;
    }

    static multiBreak(polys) {
        for (let i = 0; i < polys.length - 1; i++) {
            for (let j = i + 1; j < polys.length; j++) {
                Polygon.break(polys[i], polys[j]);
            }
        }
    }

    static break(polygon1, polygon2) {
        const poly1segments = polygon1.segments;
        const poly2segments = polygon2.segments;

        for (let i = 0; i < poly1segments.length; i++) {
            for (let j = 0; j < poly2segments.length; j++) {
                const intersection = getIntersection(
                    poly1segments[i].point1,
                    poly1segments[i].point2,
                    poly2segments[j].point1,
                    poly2segments[j].point2
                );

                // ignore intersections that only touch at a segment's tip
                if (intersection && intersection.offset !== 1 && intersection.offset !== 0) {
                    const point = new Point(intersection.x, intersection.y);

                    let aux = poly1segments[i].point2;
                    poly1segments[i].point2 = point;
                    poly1segments.splice(i + 1, 0, new Segment(point, aux));

                    aux = poly2segments[j].point2;
                    poly2segments[j].point2 = point;
                    poly2segments.splice(j + 1, 0, new Segment(point, aux));
                }
            }
        }
    }

    distanceToPoint(point) {
        return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
    }

    distanceToPoly(poly) {
        return Math.min(...this.points.map((point) => poly.distanceToPoint(p))); 
    }
    intersectsPoly(poly) {
        for (let segment1 of this.segments) {
            for (let segment2 of poly.segments) {
                if (getIntersection(segment1.point1, segment1.point2, segment2.point1, segment2.point2)) {
                    return true;
                }
            }
        }
        return false;
    }

    containsSegment(segment) {
        const midpoint = average(segment.point1, segment.point2);
        return this.containsPoint(midpoint);
    }

    containsPoint(point) {
        const outerPoint = new Point(-1000, -1000); // any point which is outside the graph

        let intersectionCount = 0;
        for (const segment of this.segments) {
            const intersection = getIntersection(outerPoint, point, segment.point1, segment.point2);

            if (intersection) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1;
    }

    drawSegments(context) {
        for (const segment of this.segments) {
            segment.draw(context, {colour: getRandomColour(), width: 5})
        }
    }

    draw(context, {stroke = "blue", lineWidth = 2, fill = "rgba(0, 0, 255, 0.3)"} = {}) {
        context.beginPath();
        context.fillStyle = fill;
        context.strokeStyle = stroke;
        context.lineWidth = lineWidth;

        context.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }

        context.closePath();
        context.fill();
        context.stroke();
    }
}