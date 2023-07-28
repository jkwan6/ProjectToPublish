import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { CharacterControls } from './CharacterControls/CharacterControls';
import * as RAPIER from '@dimforge/rapier3d'
import { RigidBody } from '@dimforge/rapier3d';
import { RapierPhysicsWorld } from './RapierPhysicsWorld';
import { ThreeJsWorld } from './ThreeJsWorld';
import { IControllerParams, modelAction } from './CharacterControls/CharacterControlsDetails/ControllerUtils';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export interface IBoxDimensions {
  length: number,
  height: number,
  width: number
}

@Component({
  selector: 'app-home-three-alternative-two',
  templateUrl: './home-three-alternative-two.component.html',
  styleUrls: ['./home-three-alternative-two.component.css'],
  providers: [RapierPhysicsWorld, ThreeJsWorld]
})
export class HomeThreeAlternativeTwoComponent implements OnInit, OnDestroy{

  constructor(
    private sideNavService: SideNavService,
    private rapierPhysics: RapierPhysicsWorld,
    private threeJsWorld: ThreeJsWorld
  ) {
    this.sizes = this.sideNavService.getBodyDims.value; this.sizes.height = 600;
    this.scene = this.threeJsWorld.instantiateThreeJsScene();
    this.camera = this.threeJsWorld.instantiateThreeJsCamera(this.sizes.width / this.sizes.height);
  }

  // #region PROPERTIES
  camera!: THREE.PerspectiveCamera;
  animateScreenResize!: Observable<IElementDimensions>;
  sizes!: IElementDimensions;
  subscription!: Subscription;
  scene!: THREE.Scene;
  canvas!: HTMLCanvasElement;
  world!: RAPIER.World;
  bodies: { rigid: RigidBody, mesh: THREE.Mesh }[] = [];
  animate!: (() => {}) | any;
  requestId!: number;
  renderer!: THREE.WebGLRenderer;
  keyboardUpEvent: (() => {}) | any;
  keyboardDownEvent: (() => {}) | any;
  mouse: THREE.Vector2 = new THREE.Vector2();
  mouseArrowHelper!: THREE.ArrowHelper;
  bodyArrowHelper!: THREE.ArrowHelper;
  mouseRayCaster: THREE.Raycaster = new THREE.Raycaster();
  bodyRayCaster: THREE.Raycaster = new THREE.Raycaster();
  characterControls!: CharacterControls;
  orbitControls!: OrbitControls;
  characterModel = new THREE.Group;
  environementWorld = new THREE.Group;
  feetRayAndArrowArray: { ray: THREE.Raycaster, arrow: THREE.ArrowHelper }[] = [];
  feetRayArray: THREE.Raycaster[] = [];
  walkDirectionRayCasters: THREE.Raycaster[] = [];
  walkDirectionArrowHelpers: THREE.ArrowHelper[] = [];
  testArray = new THREE.Group;
  threeJsEnvironment = new THREE.Group;
  // #endregion
  feetRayStepper: THREE.Raycaster[] = [];
  tempCoordinate = new THREE.Vector3(0,0,0);
  feetPlane = new THREE.Mesh;
  feetArrowGroup = new THREE.Group;
  // #region ON DESTROY
  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId);
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.subscription.unsubscribe();
    document.removeEventListener('keyup', this.keyboardUpEvent)
    document.removeEventListener('keydown', this.keyboardDownEvent)
    this.world.free();}
  // #endregion

  ngOnInit(): void {

    this.world = this.rapierPhysics.instantiatePhysicsWorld();                  // Creating Physics World

    for (let i = 0; i < 20; i++) {
      var rngx = (0.5 - Math.random()) * 50
      var rngy = Math.random() * 50
      var rngz = (0.5 - Math.random()) * 50
      var boxposition = new RAPIER.Vector3(rngx, rngy, rngz);                 // adding box to scene
      var box: IBoxDimensions = { length: 4, height: 5, width: 4 };
      var boxmesh = this.threeJsWorld.createBoxMesh(box)
      var boxrigidbody = this.rapierPhysics.createRigidBox(box, boxposition);
      this.bodies.push({ rigid: boxrigidbody, mesh: boxmesh });               // storing them
    }

    var planeWidth: number = 0.5;
    var planeLength: number = 0.5;
    this.feetPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeWidth, planeLength, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 'red'
      })
    );
    this.feetPlane.rotateX(- Math.PI / 2);
    this.scene.add(this.feetPlane)


    // FeetCollider
    var FeetColliderPlane: THREE.Vector3[] =
      [
        new THREE.Vector3(-planeWidth / 2, 0, -planeLength / 2),
        new THREE.Vector3(-planeWidth / 2, 0, +planeLength / 2),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(planeWidth / 2, 0, +planeLength / 2),
        new THREE.Vector3(planeWidth / 2, 0, -planeLength / 2)
      ];
    var rayDirection = new THREE.Vector3(0, -1, 0);

    FeetColliderPlane.forEach(arrowOrigin => {
      var rayCaster = new THREE.Raycaster(arrowOrigin, rayDirection, 0, 10);
      var arrowHelper = new THREE.ArrowHelper(
        rayCaster.ray.direction,
        rayCaster.ray.origin,
        1,
        0xff0000);
      this.feetRayAndArrowArray.push({ ray: rayCaster, arrow: arrowHelper })
      this.feetRayArray.push( rayCaster )
      this.feetArrowGroup.add(arrowHelper)
    })
    this.scene.add(this.feetArrowGroup)

    // feetCollider Additional Arrows
    var FeetColliderPlane: THREE.Vector3[] =
      [
        new THREE.Vector3(-planeWidth / 2, 0.1, -planeLength / 2),
        new THREE.Vector3(0, 0.1, -planeLength / 2),
        new THREE.Vector3(planeWidth / 2, 0.1, -planeLength / 2)
      ];
    var rayDirection = new THREE.Vector3(0, -0.8, -1);

    FeetColliderPlane.forEach(arrowOrigin => {
      var rayCaster = new THREE.Raycaster(arrowOrigin, rayDirection, 0, 1);
      var arrowHelper = new THREE.ArrowHelper(
        rayCaster.ray.direction,
        rayCaster.ray.origin,
        1,
        0xff0000);
      this.feetRayAndArrowArray.push({ ray: rayCaster, arrow: arrowHelper })
      this.feetRayStepper.push(rayCaster)
      this.feetArrowGroup.add(arrowHelper)
    })

    // Floor
    let heights: number[] = [];                                                 // Creating Floor
    let scale = new RAPIER.Vector3(70.0, 3.0, 70.0);
    let nsubdivs = 20;
    var threeJsFloor = this.threeJsWorld.createFloor(scale, nsubdivs, heights);
    this.rapierPhysics.createPhysicsFloor(scale, nsubdivs, heights);
    this.threeJsEnvironment.add(threeJsFloor);
    this.scene.add(this.threeJsEnvironment)

    this.canvas = document.querySelector('.HomeWebgl')!;                        // Canvas & Renderer
    this.renderer = this.threeJsWorld.instantiateThreeJsRenderer(this.canvas, this.sizes);
    this.orbitControls = this.threeJsWorld.instantiateThreeJsControls();        // Controls
    this.threeJsWorld.instantiateThreeJsLights();                               // Light

    // RAYCASTER
    this.mouseArrowHelper = new THREE.ArrowHelper(this.mouseRayCaster.ray.direction, this.mouseRayCaster.ray.origin, 1, 0xff0000)
    this.scene.add(this.mouseArrowHelper);


    const gltfLoader = new GLTFLoader();
    gltfLoader
      .load('../../../../../assets/models/XBot/XBot2.glb',
        (gltf) => {
          this.characterModel = gltf.scene;
          this.characterModel.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          this.characterModel.position.set(0, 3, 0);
          this.scene.add(this.characterModel);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          const animationMixer = new THREE.AnimationMixer(this.characterModel);
          const animationsMap: Map<string, THREE.AnimationAction> = new Map()
          gltfAnimations.filter(a => a.name != modelAction.TPose).forEach((a: THREE.AnimationClip) => {
            animationsMap.set(a.name, animationMixer.clipAction(a))
          })

          // Rigid Body
          let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-10, 1000, 1);
          let characterRigidBody = this.world.createRigidBody(bodyDesc);
          let dynamicCollider = RAPIER.ColliderDesc.cuboid(0.5,0.5,0.5);
          this.world.createCollider(dynamicCollider, characterRigidBody);

          var params: IControllerParams = {
            model:this.characterModel,
            mixer:animationMixer,
            animationsMap: animationsMap,
            orbitControl: this.orbitControls,
            camera: this.camera,
            currentAction: modelAction.idle,
            ray: new RAPIER.Ray(
              { x: 0, y: 0, z: 0 },
              { x: 0, y: -5, z: 0 }
            ),
            rigidBody: characterRigidBody,
            feetCollider: this.feetRayArray,
            feetArrowGroup: this.feetArrowGroup,
            feetRayStepper: this.feetRayStepper,
            threeJsEnv: this.threeJsEnvironment
          }

          this.characterControls = new CharacterControls(params)
        }
    );


    const gltfloader = new GLTFLoader();
    const dracroLoader = new DRACOLoader();
    dracroLoader.setDecoderPath('../../../../../assets/draco/')

    gltfLoader.setDRACOLoader(dracroLoader);

    gltfLoader.load("../../../../../assets/models/AltTower.glb",
      (gltf) => {

        this.environementWorld = gltf.scene;
        gltf.scene.scale.set(100, 100, 100);
        gltf.scene.position.set(0, 49, 0);
        this.scene.add(gltf.scene)
        this.threeJsEnvironment.add(gltf.scene);
        this.scene.add(this.threeJsEnvironment)

      },
      () => { console.log('progress') },
      () => { console.log('error') }
    )


    // Loader
    var path = "../../../../../assets/models/poly_4.glb"
    var loader = new GLTFLoader();
    loader.load
      (
        path,
        object => {
          object.scene.scale.set(1.2, 1.2, 1.2);
          object.scene.position.set(0, 3.2, 0);
          this.scene!.add(object.scene)
          this.threeJsEnvironment.add(object.scene)
        }
      )
    this.defineEvents();
  }


  // EVENTS

  defineEvents() {
    // #region EVENT LISTENERS
    /* <---------------------- ANIMATE FUNCTION ----------------------> */
    const clock = new THREE.Clock();
    this.animate = () => {
      let mixerUpdateDelta = clock.getDelta();
      if (this.characterControls) {
        this.characterControls.update(this.world, mixerUpdateDelta, keysPressed);
      }
      this.orbitControls.update()
      this.renderer.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(this.animate);

      this.world.step();

      // Moving ThreeJs Cubes To Position of Rapier Cubes
      this.bodies.forEach(body => {
        let position = body.rigid.translation();
        let rotation = body.rigid.rotation();

        body.mesh.position.set(position.x, position.y, position.z);
        body.mesh.setRotationFromQuaternion(
          new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
      })

      // Mouse Pointer Arrow and Ray
      let objectToTest: THREE.Mesh [] = [];
      this.bodies.forEach(body => {
        objectToTest.push(body.mesh)
      })
      const intersects = this.mouseRayCaster.intersectObjects(objectToTest);
      for (let object of objectToTest) {
        let varX: any;
        varX = object as unknown as THREE.Object3D;
        let materialColor = new THREE.Color('red');
        varX.material.color.set(materialColor)
      }
      for (let intersect of intersects) {
        let varX: any;
        varX = intersect as unknown as THREE.Object3D;
        let materialColor = new THREE.Color('blue');
        varX.object.material.color.set(materialColor);
      }
      // Moving Mouse Pointer Arrow And Ray
      this.mouseRayCaster.setFromCamera(this.mouse, this.camera);
      this.mouseArrowHelper.setDirection(this.mouseRayCaster.ray.direction);
      this.mouseArrowHelper.position.set(
        this.mouseRayCaster.ray.origin.x,
        this.mouseRayCaster.ray.origin.y,
        this.mouseRayCaster.ray.origin.z
      )


      // Moving FeetCollidersWithCharacter
      this.feetArrowGroup.position.set(
        this.characterModel.position.x,
        this.characterModel.position.y + 2,
        this.characterModel.position.z
      )
      this.feetRayAndArrowArray.forEach((rayAndArrow) => {
        rayAndArrow.arrow.getWorldPosition(this.tempCoordinate);
        rayAndArrow.ray.ray.origin.set(
          this.tempCoordinate.x,
          this.tempCoordinate.y,
          this.tempCoordinate.z,
        )
      })
    }
    this.animate();

    /* <---------------------- MOUSE POSITION EVENT ----------------------> */
    this.canvas!.addEventListener('mousemove', (event: MouseEvent) => {
      var boundingRect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((event.pageX - boundingRect.left) > 0)
        ? (event.pageX - boundingRect.left)
        : 0
      this.mouse.y = ((boundingRect.bottom - event.pageY) > 0)
        ? (boundingRect.bottom - event.pageY)
        : 0
      var length = boundingRect.right - boundingRect.left;
      var height = boundingRect.bottom - boundingRect.top;
      this.mouse.x = (-1 * (length / 2 - this.mouse.x)) / length * 2;
      this.mouse.y = (-1 * (height / 2 - this.mouse.y)) / height * 2;
    });

    /* <---------------------- KEYBOARD PRESS EVENT ----------------------> */
    this.keyboardDownEvent = (event: any) => {
      if (event.shiftKey && this.characterControls) {
        this.characterControls.switchRunToggle()
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
      }
      console.log(keysPressed);
    }
    this.keyboardUpEvent = (event: any) => {
      (keysPressed as any)[event.key.toLowerCase()] = false
    }

    const keysPressed = {}
    document.addEventListener('keydown', this.keyboardDownEvent, false);
    document.addEventListener('keyup', this.keyboardUpEvent, false);

    /* <---------------------- RESIZE EVENT ----------------------> */
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 600;                                          // Height

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();
  }
}
