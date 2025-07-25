import { Point } from "@/Tools/Smart.Point.js";
import { Sort } from "@/Tools/Smart.Sort.js";

export const Physics = {
  applyVelocity(point, velocity, elapsedSeconds) {
    if (velocity.x) {
      point.x += velocity.x * elapsedSeconds;
    }
    if (velocity.y) {
      point.y += velocity.y * elapsedSeconds;
    }
  },

  applyAcceleration(point, acceleration, elapsedSeconds) {
    if (acceleration.x || acceleration.y) {
      const oneHalfTSquared = (elapsedSeconds * elapsedSeconds) / 2;
      if (acceleration.x) point.x += acceleration.x * oneHalfTSquared;
      if (acceleration.y) point.y += acceleration.y * oneHalfTSquared;
    }
  },

  applyAccelerationToVelocity(velocity, acceleration) {
    velocity.x += acceleration.x;
    velocity.y += acceleration.y;
  },

  applyFrictionToVelocity(velocity, friction, elapsedSeconds) {
    const threshold = 0.5;
    const remainingPercent = Math.pow(1 - friction, elapsedSeconds);

    if (velocity.x < threshold && velocity.x > -threshold) velocity.x = 0;
    else velocity.x *= remainingPercent;

    if (velocity.y < threshold && velocity.y > -threshold) velocity.y = 0;
    else velocity.y *= remainingPercent;
  },

  /**
   * Inverts the velocity and position when the location hits the bounds.
   */
  bounceOffWalls(location, radius, velocity, bounds, dampening) {
    const wall = this.checkBounds(location, radius, bounds);
    if (wall) {
      this.bounceOffWall(wall, location, velocity, dampening);
    }
    return wall;
  },

  checkBounds(location, radius, bounds) {
    const leftEdge = location.x - radius - bounds.x;
    if (leftEdge < 0) {
      return { edge: "left", distance: leftEdge };
    }

    const rightEdge = location.x + radius - (bounds.x + bounds.width);
    if (rightEdge > 0) {
      return { edge: "right", distance: rightEdge };
    }

    const topEdge = location.y - radius - bounds.y;
    if (topEdge < 0) {
      return { edge: "top", distance: topEdge };
    }

    const bottomEdge = location.y + radius - (bounds.y + bounds.height);
    if (bottomEdge > 0) {
      return { edge: "bottom", distance: bottomEdge };
    }

    return null;
  },

  bounceOffWall(wall, location, velocity, dampening) {
    switch (wall.edge) {
      case "left":
        location.x -= wall.distance * 2;
        velocity.x *= -1;
        break;
      case "right":
        location.x -= wall.distance * 2;
        velocity.x *= -1;
        break;
      case "top":
        location.y -= wall.distance * 2;
        velocity.y *= -1;
        break;
      case "bottom":
        location.y -= wall.distance * 2;
        velocity.y *= -1;
        break;
    }
    if (dampening) {
      velocity.x *= 1 - dampening;
      velocity.y *= 1 - dampening;
    }
  },

  bounceOffPoint(location, velocity, bouncePoint, radius, dampening) {
    // This algorithm is not too accurate.
    // It bounces straight away from the bouncePoint,
    // not taking into account the angle of collision.

    const diff = {
      x: location.x - bouncePoint.x,
      y: location.y - bouncePoint.y,
    };

    const hv = Point.hypotenuse(velocity);
    const hd = Point.hypotenuse(diff);
    const vScale = hv / hd;
    const lScale = radius / hd;

    velocity.x = diff.x * vScale;
    velocity.y = diff.y * vScale;

    location.x = bouncePoint.x + diff.x * lScale;
    location.y = bouncePoint.y + diff.y * lScale;

    if (dampening) {
      velocity.x *= 1 - dampening;
      velocity.y *= 1 - dampening;
    }
  },

  sortByLocation(points) {
    if (points.length < 2) return points;
    return Sort.smoothSort(points, Physics._compareLocations);
  },

  _compareLocations(a, b) {
    // Compare horizontally:
    return a.location.x - b.location.x;
  },

  detectCollisions(sortedPointsA, sortedPointsB, maxDistance, collisionCallback) {
    let aIndex = sortedPointsA.length - 1;
    let bIndex = sortedPointsB.length - 1;
    let pointA = sortedPointsA[aIndex];
    let pointB = sortedPointsB[bIndex];

    while (aIndex >= 0 && bIndex >= 0) {
      // Rough-compare X:
      let dx = pointA.location.x - pointB.location.x;
      if (maxDistance < dx) {
        aIndex--;
        pointA = sortedPointsA[aIndex];
      } else if (dx < -maxDistance) {
        bIndex--;
        pointB = sortedPointsB[bIndex];
      } else {
        let bLookAhead = bIndex;
        while (bLookAhead >= 0) {
          dx = pointA.location.x - pointB.location.x;
          if (dx < -maxDistance) {
            break;
          }
          // Rough-compare Y:
          const dy = pointA.location.y - pointB.location.y;
          if (-maxDistance <= dy && dy <= maxDistance) {
            // Deep-compare:
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= maxDistance) {
              collisionCallback(pointA, pointB, aIndex, bLookAhead, distance);
            }
          }
          bLookAhead--;
          pointB = sortedPointsB[bLookAhead];
        }
        pointB = sortedPointsB[bIndex];

        aIndex--;
        pointA = sortedPointsA[aIndex];
      }
    }
  },

  findClosestPoint(target, points) {
    let closestPointIndex = -1;
    let distance = Number.MAX_VALUE;

    let i = points.length;
    while (i--) {
      const point = points[i];

      // Let's do rough comparisons, and short-circuit when possible:
      const dx = point.x - target.x;
      if (Math.abs(dx) >= distance) continue;
      const dy = point.y - target.y;
      if (Math.abs(dy) >= distance) continue;

      // Now do a precise comparison:
      const actualDistance = Point.hypotenuseXY(dx, dy);
      if (actualDistance < distance) {
        distance = actualDistance;
        closestPointIndex = i;
      }
    }
    return closestPointIndex;
  },

  /**
   * Determines the required trajectory in order to hit a moving target
   *
   * @param {Point} playerLocation
   * @param {Point} targetLocation
   * @param {Point} targetVelocity
   * @param {Number} bulletSpeed
   * @returns {Point}
   *
   * For reference, see http://stackoverflow.com/a/4750162/272072 - "shoot projectile (straight trajectory) at moving target in 3 dimensions"
   */
  trajectory(playerLocation, targetLocation, targetVelocity, bulletSpeed) {
    // We've got some crazy equations coming up,
    // so let's create some shorthand variables:
    const v = targetVelocity;

    const bs = bulletSpeed;
    const e = targetLocation;
    const p = playerLocation;
    const d = { x: e.x - p.x, y: e.y - p.y };
    const sqr = (x) => x * x;

    // Solve for t by using the quadratic trajectory equation:
    const a = sqr(v.x) + sqr(v.y) - sqr(bs);

    const b = 2 * (v.x * d.x + v.y * d.y);
    const c = sqr(d.x) + sqr(d.y);

    const solutions = Physics.solveQuadratic(a, b, c);
    let t;
    if (solutions.length === 0 || (solutions[0] <= 0 && solutions[1] <= 0)) {
      // It's just not possible to hit the target using the given bulletSpeed.
      // So let's just fire in the approximate direction:
      t = 1;
    } else {
      // Pick the shortest positive solution:
      if (solutions[0] > 0 && solutions[0] < solutions[1]) t = solutions[0];
      else t = solutions[1];
    }

    const trajectory = {
      x: d.x + v.x * t,
      y: d.y + v.y * t,
    };
    return Point.scaleVector(trajectory, bulletSpeed);
  },

  /**
   * Solves a quadratic equation by using the quadratic formula.
   *
   * Quadratic equations: ax² + bx + c = 0
   * Quadratic formula: (-b ± sqrt(b^2 - 4ac)) / 2a
   *
   * @param a
   * @param b
   * @param c
   * @returns {[ number, number ]|[]} Returns either 2 solutions or no solutions.
   */
  solveQuadratic(a, b, c) {
    const bSquaredMinus4AC = b * b - 4 * a * c;
    if (bSquaredMinus4AC < 0) return []; // No possible solutions

    const twoA = 2 * a;
    const negativeBOver2A = -b / twoA;
    const sqrtOfBSquaredMinus4ACOver2A = Math.sqrt(bSquaredMinus4AC) / twoA;

    return [
      negativeBOver2A + sqrtOfBSquaredMinus4ACOver2A,
      negativeBOver2A - sqrtOfBSquaredMinus4ACOver2A,
    ];
  },
};
