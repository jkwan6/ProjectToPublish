import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { AmbientLight, AxesHelper, Clock, MeshMatcapMaterial, PositionalAudio } from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

@Component({
  selector: 'app-three-js-page',
  templateUrl: './three-js-page.component.html',
  styleUrls: ['./three-js-page.component.css']
})
export class ThreeJsPageComponent implements AfterViewInit, OnDestroy{

  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId)
    this.renderer!.dispose();
    this.material.dispose();
  }

  // PROPERTIES
  requestId: any;
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshStandardMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer | any;
  axesHelper!: THREE.AxesHelper;
  controls!: OrbitControls;
  gui!: dat.GUI;
  textureLoader!: THREE.TextureLoader;
  tick!: (() => {}) | any;

  @ViewChild('divElement') divElement: any;

 

  ngAfterViewInit(): void {

    // #region TEXTURES
    this.textureLoader = new THREE.TextureLoader();
    // #endregion

    // INITIAL DIV SETUP
    let sizes = {
      width: this.divElement.nativeElement.offsetWidth,
      height: this.divElement.nativeElement.offsetHeight,
    };
    let aspectRatio = sizes.width / sizes.height;

    // SCENE SETUP
    this.scene = new THREE.Scene();

    // MATERIALS
    this.material = new THREE.MeshStandardMaterial();
    this.material.metalness = 0.7;
    this.material.roughness = 0.2;

    // PARTICLES
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true
    });
    const count = 20000;

    // #region Particles Setup
    const particlesTexture = this.textureLoader.load('../../../../assets/textures/particles/2.png');
    particleMaterial.alphaMap = particlesTexture;
    particleMaterial.depthWrite = false;
    particleMaterial.blending = THREE.AdditiveBlending;
    particleMaterial.transparent = true;
    particleMaterial.vertexColors = true;

    const position = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Particles Position And Color
    for (let i = 0; i < count * 3; i++) {
      position[i] = (Math.random() - 0.5) * 10
      colors[i] = Math.random()
    }

    // Assigning Color and Position to Particles
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    particleGeometry.setAttribute('color',new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(particles);
    // #endregion


    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionalLight.position.set(0.1, 0, 0)

    // CAMERA SETUP
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    // RENDERER
    const canvas = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });
    // Renderer Setup
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);

    // CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0);
    this.controls.update();



    // Animation
    const clock = new THREE.Clock();
    this.tick = () => {
      this.controls.update();
      this.renderer!.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(this.tick);
    }
    this.tick();


    // Resize Event Listener
    window.addEventListener('resize', () => {
      let sizes = {
        width: this.divElement.nativeElement.offsetWidth,
        height: this.divElement.nativeElement.offsetHeight,
      };
      let aspectRatio = sizes.width / sizes.height;

      this.camera!.aspect = aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(sizes.width, sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }, false);

  }
}
