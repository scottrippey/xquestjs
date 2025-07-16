import { Interpolate } from "@/common/src/Smart/Animation/Smart.Interpolate";

EaselJSGraphics.SpecialEffects = {
  drawElectricLineTo(drawing, lineStart, lineEnd, segments, maxDeviation) {
    const diff = {
      x: lineEnd.x - lineStart.x,
      y: lineEnd.y - lineStart.y,
    };
    const interpolate = Interpolate.points(lineStart, lineEnd);

    for (let i = 1; i <= segments; i++) {
      const pos = interpolate(i / segments);
      const dist = Math.min(segments - i, i) / segments;
      const deviation = dist * maxDeviation * (Math.random() - 0.5);
      if (diff.y) pos.x += -diff.y * deviation;
      if (diff.x) pos.y += diff.x * deviation;
      drawing.lineTo(pos.x, pos.y);
    }
  },

  drawElectricRectangle(drawing, rectangle, electricOptions) {
    const left = rectangle.x || 0;
    const top = rectangle.y || 0;
    const right = left + rectangle.width;
    const bottom = top + rectangle.height;
    const segmentsH = electricOptions.segmentsH;
    const devH = electricOptions.deviationH;
    const segmentsV = electricOptions.segmentsV;
    const devV = electricOptions.deviationV;

    drawing.moveTo(left, top);
    this.drawElectricLineTo(drawing, { x: left, y: top }, { x: right, y: top }, segmentsH, devH);
    this.drawElectricLineTo(
      drawing,
      { x: right, y: top },
      { x: right, y: bottom },
      segmentsV,
      devV,
    );
    this.drawElectricLineTo(
      drawing,
      { x: right, y: bottom },
      { x: left, y: bottom },
      segmentsH,
      devH,
    );
    this.drawElectricLineTo(drawing, { x: left, y: bottom }, { x: left, y: top }, segmentsV, devV);
    drawing.closePath();
  },
};
