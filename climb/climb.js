
var STEP_PADDING = 10;
var ME_PADDING = 20;
var STEP_HEIGHT = Math.round((view.size.height - STEP_PADDING * 2) / 16);
var STEP_LENGTH = Math.round((view.size.width - STEP_PADDING * 2) / 16);
console.log('length: ' + STEP_LENGTH + ' / height: ' + STEP_HEIGHT);

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
  }
  else {
    if (view.size.width - me.position.x <= 15) {
      animating = true;
      animatingForward = false;
    }
    else if (view.size.height - me.position.y <= 15) {
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
    iterate(true, 1);
  } else if (event.key == 'left') {
    iterate(false, 1);
  }
}
