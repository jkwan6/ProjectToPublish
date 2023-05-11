import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
export class ThreeJsPageComponent implements AfterViewInit {

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

 

  ngAfterViewInit(): void {


    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const doorColorTexture = textureLoader.load('../../../assets/textures/door/color.jpg');
    const doorAlphaTexture = textureLoader.load('../../../assets/textures/door/alpha.jpg');
    const doorAmbientOcclusionTexture = textureLoader.load('../../../assets/textures/door/ambientOcclusion.jpg');
    const doorHeightTexture = textureLoader.load('../../../assets/textures/door/height.jpg');
    const doorNormalTexture = textureLoader.load('../../../assets/textures/door/normal.jpg');
    const doorMetalnessTexture = textureLoader.load('../../../assets/textures/door/metalness.jpg');
    const doorRoughnessTexture = textureLoader.load('../../../assets/textures/door/roughness.jpg');
    const matCapMaterial = textureLoader.load('../../../assets/textures/matcaps/1.png');
    const gradientTexture = textureLoader.load('../../../assets/textures/gradients/3.jpg');


    // INITIAL DIV SETUP
    let sizes = {
      width: this.divElement.nativeElement.offsetWidth,
      height: this.divElement.nativeElement.offsetHeight,
    };
    let aspectRatio = sizes.width / sizes.height;

    // SCENE SETUP
    this.scene = new THREE.Scene();
    this.axesHelper = new THREE.AxesHelper(3);
    this.scene.add(this.axesHelper);

    //var textGeometry:TextGeometry;
    // Font
    //const fontLoader = new FontLoader();
    //fontLoader.load(
    //  '../../../assets/fonts/helvetiker_regular.typeface.json',
    //  ( font ) => {
    //    textGeometry = new TextGeometry(
    //      'text',
    //      {
    //        font,
    //        size: 0.5,
    //        height: 0.2,
    //        curveSegments: 1,
    //        bevelEnabled: true,
    //        bevelThickness:0.03,
    //        bevelSize: 0.02,
    //        bevelOffset: 0,
    //        bevelSegments:1
    //      }
    //    )

    //    //textGeometry.computeBoundingBox();
    //    //textGeometry.translate(
    //    //  - textGeometry.boundingBox!.max.x * 0.5,
    //    //  - textGeometry.boundingBox!.max.y * 0.5,
    //    //  - textGeometry.boundingBox!.max.z * 0.5
    //    //)

    //    textGeometry.center();

    //    console.log(textGeometry.boundingBox)

    //    const textMaterial = new THREE.MeshMatcapMaterial();
    //    textMaterial.matcap = matCapMaterial;
    //    //textMaterial.wireframe = true;
    //    const text = new THREE.Mesh(textGeometry, textMaterial);
    //    this.scene.add(text);

    //  }
    //)



    // Mesh Geometry Setup
    //const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
    //material.wireframe = true;
    //material.opacity = 0.5;
    //material.transparent = true;
    //material.side = THREE.DoubleSide
    //material.alphaMap = (doorAlphaTexture);

    //const material = new THREE.MeshNormalMaterial();
    //material.wireframe = true;
    //material.flatShading = true;

    //const material = new THREE.MeshMatcapMaterial();
    //material.matcap = matCapTexture;

    /*const material = new THREE.MeshDepthMaterial();*/

    //const cubeTextureLoader = new THREE.CubeTextureLoader();
    //const environmentMapTexture = cubeTextureLoader.load([
    //  '../../../assets/textures/environmentMaps/2/px.jpg',
    //  '../../../assets/textures/environmentMaps/2/nx.jpg',
    //  '../../../assets/textures/environmentMaps/2/py.jpg',
    //  '../../../assets/textures/environmentMaps/2/ny.jpg',
    //  '../../../assets/textures/environmentMaps/2/pz.jpg',
    //  '../../../assets/textures/environmentMaps/2/nz.jpg',
    //]
    //)


    // MATERIALS
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    //material.envMap = environmentMapTexture;
    //material.map = doorColorTexture;
    //material.aoMap = doorAmbientOcclusionTexture;
    //material.aoMapIntensity = 1;
    //material.displacementMap = doorHeightTexture;
    //material.displacementScale = 0.05;
    //material.normalMap = doorNormalTexture;
    //material.normalScale.set(1, 1)
    //material.alphaMap = doorAlphaTexture;
    //material.transparent = true;

    // GEOMETRY
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material
    );
    sphere.position.x = -1.5;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 100, 100),
      material
    );

    console.log(plane.geometry.getAttribute("uv").array);

    plane.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(plane.geometry.getAttribute("uv").array, 2)
    );

    const taurus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 122),
      material
    )
    taurus.position.x = 1.5;

    taurus.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(plane.geometry.getAttribute("uv").array, 2)
    );


    this.scene.add(sphere, plane, taurus);

    // LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    //this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionalLight.position.set(0.1, 0, 0)
    //this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff);
    //this.scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xff9000, 1)
  //this.scene.add(pointLight);

    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,1,3,1);
    this.scene.add(rectAreaLight);
    rectAreaLight.position.set(1, 1, 2)
    rectAreaLight.lookAt(plane.position)
    //const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    //this.scene.add(ambientLight);

    //const pointLight = new THREE.PointLight(0xffffff, 0.5);
    //pointLight.position.x = 2;
    //pointLight.position.y = 3;
    //pointLight.position.z = 4;

    //this.scene.add(pointLight)

    // CAMERA SETUP
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    // RENDERER
    const canvas = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });

    // CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0);
    this.controls.update();


    // DAT GUI
    const gui = new dat.GUI();
    gui.add(material.normalScale, 'x').min(0).max(10).step(1)
    gui.add(material.normalScale, 'y').min(0).max(10).step(1)
    gui.add(material, 'metalness').min(0).max(1).step(0.1)
    gui.add(material, 'roughness').min(0).max(1).step(0.1)
    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.5)
    gui.add(material, 'displacementScale').min(0).max(1).step(0.01)
    gui.add(ambientLight, "intensity").min(0).max(3).step(0.2);
    gui.add(directionalLight, "intensity").min(0).max(3).step(0.2)
    gui.add(hemisphereLight,"intensity").min(0).max(3).step(0.2)
    gui.add(pointLight, "intensity").min(0).max(10).step(0.5)
    gui.add(pointLight, "distance").min(0).max(10).step(0.5)
    gui.add(pointLight, "decay").min(0).max(10).step(0.5)

    // Finalize Initial View
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);

    // Animation
    /*    animate(this.renderer, this.scene, this.camera);*/
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotations
      //sphere.rotation.y = 0.1 * elapsedTime;
      //plane.rotation.y = 0.1 * elapsedTime;
      //taurus.rotation.y = 0.1 * elapsedTime;

      //sphere.rotation.x = 0.15 * elapsedTime;
      //plane.rotation.x = 0.15 * elapsedTime;
      //taurus.rotation.x = 0.15 * elapsedTime;


      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(tick);
    }

    tick();

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
      this.renderer.render(this.scene, this.camera);
    }, false);



    //function animate(
    //  renderer: THREE.WebGLRenderer,
    //  scene: THREE.Scene,
    //  camera: THREE.PerspectiveCamera
    //): void {
    //  requestAnimationFrame(() => animate(renderer, scene, camera))
    //  const elapsedTime = new THREE.Clock().getElapsedTime();
    //  taurus.rotation.y = 0.1 * elapsedTime;

    ////this.box!.rotation.y += 0.010;
    ////this.box!.rotation.x += 0.01;
    //  renderer.render(scene, camera);
    //}


  }


}
