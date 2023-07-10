import { Component, AfterViewInit, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SideNavService } from '../../../app/service/SideNavService/SideNavService';
import { IElementDimensions } from '../../../app/interface/IElementDimensions';
import { Observable, Subscription, tap } from 'rxjs';
import { ThreeJsService } from './../../../app/service/ThreeJsService/ThreeJsService';
import { cameraType, ICameraInitialize } from '../../interface/ThreeJs/ICameraInitialize';
import { FloatType } from 'three';
import { HomeThreeHelper } from './home-three.helper';

@Component({
  selector: 'app-home-three',
  templateUrl: './home-three.component.html',
  styleUrls: ['./home-three.component.css'],
  providers: [ThreeJsService]
})
export class HomeThreeComponent implements AfterViewInit, OnDestroy {

  // #region PROPERTIES
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
  gui!: dat.GUI;
  textureLoader!: THREE.TextureLoader;
  animateControls!: (() => {}) | any;
  animateScreenResize!: Observable<IElementDimensions>;
  player!: any;
  cameras!: any;
  // #endregion

  constructor(
    private sideNavService: SideNavService,
    private threeJsService: ThreeJsService
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;
    this.aspectRatio = this.sizes.width / this.sizes.height;
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId)
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }

  ngAfterViewInit(): void {
    this.threeJsSetup();
    this.particlesSetup();
    this.playerSetup();
    this.controls.target = this.player.position;
    this.initializeEvents();
    this.animateScreenResize.subscribe();
  }

  // Material Setup
  particlesSetup() {

    const axis = new THREE.AxesHelper(3);
    this.scene.add(axis)
    // #region PARTICLES
    this.textureLoader = new THREE.TextureLoader();
    this.texture = this.textureLoader.load('../../../../assets/textures/particles/2.png');
    this.geometry = new THREE.BufferGeometry();

    this.material = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true
    });
    const particlesCount = 20000;

    // Material setup
    this.material.alphaMap = this.texture;
    this.material.depthWrite = false;
    this.material.blending = THREE.AdditiveBlending;
    this.material.transparent = true;
    this.material.vertexColors = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)

    const position = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    // Particles Position And Color
    for (let i = 0; i < particlesCount * 3; i++) {
      position[i] = (Math.random() - 0.5) * 15
      colors[i] = Math.random()
    }

    // Assigning Color and Position to Particles
    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(particles);
    // #endregion


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

  playerSetup() {
    // Player Charachter
    this.player = new THREE.Group();
    var bodyGeometry = new THREE.CylinderGeometry(0.5, 0.3, 1.6, 20);
    var material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    var body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 0.8;
    body.scale.z = 0.5;
    this.player.add(body);

    var headGeometry = new THREE.SphereGeometry(0.3, 20, 15);
    var head = new THREE.Mesh(headGeometry, material);
    head.position.y = 2;
    this.player.add(head);

    this.scene.add(this.player);

    this.addKeyboardControl();
    this.camera.lookAt(this.player)
    this.cameras = [];
    var cameraIndex = 0;
    var followCam = new THREE.Object3D();
    followCam.position.copy(this.camera.position);
    this.player.add(followCam);
    this.cameras.push(followCam);

  }
  // Scene, Camera, Renderer, Controls Setup
  threeJsSetup() {
    var position = { x: 0, y: 20, z: 100 };
    var aspectRatio = this.aspectRatio;
    var fieldOfView = 75;
    const cameraInitialValues: ICameraInitialize =
      { position, aspectRatio, fieldOfView, cameraType: cameraType.PerspectiveCamera }
    let canvas: HTMLCanvasElement = document.querySelector('.HomeWebgl')!;

    // Wire Them Up
    this.scene = this.threeJsService.initializeScene();
    this.camera = this.threeJsService.initializePerspectiveCamera(this.camera, cameraInitialValues);
    this.renderer = this.threeJsService.initializeWebGlRenderer(canvas!, this.sizes);
    this.scene.add(this.camera);
    this.renderer.render(this.scene, this.camera);

    // CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
/*    this.controls.target.set(0, 0, 0);*/
    this.controls.enablePan = false;
    this.controls.maxDistance = 15;
    this.controls.minDistance = 5;
    this.controls.maxPolarAngle = Math.PI / 2.08; // radians
    this.controls.update();
  }


  addKeyboardControl() {

    document.addEventListener('keydown', (event: KeyboardEvent) => {

      let forward =
        (this.player.userData !== undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].forward
          : 0;
      let turn =
        (this.player.userData != undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].turn
          : 0;

      switch (event.keyCode) {
        case 87://W
          forward = -1;
          break;
        case 83://S
          forward = 1;
          break;
        case 65://A
          turn = 1;
          break;
        case 68://D
          turn = -1;
          break;
      }
      this.playerControl(forward, turn);
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      let forward =
        (this.player.userData !== undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].forward
          : 0;
      let turn =
        (this.player.userData != undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].turn
          : 0;

      switch (event.keyCode) {
        case 87://W
          forward = 0;
          break;
        case 83://S
          forward = 0;
          break;
        case 65://A
          turn = 0;
          break;
        case 68://D
          turn = 0;
          break;
      }
      this.playerControl(forward, turn);
    });
  }

  playerControl(forward:any, turn:any) {
  if (forward == 0 && turn == 0) {
    delete this.player.userData['move'];
  } else {
    if (this.player.userData === undefined) this.player.userData = {};
    this.player.userData['move'] = { forward, turn };
  }
}

  // Event Setup
  initializeEvents() {

    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getDelta()
      this.controls.update()
      this.renderer.render(this.scene, this.camera)


      if (this.player.userData !== undefined && this.player.userData.move !== undefined) {
        this.player.translateZ(this.player.userData.move.forward * elapsedTime * 10);
        this.player.rotateY(this.player.userData.move.turn * elapsedTime);
      }

      const pos = this.player.position.clone();
      pos.y += 5;
      this.cameras[0].lookAt(pos);

      //console.log(this.camera.position)
      window.requestAnimationFrame(tick)
    }
    tick();

    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes = {
        width: results.width * 0.925,   // Width
        height: 600,            // Height - Edit --> Constant
      };
      this.aspectRatio = this.sizes.width / this.sizes.height;
      this.camera!.aspect = this.aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
  }
}
