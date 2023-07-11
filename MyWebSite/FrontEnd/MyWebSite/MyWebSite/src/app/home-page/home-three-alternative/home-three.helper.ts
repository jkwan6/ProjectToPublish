import { Observable, tap } from "rxjs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IElementDimensions } from "../../interface/IElementDimensions";
import * as dat from 'lil-gui';
import { SideNavService } from "../../service/SideNavService/SideNavService";
import { ThreeJsService } from "../../service/ThreeJsService/ThreeJsService";
import { Directive } from "@angular/core";
import { cameraType, ICameraInitialize } from "../../interface/ThreeJs/ICameraInitialize";
import * as THREE from "three";


export class HomeThreeBase {
  requestId!: number;
  sizes!: IElementDimensions;
  aspectRatio!: number;
  scene!: THREE.Scene;
  geometry!: THREE.BufferGeometry;
  material!: THREE.PointsMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer | any;
  axesHelper!: THREE.AxesHelper;
  texture!: THREE.Texture;
  controls!: OrbitControls;
  textureLoader!: THREE.TextureLoader;
  animateControls!: (() => {}) | any;
  animateScreenResize!: Observable<IElementDimensions>;
  player!: THREE.Group;
  cameras!: any;
  gui!: dat.GUI;
  // DI Injection


  movingForward!: boolean;
  mousedown!: boolean;
  cameraOrigin!: THREE.Vector3;
  container!: THREE.Group;
  tempCameraVector!: THREE.Vector3 | any;
  tempModelVector!: THREE.Vector3 | any;
  xAxis!: THREE.Vector3;
  model!: THREE.Object3D;

  constructor(
    protected sideNavService: SideNavService,
    protected threeJsService: ThreeJsService
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;
    this.aspectRatio = this.sizes.width / this.sizes.height;
  }

  threeJsSetup() {
    var position = { x: 0, y: 20, z: 150 };
    var aspectRatio = this.aspectRatio;
    var fieldOfView = 75;
    const cameraInitialValues: ICameraInitialize =
      { position, aspectRatio, fieldOfView, cameraType: cameraType.PerspectiveCamera }
    let canvas: HTMLCanvasElement = document.querySelector('.HomeWebgl')!;

    // Wire Them Up
    this.scene = this.threeJsService.initializeScene();




    // Camera and controls
    this.xAxis = new THREE.Vector3(1, 0, 0);
    this.tempCameraVector = new THREE.Vector3(0, 0, 0);
    this.tempModelVector = new THREE.Vector3(0, 0, 0);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.camera.position.set(position.x, position.y, position.z);
    this.cameraOrigin = new THREE.Vector3(0, 1.5, 0);
    this.camera.lookAt(this.cameraOrigin);




    //this.camera = this.threeJsService.initializePerspectiveCamera(this.camera, cameraInitialValues);
    this.renderer = this.threeJsService.initializeWebGlRenderer(canvas!, this.sizes);
    this.scene.add(this.camera);
    this.renderer.render(this.scene, this.camera);





    //// CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    /*    this.controls.target.set(0, 0, 0);*/
    this.controls.enablePan = false;
    this.controls.maxDistance = 20;
    this.controls.minDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2.08; // radians
    this.controls.update();
  }


  initializeAnimateScreenResizeEvent() {
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes = {
        width: results.width * 0.925,     // Width
        height: 600,                      // Height - Edit --> Constant
      };
      this.aspectRatio = this.sizes.width / this.sizes.height;
      this.camera!.aspect = this.aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
  }
  // Material Setup
  floorSetup() {

    const axis = new THREE.AxesHelper(3);
    this.scene.add(axis)
    // #region PARTICLES

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    this.scene.add(floor)
  }

}
