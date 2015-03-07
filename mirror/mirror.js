
function main() {
  var circle = $('.glow-circle');
  var innerCircle = $('.inner-circle');

  var innerCount = 0;
  var MAX_COUNT = 300;

  var startedMirror = false;
  var intervalAction = null;

  circle.mouseenter(function() {
    intervalAction = 'increment';
  });

  circle.mouseleave(function() {
    intervalAction = 'decrement';
  });

  var incrementInterval = setInterval(function() {
    if (intervalAction === 'increment') {
      innerCount += 1;
    }
    else if (intervalAction === 'decrement' && innerCount > 0) {
      innerCount -= 1;
    }

    layoutInnerCircle(innerCount);

    if (innerCount >= MAX_COUNT) {
      clearInterval(incrementInterval);
      startMirror();
    }
  }, 10);

  function layoutInnerCircle(size) {
    var pxSize = size + 'px';
    var halfSize = (size / 2) + 'px';
    var marginSize = (-size / 2) + 'px';

    innerCircle.css('width', pxSize);
    innerCircle.css('height', pxSize);
    innerCircle.css('border-radius', halfSize);
    innerCircle.css('margin-left', marginSize);
    innerCircle.css('margin-top', marginSize);
  }

  function startMirror() {
    startedMirror = true;
    console.log('mirror time!');
  }
}

main();
