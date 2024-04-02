const createScene = () => {
    // Scene
    const scene = new BABYLON.Scene(engine);
    scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.4, 1, 0.4), scene);
  
    // Camera
    const camera = new BABYLON.ArcRotateCamera('arcCamera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    camera.setPosition(new BABYLON.Vector3(50, 30, 100));
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20; 
    camera.checkCollisions = true;
  
    // Player
    const player = BABYLON.Mesh.CreateBox('box', 1.0, scene);
    player.position.y = 3;
    player.position.x = 10;
    player.position.z = 10;
    player.checkCollisions = true;
    player.physicsImpostor = new BABYLON.PhysicsImpostor(
      player, 
      BABYLON.PhysicsImpostor.BoxImpostor, 
      { mass: 1, friction: 100, restitution: 0 }, 
      scene
    );
    
    const playerMaterial = new BABYLON.StandardMaterial('material', scene);
    playerMaterial.diffuseColor = new BABYLON.Color3(0, 0.58, 0.86);
    player.material = playerMaterial;
  
    // Player controls
    const speed = 0.15
    const keys = {
      jump: 0,
      left: 0,
      right: 0,
      forward: 0,
      back: 0
    };
    scene.onKeyboardObservable.add((kbInfo) => {
      const isPressed = kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN ? 1 : 0;
      const key = kbInfo.event.key;
      if (key === 'a' || key === 'A') keys.left = isPressed;
      if (key === 'd' || key === 'D') keys.right = isPressed;
      if (key === 'w' || key === 'W') keys.forward = isPressed;
      if (key === 's' || key === 'S') keys.back = isPressed;
      if (key === " ") keys.jump = isPressed;
    });
    player.update = function () {
      player.rotationQuaternion.x = 0;
      player.rotationQuaternion.z = 0;
      const cameraDirectionFwd = camera.getForwardRay().direction;
      const normalFwd = (new BABYLON.Vector3(cameraDirectionFwd.x, 0, cameraDirectionFwd.z)).normalize();
  
      if (keys.jump) {
        player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 1, 0), player.getAbsolutePosition());
      }
      if (keys.left) {
        player.locallyTranslate(new BABYLON.Vector3(-speed, 0, 0));
      }
      if (keys.right) {
        player.locallyTranslate(new BABYLON.Vector3(speed, 0, 0));
      }
      if (keys.forward) {
        player.lookAt(player.position.add(normalFwd), 0, 0, 0);
        player.position = player.position.add(new BABYLON.Vector3(normalFwd.x * speed, 0, normalFwd.z * speed));
      }
      if (keys.back) {
        player.lookAt(player.position.add(normalFwd), 0, 0, 0);
        player.position = player.position.add(new BABYLON.Vector3(-normalFwd.x * speed, 0, -normalFwd.z * speed));
      }
    }
  
    // Camera follow player
    camera.setTarget(player);
  
    // Main game loop
    engine.runRenderLoop(() => {
      if (player != null) {
        player.update();
      }
    })
  
    // Spiral staircase   
    let boxSize = 3;
    for (let i = 0; i < 20; i++) {
      const box = BABYLON.MeshBuilder.CreateBox("box", {size: boxSize}, scene);
      box.position.x = Math.floor(5 * Math.cos(i/2) * boxSize);
      box.position.z = Math.floor(5 * - Math.sin(i/2) * boxSize);
      box.position.y = (boxSize/2) + i * boxSize;
      box.checkCollisions = true;
      box.physicsImpostor = new BABYLON.PhysicsImpostor(
        box, 
        BABYLON.PhysicsImpostor.BoxImpostor, 
        { mass: 0, friction: 100, restitution: 0 }, 
        scene
      );
    }
  
    // Ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
    ground.material = new BABYLON.GridMaterial('groundMaterial', scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground, 
      BABYLON.PhysicsImpostor.BoxImpostor, 
      { mass: 0, friction: 2, restitution: 0 }, 
      scene
    );
    ground.checkCollisions = true;
    
    // Skybox
    const skybox = BABYLON.Mesh.CreateBox('skyBox', 5000.0, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      '//www.babylonjs.com/assets/skybox/TropicalSunnyDay',
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
  
    return scene;
  };
  