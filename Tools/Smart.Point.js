const RadiansPerDegree = Math.PI / 180;

export const Point = {
  subtract(pointA, pointB) {
    return { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
  },
  multiply(point, factor) {
    return { x: point.x * factor, y: point.y * factor };
  },
  clonePoint(point) {
    return { x: point.x, y: point.y };
  },
  hypotenuse(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  },
  hypotenuseXY(x, y) {
    return Math.sqrt(x * x + y * y);
  },
  pointIsInBounds(point, bounds) {
    return (
      bounds.x <= point.x &&
      point.x <= bounds.x + bounds.width &&
      bounds.y <= point.y &&
      point.y <= bounds.y + bounds.height
    );
  },
  distanceTest(pointA, pointB, testDistance) {
    const dx = pointA.x - pointB.x;
    let dy;
    if (Math.abs(dx) <= testDistance) {
      dy = pointA.y - pointB.y;
      if (Math.abs(dy) <= testDistance) {
        const delta = { x: dx, y: dy };
        delta.distance = Point.hypotenuse(delta);
        if (delta.distance <= testDistance) return delta;
      }
    }
    return null;
  },
  rotate(point, degrees) {
    const radians = degrees * RadiansPerDegree;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const rx = point.x * cos - point.y * sin;
    const ry = point.x * sin + point.y * cos;
    point.x = rx;
    point.y = ry;
  },
  fromAngle(degrees, scale) {
    const radians = degrees * RadiansPerDegree;
    return {
      x: Math.cos(radians) * scale,
      y: Math.sin(radians) * scale,
    };
  },
  scaleVector(vector, scale) {
    const vectorScale = scale / Point.hypotenuse(vector);
    return {
      x: vector.x * vectorScale,
      y: vector.y * vectorScale,
    };
  },
  /**
   * Returns the angle of a vector
   *
   * @param {object} vector
   * @param {number} vector.x
   * @param {number} vector.y
   * @returns {number}
   */
  angleFromVector(vector) {
    return 180 - Math.atan2(vector.x, vector.y) / RadiansPerDegree;
  },
};
