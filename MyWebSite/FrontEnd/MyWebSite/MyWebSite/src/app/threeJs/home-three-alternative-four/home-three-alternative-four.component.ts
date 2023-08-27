import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { Octree } from 'three/examples/jsm/math/Octree'
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { MeshBVH, MeshBVHVisualizer, StaticGeometryGenerator } from 'three-mesh-bvh'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Observable, Subscription, tap } from 'rxjs';
import { IElementDimensions } from '../../interface/IElementDimensions';


@Component({
  selector: 'app-home-three-alternative-four',
  templateUrl: './home-three-alternative-four.component.html',
  styleUrls: ['./home-three-alternative-four.component.css'],

})
export class HomeThreeAlternativeFourComponent implements OnInit, OnDestroy {

  constructor(
    private sideNavService: SideNavService,
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;
  }

  sizes!: { height: number, width: number };

  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer
  canvas!: HTMLCanvasElement
  scene: any
  controls!: OrbitControls;

  playerVelocity: THREE.Vector3 = new THREE.Vector3(0,0,0)
  player!: THREE.Mesh | any;
  playerIsOnGround: boolean = false;



  fwdPressed = false
  bkdPressed = false
  lftPressed = false
  rgtPressed = false
  upVector = new THREE.Vector3(0, 1, 0);
  tempVector = new THREE.Vector3();
  tempVector2 = new THREE.Vector3();
  tempBox = new THREE.Box3();
  tempMat = new THREE.Matrix4();
  tempSegment = new THREE.Line3();


  guiParams = {
    firstPerson: false,
    displayCollider: false,
    displayBVH: false,
    visualizeDepth: 10,
    gravity: - 30,
    playerSpeed: 10,
    physicsSteps: 5,
    reset: this.reset,
  };

  environment: any
  collider: any
  visualizer: any

  clock: any
  gui: any


  mouseArrowHelper!: THREE.ArrowHelper;
  mouseRayCaster: THREE.Raycaster = new THREE.Raycaster();

  animateScreenResize!: Observable<IElementDimensions>;
  subscription!: Subscription;
  mouse: THREE.Vector2 = new THREE.Vector2();


  animate!: (() => {}) | any;
  keyboardUpEvent: (() => {}) | any;
  keyboardDownEvent: (() => {}) | any;
  requestId!: number;

  @HostListener('unloaded')
  ngOnDestroy(): void { }

  ngOnInit(): void {

    const bgColor = 0x263238 / 2;

    // renderer setup
    this.canvas = document.querySelector('.HomeWebgl')!;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(bgColor, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(bgColor, 20, 70);

    // lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1.5, 1).multiplyScalar(50);
    light.shadow.mapSize.setScalar(2048);
    light.shadow.bias = - 1e-4;
    light.shadow.normalBias = 0.05;
    light.castShadow = true;

    const shadowCam = light.shadow.camera;
    shadowCam.bottom = shadowCam.left = - 30;
    shadowCam.top = 30;
    shadowCam.right = 45;

    this.scene.add(light);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.4));

    // camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    this.camera.position.set(10, 10, - 10);
    this.camera.far = 100;
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // #region MousePointer
    this.mouseArrowHelper = new THREE.ArrowHelper(this.mouseRayCaster.ray.direction, this.mouseRayCaster.ray.origin, 1, 0xff0000)
    this.scene.add(this.mouseArrowHelper);
    // #endregion

    // character
    this.player = new THREE.Mesh(
      new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
      new THREE.MeshStandardMaterial()
    );
    this.player.geometry.translate(0, - 0.5, 0);
    this.player.capsuleInfo = {
      radius: 0.5,
      segment: new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, - 1.0, 0.0))
    };
    this.player.castShadow = true;
    this.player.receiveShadow = true;
    this.player.material.shadowSide = 2;
    this.scene.add(this.player);
    this.reset();

    // #region DAT GUI
    this.gui = new GUI();
    this.gui.add(this.guiParams, 'firstPerson').onChange((v:any) => {
      if (!v) {
        this.camera
          .position
          .sub(this.controls.target)
          .normalize()
          .multiplyScalar(10)
          .add(this.controls.target);
      }
    });
    const visFolder = this.gui.addFolder('Visualization');
    visFolder.add(this.guiParams, 'displayCollider');
    visFolder.add(this.guiParams, 'displayBVH');
    visFolder.add(this.guiParams, 'visualizeDepth', 1, 20, 1).onChange((v:any) => {
      this.visualizer.depth = v;
      this.visualizer.update();
    });
    visFolder.open();

    const physicsFolder = this.gui.addFolder('Player');
    physicsFolder.add(this.guiParams, 'physicsSteps', 0, 30, 1);
    physicsFolder.add(this.guiParams, 'gravity', - 100, 100, 0.01).onChange((v:any) => {
      this.guiParams.gravity = parseFloat(v);
    });
    physicsFolder.add(this.guiParams, 'playerSpeed', 1, 20);
    physicsFolder.open();
    this.gui.add(this.guiParams, 'reset');
    this.gui.open();
    // #endregion


    this.loadColliderEnvironment();
    this.defineEvents();
  }

  reset() {
    this.playerVelocity.set(0, 0, 0);
    this.player.position.set(15.75, - 3, 30);
    this.camera.position.sub(this.controls.target);
    this.controls.target.copy(this.player.position);
    this.camera.position.add(this.player.position);
    this.controls.update();
  }

  updatePlayer(delta: any) {

    if (this.playerIsOnGround) {
      this.playerVelocity.y = delta * this.guiParams.gravity;
    } else {
      this.playerVelocity.y += delta * this.guiParams.gravity;
    }
    this.player.position.addScaledVector(this.playerVelocity, delta);

    // move the player
    const angle = this.controls.getAzimuthalAngle();
    if (this.fwdPressed) {
      this.tempVector.set(0, 0, - 1).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(this.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.bkdPressed) {
      this.tempVector.set(0, 0, 1).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(this.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.lftPressed) {
      this.tempVector.set(- 1, 0, 0).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(this.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.rgtPressed) {
      this.tempVector.set(1, 0, 0).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(this.tempVector, this.guiParams.playerSpeed * delta);
    }
    this.player.updateMatrixWorld();

    // adjust player position based on collisions
    const capsuleInfo = this.player.capsuleInfo;
    this.tempBox.makeEmpty();
    this.tempMat.copy(this.collider.matrixWorld).invert();
    this.tempSegment.copy(capsuleInfo.segment);

    // get the position of the capsule in the local space of the collider
    this.tempSegment.start.applyMatrix4(this.player.matrixWorld).applyMatrix4(this.tempMat);
    this.tempSegment.end.applyMatrix4(this.player.matrixWorld).applyMatrix4(this.tempMat);

    // get the axis aligned bounding box of the capsule
    this.tempBox.expandByPoint(this.tempSegment.start);
    this.tempBox.expandByPoint(this.tempSegment.end);
    this.tempBox.min.addScalar(- capsuleInfo.radius);
    this.tempBox.max.addScalar(capsuleInfo.radius);

    this.collider.geometry.boundsTree.shapecast({
      intersectsBounds: (box: any) => box.intersectsBox(this.tempBox),
      intersectsTriangle: (tri: any) => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = this.tempVector;
        const capsulePoint = this.tempVector2;
        const distance = tri.closestPointToSegment(this.tempSegment, triPoint, capsulePoint);

        if (distance < capsuleInfo.radius) {
          const depth = capsuleInfo.radius - distance;
          const direction = capsulePoint.sub(triPoint).normalize();
          this.tempSegment.start.addScaledVector(direction, depth);
          this.tempSegment.end.addScaledVector(direction, depth);
        }
      }
    });

    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = this.tempVector;
    newPosition.copy(this.tempSegment.start).applyMatrix4(this.collider.matrixWorld);
    
    // check how much the collider was moved
    const deltaVector = this.tempVector2;
    deltaVector.subVectors(newPosition, this.player.position);
    
    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    this.playerIsOnGround = deltaVector.y > Math.abs(delta * this.playerVelocity.y * 0.25);
    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);

    // adjust the player model
    this.player.position.add(deltaVector);

    if (!this.playerIsOnGround) {
      deltaVector.normalize();
      this.playerVelocity.addScaledVector(deltaVector, - deltaVector.dot(this.playerVelocity));
    } else {
      this.playerVelocity.set(0, 0, 0);
    }

    // adjust the camera
    this.camera.position.sub(this.controls.target);
    this.controls.target.copy(this.player.position);
    this.camera.position.add(this.player.position);

    // if the player has fallen too far below the level reset their position to the start
    if (this.player.position.y < - 50) {
      this.reset();
    }
  }

  loadColliderEnvironment() {
    const dracroLoader = new DRACOLoader();
    dracroLoader.setDecoderPath('../../../../../assets/draco/')
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracroLoader);

    gltfLoader.load('../../../../../assets/models/AltTower.glb', (gltf) => {

      // Scale and position
      const gltfScene = gltf.scene;
      gltfScene.scale.setScalar(100);
      gltfScene.position.set(0, -35, -50)

      const box = new THREE.Box3();
      box.setFromObject(gltfScene);
      box.getCenter(gltfScene.position).negate();
      gltfScene.updateMatrixWorld(true);

      // visual geometry setup
      this.environment = new THREE.Group();
      this.environment.add(gltfScene)

      const staticGenerator = new StaticGeometryGenerator(this.environment);
      staticGenerator.attributes = ['position'];

      const mergedGeometry = staticGenerator.generate();
      mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
      this.collider = new THREE.Mesh(mergedGeometry);

      this.visualizer = new MeshBVHVisualizer(this.collider, this.guiParams.visualizeDepth);
      this.scene.add(this.visualizer);
      this.scene.add(this.collider);
      this.scene.add(this.environment);
    });

  }

  defineEvents() {
    /* <---------------------- ANIMATE FUNCTION ----------------------> */
    this.clock = new THREE.Clock();
    this.animate = () => {
      this.requestId = window.requestAnimationFrame(this.animate);
      const delta = Math.min(this.clock.getDelta(), 0.1);
      if (this.guiParams.firstPerson) {
        this.controls.maxPolarAngle = Math.PI;
        this.controls.minDistance = 1e-4;
        this.controls.maxDistance = 1e-4;
      } else {
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 20;
      }

      if (this.collider) {
        this.collider.visible = this.guiParams.displayCollider;
        this.visualizer.visible = this.guiParams.displayBVH;
        const physicsSteps = this.guiParams.physicsSteps;
        for (let i = 0; i < physicsSteps; i++) {
          this.updatePlayer(delta / physicsSteps);
        }
      }

      // Moving Mouse Pointer Arrow And Ray
      this.mouseRayCaster.setFromCamera(this.mouse, this.camera);
      this.mouseArrowHelper.setDirection(this.mouseRayCaster.ray.direction);
      this.mouseArrowHelper.position.set(
        this.mouseRayCaster.ray.origin.x,
        this.mouseRayCaster.ray.origin.y,
        this.mouseRayCaster.ray.origin.z
      )
      // TODO: limit the camera movement based on the collider
      // raycast in direction of camera and move it if it's further than the closest point

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
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

    /* <---------------------- KEYBOARD PRESS EVENT ----------------------> */
    this.keyboardDownEvent = (event: any) => {
      switch (event.code) {
        case 'KeyW': this.fwdPressed = true; break;
        case 'KeyS': this.bkdPressed = true; break;
        case 'KeyD': this.rgtPressed = true; break;
        case 'KeyA': this.lftPressed = true; break;
        case 'Space':
          if (this.playerIsOnGround) {
            this.playerVelocity.y = 10.0;
            this.playerIsOnGround = false;
          }
          break;
      }
    }
    this.keyboardUpEvent = (event: any) => {
      switch (event.code) {
        case 'KeyW': this.fwdPressed = false; break;
        case 'KeyS': this.bkdPressed = false; break;
        case 'KeyD': this.rgtPressed = false; break;
        case 'KeyA': this.lftPressed = false; break;
      };
    }
    document.addEventListener('keydown', this.keyboardDownEvent, false);
    document.addEventListener('keyup', this.keyboardUpEvent, false);
  }
}

