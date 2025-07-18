import { Physics } from "@/common/src/Smart/Smart.Physics.js";
import { Drawing } from "../utils/Drawing.js";

Balance.onUpdate((gameMode) => {
  Graphics.merge({
    explosionOptions: {
      count: 200,
      speed: 800,
      style: {
        fillColor: "hsl(60, 100%, 50%)",
      },
      radius: 4,
      friction: 0.9,
      duration: 3,
    },
  });
});

export class ExplosionGraphic extends Drawing {
  setup(position, velocity, explosionOptions) {
    this.explosionOptions = _.defaults(explosionOptions, Graphics.explosionOptions);

    const random = () => 1 - Math.random() - Math.random(); // provides a more even spread than just Math.random()

    this.particles = new Array(explosionOptions.count);
    for (let i = 0, l = explosionOptions.count; i < l; i++) {
      const vx = velocity.x + explosionOptions.speed * random();
      const vy = velocity.y + explosionOptions.speed * random();

      this.particles[i] = {
        x: position.x,
        y: position.y,
        velocity: { x: vx, y: vy },
      };
    }

    this.addAnimation()
      .duration(explosionOptions.duration)
      .easeOut()
      .fade(this, 0)
      .queueDispose(this);
  }
  drawEffects(drawing, tickEvent) {
    const explosionOptions = this.explosionOptions;
    const particles = this.particles;
    const deltaSeconds = tickEvent.deltaSeconds;
    const levelBounds = Balance.level.bounds;

    drawing.beginPath();
    for (let i = 0, l = particles.length; i < l; i++) {
      const particle = particles[i];
      Physics.applyVelocity(particle, particle.velocity, deltaSeconds);
      Physics.applyFrictionToVelocity(particle.velocity, explosionOptions.friction, deltaSeconds);
      Physics.bounceOffWalls(particle, explosionOptions.radius, particle.velocity, levelBounds, 0);

      drawing
        .moveTo(particle.x, particle.y)
        .circle(particle.x, particle.y, explosionOptions.radius);
    }
    drawing.endPath(explosionOptions.style);
  }
}
