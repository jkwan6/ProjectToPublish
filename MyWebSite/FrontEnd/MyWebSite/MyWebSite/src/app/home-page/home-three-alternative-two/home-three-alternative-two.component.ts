import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { CharacterControls } from './CharacterControls';

@Component({
  selector: 'app-home-three-alternative-two',
  templateUrl: './home-three-alternative-two.component.html',
  styleUrls: ['./home-three-alternative-two.component.css']
})
export class HomeThreeAlternativeTwoComponent implements OnInit {

  constructor(
    private sideNavService: SideNavService,
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 500;
    this.scene = new THREE.Scene();
    //this.canvas = document.querySelector('.HomeWebgl')!;
  }

  // PROPERTIES
  animateScreenResize!: Observable<IElementDimensions>;
  sizes: IElementDimensions;
  subscription!: Subscription;
  scene: THREE.Scene;
  canvas!: HTMLCanvasElement;

  ngOnInit(): void {
    this.canvas = document.querySelector('.HomeWebgl')!;
    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
    camera.position.y = 5;
    camera.position.z = 50;
    camera.position.x = 0;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true

    // CONTROLS
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true
    orbitControls.minDistance = 5
    orbitControls.maxDistance = 10
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2.08;
    orbitControls.update();

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight)

    // FLOOR
    const textureLoader = new THREE.TextureLoader();
    const sandBaseColor = textureLoader.load("../../../../../assets/textures/sand/Sand 002_COLOR.jpg");
    const sandNormalMap = textureLoader.load("../../../../../assets/textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("../../../../../assets/textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("../../../../../assets/textures/sand/Sand 002_OCC.jpg");
    const floorWidth = 80
    const floorLength = 80
    const geometry = new THREE.PlaneGeometry(floorWidth, floorLength, 512, 512);
    const material = new THREE.MeshStandardMaterial(
      {
        map: sandBaseColor, normalMap: sandNormalMap,
        displacementMap: sandHeightMap, displacementScale: 0.1,
        aoMap: sandAmbientOcclusion
      })
    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    this.scene.add(floor)

    // MODEL WITH ANIMATIONS
    let characterControls: CharacterControls

    const gltfLoader = new GLTFLoader();

    gltfLoader
      .load('../../../../../assets/models/Soldier.glb',
        (gltf) => {
          const model = gltf.scene;
          model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          this.scene.add(model);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          const mixer = new THREE.AnimationMixer(model);
          const animationsMap: Map<string, THREE.AnimationAction> = new Map()
          gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
          })
          characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle')
        }
    );

    // CONTROL KEYS
    const keysPressed = {}
    document.addEventListener('keydown', (event) => {
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
        console.log(keysPressed)
      }
    }, false);
    document.addEventListener('keyup', (event) => {
      (keysPressed as any)[event.key.toLowerCase()] = false
    }, false);

    const clock = new THREE.Clock();

    // ANIMATE
    const animate = () => {
      let mixerUpdateDelta = clock.getDelta();
      if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
      }
      orbitControls.update()
      renderer.render(this.scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // RESIZE HANDLER
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 500;                                          // Height

      camera.aspect = this.sizes.width / this.sizes.height;
      camera?.updateProjectionMatrix();
      renderer!.setSize(this.sizes.width, this.sizes.height);
      renderer!.render(this.scene, camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();
  }

}
