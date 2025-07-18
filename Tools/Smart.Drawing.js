/**
 * A wrapper around a CanvasRenderingContext2D,
 * providing a chainable syntax.
 *
 * Implements all native {CanvasRenderingContext2D} methods/props
 * as chainable methods/setters
 */
class ChainableCanvas {
  addCommand(command) {
    // This method should be overridden by subclasses
    throw new Error("addCommand must be implemented by subclass");
  }
}
function chainableCanvasMethod(methodName) {
  return function chainableCanvasMethod() {
    const methodArgs = arguments;
    this.addCommand((context) => {
      context[methodName].apply(context, methodArgs);
    });
    return this;
  };
}
Object.assign(ChainableCanvas.prototype, {
  moveTo: chainableCanvasMethod("moveTo"),
  lineTo: chainableCanvasMethod("lineTo"),
  arc: chainableCanvasMethod("arc"),
  arcTo: chainableCanvasMethod("arcTo"),
  quadraticCurveTo: chainableCanvasMethod("quadraticCurveTo"),
  bezierCurveTo: chainableCanvasMethod("bezierCurveTo"),
  beginPath: chainableCanvasMethod("beginPath"),
  closePath: chainableCanvasMethod("closePath"),
  fill: chainableCanvasMethod("fill"),
  stroke: chainableCanvasMethod("stroke"),
  rect: chainableCanvasMethod("rect"),
  fillRect: chainableCanvasMethod("fillRect"),
  strokeRect: chainableCanvasMethod("strokeRect"),
  clearRect: chainableCanvasMethod("clearRect"),
  fillText: chainableCanvasMethod("fillText"),
  strokeText: chainableCanvasMethod("strokeText"),
  scale: chainableCanvasMethod("scale"),
  rotate: chainableCanvasMethod("rotate"),
  translate: chainableCanvasMethod("translate"),
  transform: chainableCanvasMethod("transform"),
  drawImage: chainableCanvasMethod("drawImage"),
  save: chainableCanvasMethod("save"),
  restore: chainableCanvasMethod("restore"),
});
function chainableCanvasSetter(propName) {
  return function chainableCanvasSetter(value) {
    this.addCommand((context) => {
      context[propName] = value;
    });
    return this;
  };
}
Object.assign(ChainableCanvas.prototype, {
  strokeStyle: chainableCanvasSetter("strokeStyle"),
  fillStyle: chainableCanvasSetter("fillStyle"),
  lineWidth: chainableCanvasSetter("lineWidth"),
  lineCap: chainableCanvasSetter("lineCap"),
  lineJoin: chainableCanvasSetter("lineJoin"),
  miterLimit: chainableCanvasSetter("miterLimit"),
  font: chainableCanvasSetter("font"),
});

/**
 * Drawing
 *
 * @extends {CanvasRenderingContext2D}
 */
export class Drawing extends ChainableCanvas {
  /**
   * Fills and/or strokes a path.
   *
   * @param {object} drawStyle
   * @param {CanvasFillStrokeStyles['fillStyle']} drawStyle.fillStyle
   * @param {CanvasFillStrokeStyles['strokeStyle']} drawStyle.strokeStyle
   * @param {CanvasPathDrawingStyles['lineWidth']} [drawStyle.lineWidth]
   * @param {CanvasLineCap} [drawStyle.lineCap] - "butt", "round", "square"
   * @param {CanvasLineJoin} [drawStyle.lineJoin] - "miter", "round", "bevel"
   * @param {CanvasPathDrawingStyles['miterLimit']} [drawStyle.miterLimit]
   *
   * @return {Drawing}
   */
  endPath(drawStyle) {
    if (drawStyle.fillStyle) {
      this.fillStyle(drawStyle.fillStyle);
      this.fill();
    }
    if (drawStyle.strokeStyle) {
      this.strokeStyle(drawStyle.strokeStyle);
      this.lineWidth(drawStyle.lineWidth || 1);
      if (drawStyle.lineCap) this.lineCap(drawStyle.lineCap); // "butt", "round", "square"
      if (drawStyle.lineJoin) this.lineJoin(drawStyle.lineJoin); // "miter", "round", "bevel"
      if (drawStyle.miterLimit) this.miterLimit(drawStyle.miterLimit);
      this.stroke();
    }
    return this;
  }

  roundRect(x, y, width, height, radius) {
    const halfPI = Math.PI / 2;
    const angle_top = halfPI * 3;
    const angle_right = 0;
    const angle_bottom = halfPI;
    const angle_left = Math.PI;

    const arc_left = x + radius;
    const arc_right = x + width - radius;
    const arc_top = y + radius;
    const arc_bottom = y + height - radius;

    return this.arc(arc_right, arc_top, radius, angle_top, angle_right)
      .arc(arc_right, arc_bottom, radius, angle_right, angle_bottom)
      .arc(arc_left, arc_bottom, radius, angle_bottom, angle_left)
      .arc(arc_left, arc_top, radius, angle_left, angle_top)
      .lineTo(arc_right, y);
  }

  circle(x, y, radius) {
    return this.arc(x, y, radius, 0, 2 * Math.PI);
  }

  star(x, y, radius, sides, pointSize, angle) {
    const starPolygon = Drawing.createStarPolygon(x, y, radius, sides, pointSize, angle);
    return this.polygon(starPolygon, false);
  }

  polygon(points) {
    const start = points[0];
    this.moveTo(start[0], start[1]);
    for (let i = 1, l = points.length; i < l; i++) {
      const point = points[i];
      this.lineTo(point[0], point[1]);
    }
    return this;
  }

  drawingQueue(drawingQueue) {
    this.addCommand((context) => {
      drawingQueue.draw(context);
    });
    return this;
  }

  fillPattern(pattern, x, y, width, height, patternOffsetX, patternOffsetY) {
    if (patternOffsetX && patternOffsetY) {
      this.save()
        .translate(patternOffsetX, patternOffsetY)
        .fillStyle(pattern)
        .fillRect(x - patternOffsetX, y - patternOffsetY, width, height)
        .restore();
    } else {
      this.fillStyle(pattern).fillRect(x, y, width, height);
    }
    return this;
  }

  /**
   * Creates a star with the specified number of sides.
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} radius
   * @param {Number} sides
   * @param {Number} pointSize
   * @param {Number} angle
   * @returns {Array}
   */
  static createStarPolygon(x, y, radius, sides, pointSize, angle) {
    if (typeof x === "object") {
      const options = x;
      x = options.x;
      y = options.y;
      radius = options.radius;
      sides = options.sides;
      pointSize = options.pointSize;
      angle = options.angle;
    }
    if (!radius || !sides) return null;
    if (!x) x = 0;
    if (!y) y = 0;
    if (!pointSize) pointSize = 0;
    if (!angle) angle = 0;
    pointSize = 1 - pointSize;
    angle /= 180 / Math.PI;
    const a = Math.PI / sides;
    const starPolygon = [];
    for (let i = 0; i < sides; i++) {
      angle += a;
      if (pointSize !== 1) {
        starPolygon.push([
          x + Math.cos(angle) * radius * pointSize,
          y + Math.sin(angle) * radius * pointSize,
        ]);
      }
      angle += a;
      starPolygon.push([x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]);
    }
    return starPolygon;
  }

  /**
   * Creates a polygon around the edges of a circle, connecting the specified angles.
   * For example, [ 0, 120, 240 ] would create an equilateral triangle,
   * and [ 0, 20, 180, 340 ] would create a kite-like shape.
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} radius
   * @param {Number[]} angles
   * @returns {Array}
   */
  static polygonFromAngles(x, y, radius, angles) {
    const polygon = [];
    const ANGLE_ADJUST = 90;
    const RAD_PER_DEG = Math.PI / -180;
    for (let i = 0, l = angles.length; i < l; i++) {
      const angle = (angles[i] + ANGLE_ADJUST) * RAD_PER_DEG;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      polygon.push([px + x, py + y]);
    }
    return polygon;
  }

  /**
   * Draws to a reusable Image
   * @returns {HTMLCanvasElement}
   */
  static createImage(width, height, drawingCallback) {
    const canvas = this._createCanvas(width, height);
    const context = canvas.getContext("2d");
    const drawing = new DrawingContext(context);
    drawingCallback(drawing);
    return canvas;
  }

  /**
   * Draws to a reusable CanvasPattern
   * @returns {CanvasPattern}
   */
  static createPattern(width, height, drawingCallback) {
    const canvas = this._createCanvas(width, height);
    const context = canvas.getContext("2d");
    const drawing = new DrawingContext(context);
    drawingCallback(drawing);
    const pattern = context.createPattern(canvas, "repeat");
    return pattern;
  }

  static _createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
}

/**
 * A Drawing Helper that immediately draws to the supplied canvas context.
 */
export class DrawingContext extends Drawing {
  constructor(context) {
    super();
    this.context = context;
  }
  addCommand(command) {
    command(this.context);
  }
  setContext(context) {
    this.context = context;
  }
}

/**
 * A Drawing Helper that queues and caches the shapes, to be drawn
 */
export class DrawingQueue extends Drawing {
  constructor() {
    super();
    this._commands = [];
  }
  addCommand(command) {
    this._commands.push(command);
  }
  draw(context) {
    this._commands.forEach((command) => {
      command(context);
    });
  }
  clear() {
    this._commands.length = 0;
  }
}
