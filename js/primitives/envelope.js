class Envelope {
    constructor(skeleton, width, roundness = 1) {
        this.skeleton = skeleton;
        this.poly = this.#generatePolygon(width, roundness);
    }

    #generatePolygon(width, roundness) {
        const {point1, point2} = this.skeleton;

        const radius = width / 2;
        const alpha = angle(subtract(point1, point2))
        const alpha_cw = alpha + Math.PI / 2; // clock-wise
        const alpha_ccw = alpha - Math.PI / 2; // counter clock-wise

        // adding circles to the roads
        const step = Math.PI / Math.max(1, roundness);
        const epsilon = step / 2; // stops any visual bugs when moving points w/ envelopes
        const points = [];

        for (let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
            points.push(translate(point1, i, radius))
        }

        for (let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
            points.push(translate(point2, Math.PI + i, radius))
        }

        return new Polygon(points)
    }

    draw(context, options) {
        this.poly.draw(context, options);
        //this.poly.drawSegments(context, options); // visualise highlighting for intersections
    }
}