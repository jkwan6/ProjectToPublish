import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { AmbientLight, AxesHelper, Clock, MeshMatcapMaterial, PositionalAudio } from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { SideNavService } from '../../../service/SideNavService/SideNavService';
import { IBodyDimensions } from '../../../interface/IBodyDimensions';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-three-js-page',
  templateUrl: './three-js-page.component.html',
  styleUrls: ['./three-js-page.component.css']
})
export class ThreeJsPageComponent implements AfterViewInit, OnDestroy{
  

  constructor(private sideNavService: SideNavService) {
    this.bodyDims$ = this.sideNavService.getBodyDims;
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId)
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();

/*    this.bodyDims$.unsubscribe();*/
  }

  // PROPERTIES
  requestId: any;
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
  animate! : (() => {}) | any;
  bodyDims$!: BehaviorSubject<IBodyDimensions>;
  @ViewChild('divElement') divElement: any;
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    let sizes: IBodyDimensions = this.bodyDims$.value;
    //this.bodyDims$.subscribe(results => {
    //  sizes = {
    //    width: results.width,
    //    height: results.height,
    //  };
    //  console.log(results)
    //})
    // Initial Setup - Sizes and Scene
    let aspectRatio = sizes.width / sizes.height;
    this.scene = new THREE.Scene();

    // MATERIALS

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

    const position = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    // Particles Position And Color
    for (let i = 0; i < particlesCount * 3; i++) {
      position[i] = (Math.random() - 0.5) * 10
      colors[i] = Math.random()
    }

    // Assigning Color and Position to Particles
    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    this.geometry.setAttribute('color',new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(particles);
    // #endregion


    // CAMERA SETUP
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    // RENDERER
    const canvas = document.querySelector('.webgl1');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);

    // CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // Animation
    this.animate = () => {
      this.controls.update();
      this.renderer!.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(this.animate);
    }
    this.animate();

    this.bodyDims$.subscribe(results => {
      sizes = {
        width: results.width,
        height: results.height,
      };
      aspectRatio = sizes.width / sizes.height;

      this.camera!.aspect = aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(sizes.width, sizes.height);
      this.renderer!.render(this.scene, this.camera);
    })
    // Resize Event Listener
    //window.addEventListener('resize', () => {
    //  var bodyDims = this.bodyDims$.value;
    //  console.log(bodyDims)
    //  let sizes = {
    //    width: bodyDims.width,
    //    height: bodyDims.height,
    //  };
    //  let aspectRatio = sizes.width / sizes.height;

    //  this.camera!.aspect = aspectRatio;
    //  this.camera?.updateProjectionMatrix();
    //  this.renderer!.setSize(sizes.width, sizes.height);
    //  this.renderer!.render(this.scene, this.camera);
    //}, false);

  }
}
