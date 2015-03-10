
$(function() {

  var kt = new Kutility();

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({antialias: true});
  } catch(e) {
    $('.error').show();
    setTimeout(function() {
      $('.error').fadeOut();
    }, 6666);
    renderer = new THREE.CanvasRenderer();
  }

  renderer.setClearColor(0xffffff, 1);
  document.body.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
  scene.add(camera);

  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.intensity = 0.5;
  directionalLight.position.set(0, 10, 0);
  scene.add(directionalLight);

  var loader = new THREE.JSONLoader();

  $(window).resize(resize);
  resize();

  var models = [
    //'./models/bread.json',
    './models/martini.json',
    //'./models/rootbeer.json',
    './models/turkeyleg.json'
  ];
  var modelCache = {};

  var raindrops = [];
  var groundlings = [];

  setInterval(function() {
    addRaindrop();
  }, 200);

  render();

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function render() {
    requestAnimationFrame(render);

    for (var i = 0; i < raindrops.length; i++) {
      var raindrop = raindrops[i];
      if (raindrop.userData.raining) {
        raindrop.position.y -= raindrop.userData.rainSpeed;

        if (raindrop.position.y <= -5) {
          raindrop.userData.raining = false;
        }
      }
    }

    renderer.render(scene, camera);
  }

  function addRaindrop() {
    var model = kt.choice(models);
    console.log(model);

    loadModel(model, function(geometry, material) {
      var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      mesh.position.x = kt.randInt(-12, 12);
      mesh.position.y = kt.randInt(15, 20);
      mesh.position.z = -1 * kt.randInt(19, 30);

      mesh.userData.raining = true;
      mesh.userData.rainSpeed = Math.random() * 0.12 + 0.02;

      raindrops.push(mesh);
      if (raindrops.length > 60) {
        var oldMesh = raindrops.shift();

        groundlings.push(oldMesh);
        if (groundlings.length > 250) {
          var finishedMesh = groundlings.shift();
          scene.remove(finishedMesh);
        }
      }
    });
  }

  function loadModel(model, callback) {
    var cached = modelCache[model];
    if (cached) {
      callback(cached.geometry.clone(), cached.material.clone());
      return;
    }

    loader.load(model, function(geometry, materials) {
      modelCache[model] = {geometry: geometry, material: new THREE.MeshFaceMaterial(materials)};
      loadModel(model, callback);
    });
  }

});

// request animation frame shim
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
