
function main() {
  var circle = $('.glow-circle');
  var innerCircle = $('.inner-circle');

  var innerCount = 0;
  var MAX_COUNT = 300;

  var startedMirror = false;
  var mirrorError = false;
  var intervalAction = null;

  Webcam.set({
    width: window.innerWidth,
    height: window.innerHeight,
    dest_width: 640,
    dest_height: 480,
  });
  Webcam.on('error', function(err) {
    mirrorError = true;
    if (startedMirror) {
      showError();
    }
  });
  Webcam.on('live', function() {
    if (mirrorError) {
      hideError();
    }
  });
  Webcam.attach('#mirror');

  circle.mouseenter(function() {
    intervalAction = 'increment';
    buzz.play({
      pitch : 60,
      env: {
        hold: 1000,
        release: 0.75,
        attack: 0.5
      }
    });
  });

  circle.mouseleave(function() {
    intervalAction = 'decrement';
    buzz.stop();
  });

  var buzz = new Wad({
    source : 'triangle',
    filter : {
      type : 'lowpass',
      frequency : 800,
      q : 8.5,
      env : {
        attack : 0.2,
        frequency : 600
      }
    }
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
      buzz.stop();
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

    $('#mirror').fadeIn(1200);
    if (mirrorError) {
      showError();
    }
  }

  function showError() {
    $('.mirror-error').show();
  }

  function hideError() {
    $('.mirror-error').hide();
  }
}

main();
