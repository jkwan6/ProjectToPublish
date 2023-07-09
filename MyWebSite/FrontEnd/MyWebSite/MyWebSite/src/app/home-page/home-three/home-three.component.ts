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
import { MaterialSetup } from './MaterialSetup';

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
  // #endregion

  constructor(
    private sideNavService: SideNavService,
    private threeJsService: ThreeJsService
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 700;
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
    this.materialSetup();

    this.initializeEvents();
    this.animateControls();
    this.animateScreenResize.subscribe();
  }

  // Scene, Camera, Renderer, Controls Setup
  threeJsSetup() {
    var position = { x: 0, y: 3, z: 50 };
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
    this.controls.target.set(0, 0, 0);
    this.controls.enablePan = false;
    this.controls.maxDistance = 2;
    this.controls.minDistance = 2;
    this.controls.maxPolarAngle = Math.PI/2.08; // radians
    this.controls.update();
  }

  // Material Setup
  materialSetup() {

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)

    const position = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    // Particles Position And Color
    for (let i = 0; i < particlesCount * 3; i++) {
      position[i] = (Math.random() - 0.5) * 10
      colors[i] = Math.random()
    }

    // Assigning Color and Position to Particles
    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(particles);
    // #endregion
  }

  // Event Setup
  initializeEvents() {
    this.animateControls = () => {
      this.controls.update();
      this.renderer!.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(this.animateControls);
    }

    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes = {
        width: results.width * 0.9,   // Width
        height: 700,            // Height - Edit --> Constant
      };
      this.aspectRatio = this.sizes.width / this.sizes.height;
      this.camera!.aspect = this.aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
  }
}
