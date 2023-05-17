import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-sub-menu1',
  templateUrl: './sub-menu1.component.html',
  styleUrls: ['./sub-menu1.component.css']
})



export class SubMenu1Component implements AfterViewInit, OnDestroy {

  // PROPERTIES
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshBasicMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  axesHelper!: THREE.AxesHelper;
  controls!: OrbitControls;
  @ViewChild('divElement') divElement: any;

  constructor() { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
  }


  ngAfterViewInit(): void {
    // #region INITIAL DIV SETUP
    let sizes = {
      width: this.divElement.nativeElement.offsetWidth,
      height: this.divElement.nativeElement.offsetHeight,
    };
    let aspectRatio = sizes.width / sizes.height;
    // #endregion

    // #region SCENE SETUP
    this.scene = new THREE.Scene();
    this.axesHelper = new THREE.AxesHelper(3);
    this.scene.add(this.axesHelper);
    // #endregion


    // #region PARAMETERS



    const parameters = {
      materialColor: "#ffedef"

    }


    // #endregion

    // #region OBJECTS

    const objectsDistance = 4;

    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('../../../assets/textures/gradients/3.jpg');

    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture
    });

    gradientTexture.magFilter = THREE.NearestFilter;

    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    )
    mesh1.scale.set(0.5, 0.5, 0.5)
    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      material
    );
    mesh2.scale.set(0.5, 0.5, 0.5)
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );
    mesh3.scale.set(0.5, 0.5, 0.5)

    mesh1.position.y = - objectsDistance * 0;
    mesh2.position.y = - objectsDistance * 1;
    mesh3.position.y = - objectsDistance * 2;




    this.scene.add(mesh1, mesh2, mesh3)

    const sectionMeshes = [mesh1, mesh2, mesh3];


    // #endregion


    // #region LIGHT

    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(1, 1, 0)
    this.scene.add(directionalLight);




    // #endregion

    // #region CAMERA SETUP
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    this.camera.position.z = 3;
    this.scene.add(this.camera);
    // #endregion

    // #region RENDERER
    const canvas = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!,
      alpha: true
    });

    
    // #endregion

    // #region CONTROL SETUP
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    //this.controls.target.set(0, 0, 0);
    //this.controls.update();
    // #endregion

    // #region INITIAL VIEW SETUP
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);
    // #endregion

    // #region DAT GUI
    const gui = new dat.GUI({ width: 360 });

    gui.addColor(parameters, `materialColor`)
      .onChange(() => {
        material.color.set(parameters.materialColor)
        
      })

    // #endregion


    let scrollY = window.scrollY;
    let scrollX = window.scrollX;







    // #region CLOCK & ANIMATION
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      /*      this.controls.update();*/


      // Animate Meshes
      for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.15;
      }


      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(tick);
    }
    tick();
    // #endregion


    // #region RESIZE EVENT LISTENER
    window.addEventListener('resize', () => {
      let sizes = {
        width: this.divElement.nativeElement.offsetWidth,
        height: this.divElement.nativeElement.offsetHeight,
      };
      let aspectRatio = sizes.width / sizes.height;

      console.log('resizing')

      this.camera!.aspect = aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(sizes.width, sizes.height);
      this.renderer.render(this.scene, this.camera);
    }, false);
    // #endregion

  }
}
