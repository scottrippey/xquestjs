var Physics = {
    setPosition: function(point, x, y) {
        point.x = x;
        point.y = y;
    }
    , setVelocity: function(point, vX, vY) {
        point.vX = vX;
        point.vY = vY;
    }
    , setAcceleration: function(point, aX, aY) {
        point.aX = aX;
        point.aY = aY;
    }
    , updatePosition: function(point, elapsedSeconds) {
        if (point.vX) {
            point.x += point.vX * elapsedSeconds;
        }
        if (point.vY) {
            point.y += point.vY * elapsedSeconds;
        }
        if (point.aX || point.aY) {
            var oneHalfTSquared = elapsedSeconds * elapsedSeconds / 2;
            if (point.aX) {
                point.x += point.aX * oneHalfTSquared;
                point.vX += point.aX * elapsedSeconds;
            }
            if (point.aY) {
                point.y += point.aY * oneHalfTSquared;
                point.vY += point.aY * elapsedSeconds;
            }
        }
    }
};

