class Building {
    constructor(poly, heightCoefficient = 0.4) {
        this.base = poly;
        this.heightCoefficient = heightCoefficient;
    }

    draw(context, viewPoint) {
        const topPoints = this.base.points.map((point) => 
            add(point, scale(subtract(point, viewPoint), this.heightCoefficient)) // same as the one used in tree but divided instead
        );

        const ceiling = new Polygon(topPoints);

        // creating sides, connecting 2 points from the base to 2 points to the ceiling in reverse by using polygons
        const sides = [];
        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i]
            ]);
            // bottom, top --> inverse
            sides.push(poly);
        }
        sides.sort((a, b) =>
            b.distanceToPoint(viewPoint) -
            a.distanceToPoint(viewPoint) // sort in reverse order, closest is the law one to be drawn
        )

        this.base.draw(context, {fill: "white", stroke: "#AAA"});
        for (const side of sides) {
            side.draw(context, {fill: "white", stroke: "#AAA"});
        }
        ceiling.draw(context, {fill: "white", stroke: "#AAA"});
    }
}