var createScene = function () {
    
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 120, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", {segments: 16, diameter: 2, scene});
    const turret = BABYLON.MeshBuilder.CreateSphere('turret', {segments: 16, diameter: .5});
    var turretPivot = new BABYLON.TransformNode("pivot", scene);
    turret.parent = turretPivot;
    turret.position.z = 1.5;
    turretPivot.parent = sphere;
   
    let nextBulletTime = new Date().getTime();
    
    // Keyboard events
    var inputMap ={};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    // Game/Render loop
    scene.onBeforeRenderObservable.add(()=>{
        if(inputMap["ArrowLeft"]){
            sphere.position.x -= .5
        }  
        if(inputMap["ArrowRight"]){
           sphere.position.x += .5
        }
        if(inputMap["ArrowUp"]){
           sphere.position.z += .5
        }
        if(inputMap["ArrowDown"]){
           sphere.position.z -= .5
        }
        const currentTime = new Date().getTime();
        if(inputMap["s"] && currentTime > nextBulletTime){

		    var forward = new BABYLON.Vector3(0,0,1);		
            var direction = turret.getDirection(forward).normalize(); 
            
            const bullet = BABYLON.Mesh.CreateBox(`${currentTime}bullet`, .2, scene);
            nextBulletTime = new Date().getTime() + 10;
            bullet.position = turret.absolutePosition.clone();

            const bulletAction = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt) {
                bullet.position.addInPlace(direction);
            }));
            setTimeout(()=>{
                scene.actionManager.unregisterAction(bulletAction);
                bullet.dispose();
            }, 1000)
        }

        if(inputMap["a"]){
            turretPivot.rotation.y -= .04;
        }
        if(inputMap["d"]){
            turretPivot.rotation.y += .04;
        }
    })
    return scene;
};