class Tree {
    constructor(center, size, heightCoefficient = 0.3) {
        this.center = center;
        this.size = size;
        this.heightCoefficient = heightCoefficient;
        this.base = this.#generateLevel(center, size); // the car might interact with the base, so it's practically just a collision 
    }

    #generateLevel(point, size) {
        // create a circle-like shape around the point w/ the size
        const points = [];
        const radius = size / 2;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) { // 32 points along the circle, 2 * 16 = 32
            const kindOfRandomNumber = Math.cos(((angle + this.center.x) * size) % 17) ** 2; // JavaScript doesn't have seeds, so create a "seed" like this
            // create a "noisy" radius
            const noisyRadius = radius * lerp(0.5, 1, kindOfRandomNumber); // lerp to stop the spiky-look on the trees
            points.push(translate(point, angle, noisyRadius));
        }

        return new  Polygon(points);
    }

    draw(context, viewPoint) {
        const difference = subtract(this.center, viewPoint);

        const top = add(this.center, scale(difference, this.heightCoefficient)); 

        const levelCount = 7;
        for (let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1); // between 0 and 1
            const point = lerp2D(this.center, top, t); // use linear interpolation between the center and the calculated top using t

            const colour = "rgb(30," + lerp(50, 200, t) + ",70)"; // get a green colour between 50 and 200
            const size = lerp(this.size, 40, t); // interpolate the size

            // use polys to "randomise" the level shapes
            const poly = this.#generateLevel(point, size);
            poly.draw(context, {fill: colour, stroke: "rgba(0, 0, 0, 0)"})
        }
    }
}