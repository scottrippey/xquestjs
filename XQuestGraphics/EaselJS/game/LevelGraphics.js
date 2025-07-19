import { Interpolate } from "@/Tools/Animation/Smart.Interpolate.js";
import { Physics } from "@/Tools/Smart.Physics.js";
import { Point } from "@/Tools/Smart.Point.js";
import { Balance } from "@/XQuestGame/options/Balance.js";
import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";

export class LevelGraphics extends createjs.Shape {
  gateStart = null;
  gateEnd = null;
  gateOpen = false;
  constructor() {
    super();
    this.nextChange = 0;
  }
  setGateWidth(gateWidth) {
    const bounds = Balance.level.bounds;
    this.gateStart = {
      x: bounds.x + (bounds.width - gateWidth) / 2,
      y: bounds.y,
    };
    this.gateEnd = {
      x: this.gateStart.x + gateWidth,
      y: bounds.y,
    };
    this.gateOpen = false;
  }
  openGate() {
    this.gateOpen = true;
  }
  closeGate() {
    this.gateOpen = false;
  }
  onTick(tickEvent) {
    if (this.nextChange <= tickEvent.time) {
      const G = Graphics.level;
      this.nextChange = tickEvent.time + G.gateElectricityFrequency;
      this.graphics.clear();
      this._drawWalls();
      this._drawGate();
    }
  }
  _drawWalls() {
    const g = this.graphics;
    const level = Graphics.level;
    const bounds = Balance.level.bounds;
    const strokeWidth = Graphics.level.strokeStyle.strokeWidth - 2;
    const gateStart = this.gateStart;
    const gateEnd = this.gateEnd;

    // Draw a rounded rectangle with a "gap" for the gate:
    // TODO: Cache these calculated values:
    const halfPI = Math.PI / 2;

    const angles = {
      top: halfPI * 3,
      right: 0,
      bottom: halfPI,
      left: Math.PI,
    };

    const arcCorners = {
      left: bounds.x + level.cornerRadius - strokeWidth / 2,
      right: bounds.x + bounds.width - level.cornerRadius + strokeWidth,
      top: bounds.y + level.cornerRadius - strokeWidth / 2,
      bottom: bounds.y + bounds.height - level.cornerRadius + strokeWidth,
    };

    g.beginStyle(level.strokeStyle)
      .moveTo(gateEnd.x, gateEnd.y)
      .arc(arcCorners.right, arcCorners.top, level.cornerRadius, angles.top, angles.right)
      .arc(arcCorners.right, arcCorners.bottom, level.cornerRadius, angles.right, angles.bottom)
      .arc(arcCorners.left, arcCorners.bottom, level.cornerRadius, angles.bottom, angles.left)
      .arc(arcCorners.left, arcCorners.top, level.cornerRadius, angles.left, angles.top)
      .lineTo(gateStart.x, gateStart.y)
      .endStroke();
  }

  _drawGate() {
    if (this.gateOpen) return;

    const g = this.graphics;
    const gate = Graphics.gate;
    const gateStart = this.gateStart;
    const gateEnd = this.gateEnd;

    this._drawElectricLine(g, gate, gateStart, gateEnd);
  }

  _drawElectricLine(graphics, gate, gateStart, gateEnd) {
    const segments = gate.segments;

    graphics.beginStyle(gate.strokeStyle).moveTo(gateStart.x, gateStart.y);

    const diff = {
      x: gateEnd.x - gateStart.x,
      y: gateEnd.y - gateStart.y,
    };

    const interpolate = Interpolate.points(gateStart, gateEnd);

    for (let i = 1; i <= segments; i++) {
      const pos = interpolate(i / segments);
      const dist = Math.min(segments - i, i) / segments;
      const deviation = dist * gate.deviation * (Math.random() - 0.5);
      if (diff.y) pos.x += -diff.y * deviation;
      if (diff.x) pos.y += diff.x * deviation;
      graphics.lineTo(pos.x, pos.y);
    }
    graphics.endStroke();
  }

  /**
   * Detects if the location is outside the level's bounds, or if it's inside the gate.
   * @param location
   * @param radius
   * @returns String - Either: null, 'level-wall', 'open-gate', or 'closed-gate'
   */
  levelCollision(location, radius) {
    const bounds = Balance.level.bounds;
    const wall = Physics.checkBounds(location, radius, bounds);

    if (!wall) return null;

    // Detect collision with the gate:
    const insideGate =
      wall.edge === "top" && location.x >= this.gateStart.x && location.x <= this.gateEnd.x;
    if (insideGate) {
      if (this.gateOpen) {
        wall.insideGate = true;
        wall.insideGateDistance = -wall.distance;

        if (Point.distanceTest(location, this.gateStart, radius)) {
          wall.touchingGate = this.gateStart;
        } else if (Point.distanceTest(location, this.gateEnd, radius)) {
          wall.touchingGate = this.gateEnd;
        }
      }
    }

    return wall;
  }
}
