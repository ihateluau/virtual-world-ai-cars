class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;

        this.graph = graph;

        this.context = this.canvas.getContext("2d");

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.#addEventListeners(); // private
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this)); // .bind(this) = sends this this to this function shown

        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));

        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault()); // stops the context menu from showing if they right click in the canvas
        this.canvas.addEventListener("mouseup", () => this.dragging = false); 
        
    }

    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);

        if (this.dragging == true) { // allow points to be dragged instead of deleting then re-adding them
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleMouseDown(evt) {
        if (evt.button == 2) { // 2 == right click, this func is ran when they right click
            if (this.selected) {
                this.selected = null; // unselect if they right-click
            } else if (this.hovered) {
                this.#removePoint(this.hovered); // remove the point that is hovered
            }
        }
    
        if (evt.button == 0) { // left click, runs when they left click
            if (this.hovered) {
                this.#select(this.hovered);
                this.selected = this.hovered;
                this.dragging = true; 
                return; // doesn't create a new point if the mouse is hovered over a point
            }
            
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse)
            this.selected = this.mouse;  
            this.hovered = this.mouse; // allow selected points to be deleted
        }
    }
    
    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        // if the selected point is the removing point, then reset the selected point, otherwise don't
        if (this.selected == point) {
            this.selected = null;
        }

    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.context);
        if (this.hovered) {
            this.hovered.draw(this.context, {fill: true}); // gives it an outline so the selected point stands out
        }

        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse; // snapping to points

            new Segment(this.selected, intent).draw(context, {dash: [3, 3]}); // dotted line to visualize intent
            this.selected.draw(this.context, {outline: true}); // gives it an outline so the selected point stands out
        }

    }
}