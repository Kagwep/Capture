import React, { useContext,useEffect, useRef,useState } from "react";
import './style.css';
import { useParams } from "react-router-dom";
import { RoomContext } from "../contexts/RoomsContext";
import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  SceneLoader,
  Mesh,
  ISceneLoaderAsyncResult,
  AbstractMesh,
  PhysicsImpostor,
  VertexBuffer,
  ArcRotateCamera,
  CubeTexture,
  ActionManager,
  ExecuteCodeAction,
  UniversalCamera,
  Color3,
  AmmoJSPlugin,
  CannonJSPlugin,
  HavokPlugin,
  Animation,
  Quaternion,
  Axis,
  Space,
  PointerEventTypes,
 MorphTargetManager, NativeEngine, WebGPUEngine,
 KeyboardInfo,
 KeyboardEventTypes

} from "@babylonjs/core";
import '@babylonjs/loaders';
import { TfiRulerAlt } from "react-icons/tfi";
import HavokPhysics from "@babylonjs/havok";


type KeyStatus = {
  w: boolean;
  s: boolean;
  a: boolean;
  d: boolean;
  b: boolean;
  Shift: boolean;
};

export const useWebGPU = false;
export var useNative = false;
declare var _native : any;

const roomDetails = () => {
  // get the room id from url
  const { id } = useParams();
  const { rooms } = useContext(RoomContext);

  //get the single room based on id
  const room = rooms.find((item) => {
    if (id !== undefined) {
    return item.id === parseInt(id);
  }
  });



  // destructure room

  const createScene = async (canvas: HTMLCanvasElement | null): Promise<{ scene: Scene | undefined}> => {

    if (!canvas) {
      // If canvas is null, return a promise with an object where scene is undefined
      return Promise.resolve({ scene: undefined, defaultSpheres: () => {},moveSpheres: () => {},playersTurn:'' });
    }    

      const engine = new Engine(canvas, true);

      // scene
      const scene = new Scene(engine);

      scene.ambientColor =  new Color3(1,1,1);
      scene.gravity = new Vector3(0,-0.75,0);

      scene.collisionsEnabled = true;
      // initialize plugin
      const havokInstance = await HavokPhysics();
      // pass the engine to the plugin
      const hk = new HavokPlugin(true, havokInstance);
      // enable physics in the scene with a gravity
      scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
      


        // // This creates and positions a debug camera (non-mesh)
        // var camera = new FreeCamera("camera1", new Vector3(5,5,22), scene);
        // camera.setTarget(Vector3.Zero());
        // camera.attachControl(canvas, true);

        // // This creates ambient light, aiming 0,1,0 - to the sky (non-mesh)
        // var light = new HemisphericLight("light1", new Vector3(5,5,22), scene);
        // light.intensity = 0.8;

            // Camera
        const camera = new ArcRotateCamera('arcCamera', 0, 0, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        camera.setPosition(new Vector3(5,5,22));
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 20; 
        camera.checkCollisions = true;


             
      const loadModels = async (modelName:string) => {
        try {
          const result = await SceneLoader.ImportMeshAsync('', '/models/', modelName);
          // Do something with the result here
          return result; // You can return the result if needed
        } catch (error) {
          // Handle errors if necessary
          console.error(error);
          throw error; // Re-throw the error if needed
        }
      };
      
      // Call the function
      const {meshes} = await loadModels('ascedantmodelone.glb');

      console.log(meshes)

      let shipAscendant = meshes[0];

      if (shipAscendant){

        shipAscendant.rotation = new Vector3( Math.PI, Math.PI,  Math.PI);

      }

     

      if (shipAscendant) {
        shipAscendant.position = new Vector3(5.5, 1, 0);
        shipAscendant.checkCollisions = true
       // shipAscendant.physicsImpostor = new PhysicsImpostor(shipAscendant,PhysicsImpostor.BoxImpostor,{mass:1,friction:100,restitution:0},scene);
       

    }
 
     meshes.map(mesh => {
      mesh.checkCollisions = true;
     });

    //  const shipAscendant = MeshBuilder.CreateBox('box', {size:1.2}, scene);
    //  shipAscendant .position.y = 3;
    //  shipAscendant .position.x = 10;
    //  shipAscendant .position.z = 10;
    //  shipAscendant .checkCollisions = true;
 
     




  //  // camera
  //     const camera = new UniversalCamera("UniversalCamera", new Vector3(5,5,22), scene);

  //     camera.setTarget(Vector3.Zero());

  //     camera.applyGravity = true;
      
  //     camera.ellipsoid = new Vector3(0.4,0.8,0.4);

  //     camera.checkCollisions = true;

  //     camera.attachControl(canvas, true);

      // initialize plugin
    // const havokInstance = await HavokPhysics();
    // // pass the engine to the plugin
    // const hk = new HavokPlugin(true, havokInstance);
    // // enable physics in the scene with a gravity
    // scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
   //  globalThis.HK = await HavokPhysics();

   // const havokModule = new HavokPlugin();
    var gravityVector = new Vector3(0, -9.81, 0);

   // scene.enablePhysics(null, new HavokPlugin(true, await havokModule));



          //shipAscendant controls
    const speed = 0.15
    const keys = {
      jump: 0,
      left: 0,
      right: 0,
      forward: 0,
      back: 0
    };
    scene.onKeyboardObservable.add((kbInfo) => {
      const isPressed = kbInfo.type === KeyboardEventTypes.KEYDOWN ? 1 : 0;
      const key = kbInfo.event.key;
      if (key === 'a' || key === 'A') keys.left = isPressed;
      if (key === 'd' || key === 'D') keys.right = isPressed;
      if (key === 'w' || key === 'W') keys.forward = isPressed;
      if (key === 's' || key === 'S') keys.back = isPressed;
      if (key === " ") keys.jump = isPressed;
    });


      
    

  
    // Camera followshipAscendant
    

  //     const hero = MeshBuilder.CreateBox("hero", {size: 2.0}, scene);
  //     hero.position.x = 5.42;
  //     hero.position.y = 1.0;
  //     hero.position.z = 22.75;
  //     //hero.physicsImpostor = new PhysicsImpostor(hero, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.0, friction: 0.1 }, scene);

  //     const pointer = MeshBuilder.CreateSphere("Sphere", { diameter: 0.01 }, scene);
  //     pointer.position.x = 0.0;
  //     pointer.position.y = 0.0;
  //     pointer.position.z = 0.0;
  //     pointer.isPickable = false;

  //     let moveForward: boolean = false;
  //     let moveBackward: boolean = false;
  //     let moveRight: boolean = false;
  //     let moveLeft: boolean = false;


  //     const onKeyDown = function (event: { keyCode: any; }) {
  //       switch (event.keyCode) {
  //           case 38: // up
  //           case 87: // w
  //               moveForward = true;
  //               break;

  //           case 37: // left
  //           case 65: // a
  //               moveLeft = true; break;

  //           case 40: // down
  //           case 83: // s
  //               moveBackward = true;
  //               break;

  //           case 39: // right
  //           case 68: // d
  //               moveRight = true;
  //               break;

  //           case 32: // space
  //               break;
  //       }
  //   };

  //   const onKeyUp = function (event: { keyCode: any; }) {
  //       switch (event.keyCode) {
  //           case 38: // up
  //           case 87: // w
  //               moveForward = false;
  //               break;

  //           case 37: // left
  //           case 65: // a
  //               moveLeft = false;
  //               break;

  //           case 40: // down
  //           case 83: // a
  //               moveBackward = false;
  //               break;

  //           case 39: // right
  //           case 68: // d
  //               moveRight = false;
  //               break;
  //       }
  //   };
    
    

  //   document.addEventListener('keydown',onKeyDown,false);
  //   document.addEventListener('keyup',onKeyUp,false);


    scene.registerBeforeRender(() => {
      if (shipAscendant){

        const cameraDirectionFwd = camera.getForwardRay().direction;
        const normalFwd = (new Vector3(cameraDirectionFwd.x, 0, cameraDirectionFwd.z)).normalize();
    
       //  if (keys.jump) {
       //  shipAscendant.physicsImpostor?.applyImpulse(new Vector3(0, 1, 0),shipAscendant.getAbsolutePosition());
       //  }
        if (keys.right) {
         shipAscendant.locallyTranslate(new Vector3(-speed, 0, 0));
        }
        if (keys.left) {
         shipAscendant.locallyTranslate(new Vector3(speed, 0, 0));
        }
        if (keys.back) {
         //shipAscendant.lookAt(shipAscendant.position.add(normalFwd), 0, 0, 0);
         shipAscendant.position =shipAscendant.position.add(new Vector3(normalFwd.x * speed, 0, normalFwd.z * speed));
        }
        if (keys.forward) {
        //  shipAscendant.lookAt(shipAscendant.position.add(normalFwd), 0, 0, 0);
         shipAscendant.position =shipAscendant.position.add(new Vector3(-normalFwd.x * speed, 0, -normalFwd.z * speed));
        }
        camera.setTarget(shipAscendant);
        
      }

  });
  
  

  //   let isLocked = false;
    

  //   scene.onPointerDown = (evt) => {
  //     if (!isLocked){
  //       canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
  //       if (canvas.requestPointerLock){
  //         canvas.requestPointerLock();
  //       }
  //     }
  //   }


  //   	// Event listener when the pointerlock is updated (or removed by pressing ESC for example).
	// const pointerlockchange =  () => {

	// 	let controlEnabled = (document as any).mozPointerLockElement || (document as any).webkitPointerLockElement || (document as any).msPointerLockElement || document.pointerLockElement || null;
		
	// 	// If the user is already locked
	// 	if (!controlEnabled) {
	// 		//camera.detachControl(canvas);
	// 		isLocked = false;
	// 	} else {
	// 		//camera.attachControl(canvas);
	// 		isLocked = true;
	// 	}
	// };
  // 	// Attach events to the document
	// document.addEventListener("pointerlockchange", pointerlockchange, false);
	// document.addEventListener("mspointerlockchange", pointerlockchange, false);
	// document.addEventListener("mozpointerlockchange", pointerlockchange, false);
	// document.addEventListener("webkitpointerlockchange", pointerlockchange, false);


  const border0 = MeshBuilder.CreateBox("border0", {size : 1.0}, scene);
  border0.scaling = new Vector3(5, 100, 200);
  border0.position.x = -100.0;
  border0.checkCollisions = true;
  border0.isVisible = false;

  const border1 = MeshBuilder.CreateBox("border1", {size : 1.0}, scene);
  border1.scaling = new Vector3(5, 100, 200);
  border1.position.x = 100.0;
  border1.checkCollisions = true;
  border1.isVisible = false;

  const border2 = MeshBuilder.CreateBox("border2", {size : 1.0}, scene);
  border2.scaling = new Vector3(200, 100, 5);
  border2.position.z = 100.0;
  border2.checkCollisions = true;
  border2.isVisible = false;

  const border3 = MeshBuilder.CreateBox("border3", {size : 1.0}, scene);
  border3.scaling = new Vector3(200, 100, 5);
  border3.position.z = -100.0;
  border3.checkCollisions = true;
  border3.isVisible = false;

  // border0.physicsImpostor = new PhysicsImpostor(border0, PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
  // border1.physicsImpostor = new PhysicsImpostor(border1, PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
  // border2.physicsImpostor = new PhysicsImpostor(border2, PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
  // border3.physicsImpostor = new PhysicsImpostor(border3, PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);



  
      const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 2, 0), scene);


      hemiLight.intensity = 1;
    
      //const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

      // const board = SceneLoader.ImportMesh('','./models/','board.gltf',scene,(meshes) => {
      //   console.log('meshes',meshes)
      // })
// Subscribe to the onMouseWheelObservable event
      // scene.onPointerObservable.add((eventData) => {
      //   if (eventData.type === PointerEventTypes.POINTERWHEEL) {
      //       const event = eventData.event as WheelEvent;
      //       // Check if scrolled up or down
      //       const delta = event.deltaY;
      //       // Adjust zoom speed as needed
      //       const zoomSpeed = 0.1;

      //       // Zoom in or out based on scroll direction
      //       if (delta < 0) {
      //           // Scroll up, zoom in
      //           camera.position.addInPlace(camera.getDirection(new Vector3(0, 0, 1)).scale(zoomSpeed));
      //       } else if (delta > 0) {
      //           // Scroll down, reverse zoom (zoom out)
      //           camera.position.subtractInPlace(camera.getDirection(new Vector3(0, 0, 1)).scale(zoomSpeed));
      //       }
      //   }
      // });

    


 

      const test_mesh = meshes[110];

      const burrels = meshes.find(mesh => mesh.name === 'Cylinder.001');

    //

    const control_turret_one = meshes.find(mesh => mesh.name === 'control_turret_one_primitive0');



    if (control_turret_one && burrels) {

      console.log(burrels)

      burrels.parent = control_turret_one
    
      control_turret_one.rotation.y = 1;
  
      console.log("Turret rotation applied successfully.");
  } else {
      console.error("Mesh 'control_turret_one_primitive0' not found.");
  }

    const burrelAnims = burrels?.animations;

    console.log(burrelAnims)

    // Assuming you have a scene with animations and you want to stop a specific one
    // Find the animation you want to stop
    var targetAnimationName = "Cylinder.001Action_channel0_0"; // Name of the animation you want to stop
    var animation = burrelAnims?.find(a => a.name === targetAnimationName);

    // If the animation is found, pause it
    if (animation) {
      animation.loopMode = 0
        
    }

          // // Event listener for keydown (press)
          // scene.onKeyDown = (evt) => {
          //   if (evt.key === 'F') {
          //     if (!isPlaying) {
          //       burrelsAnimation.start(true, 1.0, false); // Start animation, looped, normal speed
          //       isPlaying = true;
          //     }
          //   }
          // };

          // // Event listener for keyup (release)
          // scene.onKeyUp = (evt) => {
          //   if (evt.key === 'F' && isPlaying) {
          //     burrelsAnimation.stop();
          //     isPlaying = false;
          //   }
          // };


      const paint42 = new StandardMaterial("material", scene);

      // Load the texture
      const texture = new Texture("https://res.cloudinary.com/duybctvku/image/upload/v1710409854/_27262f6a-ccf7-4ea1-a21b-6296504c1814_qvifas.jpg", scene);

      texture.vScale = -1;
      
      // Assign the texture to the material
      paint42.diffuseTexture = texture;
      
      // Assign the material to the mesh
      test_mesh.material = paint42;


   
      // constshipAscendant =shipAscendant_meshes.find(mesh => mesh.name === '__root__');

      
    // Iterate through all meshes in the scene
        scene.meshes.forEach(mesh => {
          // Check if the mesh is within the camera's view frustum
          if (mesh.name == '__root__') {

            console.log(mesh)
              
          }
      });





      // Assuming 'scene' is your Babylon.js scene object
      engine.runRenderLoop(() => {


    

        scene.render();
      });
    
      window.addEventListener('resize', () => {
        engine.resize();
      });

      //ground.material = CreateGroundMaterial(scene);
      // ball.material = CreateBallMaterial(scene);

    
      return {scene};
  };


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene | undefined>(undefined);


  useEffect(() => {
    const loadScene = async (): Promise<() => void> => {
      const {scene:sceneCreated} = await createScene(canvasRef.current);

      
      // Optionally, you can handle the scene instance or perform additional actions here

      if (sceneCreated) {
        setScene(sceneCreated);

      }
      
      return () => {
        if (sceneCreated) {
          sceneCreated.dispose(); // Clean up the scene when the component unmounts
        }
      };
    };

    const cleanup = loadScene().then(cleanupFunction => cleanupFunction);

    return () => {
      cleanup.then(cleanupFunction => cleanupFunction());
    };
  }, []);


  //console.log("am available here",playerTurn);

  return (
    <div className="container mx-auto">
      <div className="w-full mt-28 h-screen  flex justify-center items-center">
          <canvas className="canvas" ref={canvasRef}></canvas>
      </div>
    </div>

  );
};

export default roomDetails;

