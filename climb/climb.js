
var STEP_HEIGHT = 50;
var STEP_LENGTH = 80;
var MIN_COUNT = 50;

drawSteps();
function drawSteps() {
  var path = new Path();
  path.strokeColor = 'black';

  var point = new Point(10, view.size.height - 10);
  path.moveTo(point);

  for (var i = 0; i < 20; i++) {
    point = point + [STEP_LENGTH, 0];
    path.lineTo(point);
    point = point + [0, -STEP_HEIGHT];
    path.lineTo(point);
  }
}

var me = new Path.Circle(new Point(10, view.size.height - 30), 5);
me.fillColor = 'black';

var movingHorizontally = true;
var nextHorizontalMilestone = STEP_LENGTH;
var nextVerticalMilestone = view.size.height - 30 - STEP_HEIGHT;

function iterate(count) {
  // if (count < MIN_COUNT) return;
  //
  // if (movingHorizontally) {
  //   me.position += [1, 0];
  //   if (me.position.x == nextHorizontalMilestone) {
  //     movingHorizontally = false;
  //     nextHorizontalMilestone += STEP_LENGTH;
  //   }
  // }
  // else {
  //   me.position += [0, -1];
  //   if (me.position.y == nextVerticalMilestone) {
  //     movingHorizontally = true;
  //     nextVerticalMilestone -= STEP_HEIGHT;
  //   }
  // }
}

function onFrame(event) {
  iterate(event.count);
}

function onKeyDown(event) {
  switch (event.key) {
    case 'up':
      me.position += [0, -1];
      break;
    case 'down':
      me.position += [0, 1];
      break;
    case 'left':
      me.position += [-1, 0];
      break;
    case 'right':
      me.position += [1, 0];
      break;
  }
}
