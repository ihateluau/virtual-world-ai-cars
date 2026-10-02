function getNearestPoint(location, points, threshold = 10) {
    let minimumDistance = Number.MAX_SAFE_INTEGER;
    let nearestPoint = null;

    for (const point of points) {
        const dist = distance(point, location);
        
        if (dist < minimumDistance && dist < threshold) { 
            minimumDistance = dist;
            nearestPoint = point; // record the point w/ the minimum distance
        }
    }

    return nearestPoint;
}

function distance(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y)
}

function average(point1, point2) {
    return new Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
}

function dot(point1, point2) {
    return point1.x * point2.x + point1.y * point2.y;
}

function add(point1, point2) {
    return new Point(point1.x + point2.x, point1.y + point2.y)
}

function subtract(point1, point2) {
    return new Point(point1.x - point2.x, point1.y - point2.y)
}

function scale(point, scaler) {
    return new Point(point.x * scaler, point.y * scaler);
}

function normalize(point) {
    return scale(point, 1 / magnitude(point));
}

function magnitude(point) {
    return Math.hypot(point.x, point.y);
}
function translate(location, angle, offset) {
    return new Point(
        location.x + Math.cos(angle) * offset,
        location.y + Math.sin(angle) * offset,
    );
}

function angle(point) {
    return Math.atan2(point.y, point.x)
} 

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    const epsilon = 0.001;
    if (Math.abs(bottom) > epsilon) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }

    return null;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerp2D(A, B, t) {
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

function getRandomColour() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}

