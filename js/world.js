class World {
    constructor(graph, 
        roadWidth = 100, 
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 160,
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = 160;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0; // envelopes are rebuilt so polygons are fresh each time
        for (const segment of this.graph.segments) {
            this.envelopes.push(
                new Envelope(segment, this.roadWidth, this.roadRoundness)
            );
        }

        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();

    }

    #generateTrees() {
        const points = [
            ...this.roadBorders.map((s) => [s.point1, s.point2]).flat(), // convert it into 1 single array of points
            ...this.buildings.map((b) => b.base.points).flat()
        ];

        const left = Math.min(...points.map((p) => p.x)); 
        const right = Math.max(...points.map((p) => p.x)); 

        const top = Math.min(...points.map((p) => p.y)); 
        const bottom = Math.max(...points.map((p) => p.y)); 

        // checking where trees should not spawn and stop them from doing so
        const illegalPolys = [
            ...this.buildings.map((b) => b.base),
            ...this.envelopes.map((e) => e.poly)
        ];

        const trees = [];
        let tryCount = 0; // try to add trees in a valid area/if there is a valid area
        while (tryCount < 100) {
            const point = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random()),
            );
            // check if tree is inside or nearby a building/road
            let keep = true;
            for (const poly of illegalPolys) {
                if (
                    poly.containsPoint(point) ||
                    poly.distanceToPoint(point) < this.treeSize / 2
                ) {
                    keep = false;
                    break;
                }
            }

            // check if tree is too close to other trees
            if (keep) {
                for (const tree of trees) {
                    if (distance(tree.center, point) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            // avoiding trees in the middle of a random place, saves memory
            if (keep) {
                let closeToSomething = false;

                for (const poly of illegalPolys) {
                    if (poly.distanceToPoint(point) < this.treeSize * 2) { // can fit up to 2 trees away from the road
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if (keep) {
                trees.push(new Tree(point, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const segment of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    segment,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roadRoundness
                )
            );
        }

        const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

        for (let i = 0; i < guides.length; i++) {
            const segment = guides[i];
            
            if (segment.length() < this.buildingMinLength) { // check if there is space to build a house
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];
        for (let segment of guides) {
            // calc the length w/ a bit of spacing at the end
            const len = segment.length() + this.spacing;
            const buildingCount = Math.floor(len / (this.buildingMinLength + this.spacing));
            const buildingLength = len / buildingCount - this.spacing;

            // generate the supports along the segment
            const direction = segment.directionVector();

            let q1 = segment.point1;
            let q2 = add(q1, scale(direction, buildingLength));
            supports.push(new Segment(q1, q2));

            // place all the other supports
            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(direction, this.spacing));
                q2 = add(q1, scale(direction, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for (const segment of supports) {
            bases.push(new Envelope(segment, this.buildingWidth).poly);
        }

        const epsilon = 0.001;
        // remove any looping bases
        for (let i = 0; i < bases.length - 1; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if (
                    bases[i].intersectsPoly(bases[j]) ||
                    bases[i].distanceToPoint(bases[j]) < this.spacing - epsilon 
                ) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases.map((b) => new Building(b));
    }

    draw(context, viewPoint) {
        for (const envelope of this.envelopes) {
            envelope.draw(context, {fill: "#BBB", stroke: "#BBB", lineWidth: 15});
        }

        for (const segment of this.graph.segments) {
            segment.draw(context, {colour: "yellow", width: 4, dash: [10, 10]});
        }

        for (const segment of this.roadBorders) {
            segment.draw(context, {colour: "white", width: 4});
        }

        const items = [...this.buildings, ...this.trees];
        items.sort( // trees shouldn't overlap buildings, buildings shouldn't overlap trees
            (a, b) => 
                a.base.distanceToPoint(viewPoint) - 
                a.base.distanceToPoint(viewPoint)
        )
        
        for (const item of this.items) {
            item.draw(context, viewPoint);
        }

    }
}