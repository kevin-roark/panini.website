
var STEP_PADDING = 10;
var ME_PADDING = 20;
var STEP_HEIGHT = Math.round((view.size.height - STEP_PADDING * 2) / 16);
var STEP_LENGTH = Math.round((view.size.width - STEP_PADDING * 2) / 16);
console.log('length: ' + STEP_LENGTH + ' / height: ' + STEP_HEIGHT);

drawSteps();
function drawSteps() {
  var path = new Path();
  path.strokeColor = 'black';

  var point = new Point(STEP_PADDING, view.size.height - STEP_PADDING);
  path.moveTo(point);

  for (var i = 0; i < 16; i++) {
    point = point + [STEP_LENGTH, 0];
    path.lineTo(point);
    point = point + [0, -STEP_HEIGHT];
    path.lineTo(point);
  }
}

var me = new Path.Circle(new Point(ME_PADDING, view.size.height - ME_PADDING), 5);
me.fillColor = 'black';

var nextForwardMove = 'x';
var nextBackwardMove = 'x';

function iterate(forward) {
  if (forward) {
    if (nextForwardMove === 'x') {
      me.position.x += 1;
      if (me.position.x % STEP_LENGTH === 0) {
        nextForwardMove = 'y';
      }
      else {
        nextBackwardMove = 'x';
      }
    }
    else {
      me.position.y -= 1;
      if ((view.size.height - STEP_PADDING * 2 - me.position.y) % STEP_HEIGHT === 0) {
        nextForwardMove = 'x';
      }
      else {
        nextBackwardMove = 'y';
      }
    }
  }
  else {
    if (nextBackwardMove === 'x') {
      me.position.x -= 1;
      if (me.position.x % STEP_LENGTH === 0) {
        nextBackwardMove = 'y';
      }
      else {
        nextForwardMove = 'x';
      }
    }
    else {
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

function onFrame(event) {

}

function onKeyDown(event) {
  if (event.key == 'right') {
    iterate(true);
  } else if (event.key == 'left') {
    iterate(false);
  }
}
