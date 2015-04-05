
var STEP_PADDING = 10;
var ME_PADDING = 20;
var STEP_HEIGHT = Math.round((view.size.height - STEP_PADDING * 2) / 16);
var STEP_LENGTH = Math.round((view.size.width - STEP_PADDING * 2) / 16);

var regularBackgroundColor = {r: 213, g: 245, b: 232};
var pulseBackgroundColor = {r: 195, g: 119, b: 233};
var currentBackgroundColor = JSON.parse(JSON.stringify(regularBackgroundColor));
var targetBackgroundColor = JSON.parse(JSON.stringify(pulseBackgroundColor));
var currentColorDelta = colorDelta(currentBackgroundColor, targetBackgroundColor, 30);

var animating = false;
var animatingForward = true;
var animationThreshold = 30;

var nextForwardMove = 'x';
var nextBackwardMove = 'x';

var me = new Path.Circle(new Point(ME_PADDING + STEP_LENGTH * 8, view.size.height - ME_PADDING - STEP_HEIGHT * 8), 5);
me.fillColor = 'black';

drawSteps({x: 0, y: 0});
function drawSteps(offset) {
  var path = new Path();
  path.strokeColor = 'black';

  var point = new Point(offset.x + STEP_PADDING - 16 * STEP_LENGTH, offset.y + view.size.height - STEP_PADDING + 16 * STEP_HEIGHT);
  path.moveTo(point);

  for (var i = 0; i < 16 * 3; i++) {
    point = point + [STEP_LENGTH, 0];
    path.lineTo(point);
    point = point + [0, -STEP_HEIGHT];
    path.lineTo(point);
  }
}

function iterate(forward, speed) {
  var i = 0;

  if (forward) {
    if (nextForwardMove === 'x') {
      for (; i < speed; i++) {
        me.position.x += 1;
        if (me.position.x % STEP_LENGTH === 0) {
          nextForwardMove = 'y';
          i = speed;
        }
        else {
          nextBackwardMove = 'x';
        }
      }
    }
    else {
      for (; i < speed; i++) {
        me.position.y -= 1;
        if ((view.size.height - STEP_PADDING * 2 - me.position.y) % STEP_HEIGHT === 0) {
          nextForwardMove = 'x';
          i = speed;
        }
        else {
          nextBackwardMove = 'y';
        }
      }
    }
  }
  else {
    if (nextBackwardMove === 'x') {
      for (; i < speed; i++) {
        me.position.x -= 1;
        if (me.position.x % STEP_LENGTH === 0) {
          nextBackwardMove = 'y';
          i = speed;
        }
        else {
          nextForwardMove = 'x';
        }
      }
    }
    else {
      for (; i < speed; i++) {
        me.position.y += 1;
        if ((view.size.height - STEP_PADDING * 2 - me.position.y) % STEP_HEIGHT === 0) {
          nextBackwardMove = 'x';
          i = speed;
        }
        else {
          nextForwardMove = 'y';
        }
      }
    }
  }
}

function onFrame(event) {
  if (animating) {
    iterate(animatingForward, 6);

    if (animatingForward && me.position.y <= animationThreshold) {
      animating = false;
    }
    else if (!animatingForward && me.position.x <= animationThreshold) {
      animating = false;
    }

    if (colorsAreEqual(currentBackgroundColor, targetBackgroundColor)) {
      targetBackgroundColor = colorsAreEqual(targetBackgroundColor, regularBackgroundColor)? pulseBackgroundColor : regularBackgroundColor;
      currentColorDelta = colorDelta(currentBackgroundColor, targetBackgroundColor, 30);
    } else {
      currentBackgroundColor.r += currentColorDelta.r;
      currentBackgroundColor.g += currentColorDelta.g;
      currentBackgroundColor.b += currentColorDelta.b;
    }

    var color = rgb(currentBackgroundColor);
    document.body.style.backgroundColor = color;
  }
  else {
    if (view.size.width - me.position.x <= 10) {
      animating = true;
      animatingForward = false;
    }
    else if (view.size.height - me.position.y <= 10) {
      animating = true;
      animatingForward = true;
    }
  }
}

function onKeyDown(event) {
  if (animating) {
    return;
  }

  if (event.key == 'right') {
    iterate(true, 2);
  } else if (event.key == 'left') {
    iterate(false, 2);
  }
}

function colorsAreEqual(color1, color2) {
  return Math.abs(color1.r - color2.r) < 1 &&
         Math.abs(color1.g - color2.g) < 1 &&
         Math.abs(color1.b - color2.b) < 1;
}

function colorDelta(color1, color2, steps) {
  return {
    r: (color2.r - color1.r) / steps,
    g: (color2.g - color1.g) / steps,
    b: (color2.b - color1.b) / steps
  };
}

function rgb(color) {
  return 'rgb(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ')';
}
