import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { CharacterControls } from './CharacterControls';
import { KeyDisplay } from './utils';

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
  }
  animateScreenResize!: Observable<IElementDimensions>;
  sizes!: IElementDimensions;
  subscription!: Subscription;
  ngOnInit(): void {

    // SCENE
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xa8def0);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 1000);
    camera.position.y = 5;
    camera.position.z = 50;
    camera.position.x = 0;


    let canvas: HTMLCanvasElement = document.querySelector('.HomeWebgl')!;

    // Wire Them Up

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true

    // CONTROLS
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true
    orbitControls.minDistance = 5
    orbitControls.maxDistance = 20
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2.08;
    orbitControls.update();

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight)

    // FLOOR



    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("../../../../../assets/textures/placeholder/placeholder.png");
    const sandBaseColor = textureLoader.load("../../../../../assets/textures/sand/Sand 002_COLOR.jpg");
    const sandNormalMap = textureLoader.load("../../../../../assets/textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("../../../../../assets/textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("../../../../../assets/textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
      {
        map: sandBaseColor, normalMap: sandNormalMap,
        displacementMap: sandHeightMap, displacementScale: 0.1,
        aoMap: sandAmbientOcclusion
      })
    wrapAndRepeatTexture(material.map!)
    wrapAndRepeatTexture(material.normalMap!)
    wrapAndRepeatTexture(material.displacementMap!)
    wrapAndRepeatTexture(material.aoMap!)

    const floor = new THREE.Mesh(geometry, material)
    //const floor = new THREE.Mesh(
    //  new THREE.PlaneGeometry(120, 120),
    //  new THREE.MeshStandardMaterial({
    //    color: '#777777',
    //    metalness: 0.3,
    //    roughness: 0.4,
    //    envMapIntensity: 0.5,
    //    side: THREE.DoubleSide
    //  })
    //)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    scene.add(floor)

    // MODEL WITH ANIMATIONS
    var characterControls: CharacterControls

    const gltfLoader = new GLTFLoader();

    gltfLoader
      .load('../../../../../assets/models/Soldier.glb',
        (gltf) => {
          const model = gltf.scene;
          model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          scene.add(model);
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
    const keyDisplayQueue = new KeyDisplay();
    document.addEventListener('keydown', (event) => {
      keyDisplayQueue.down(event.key)
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
      }
    }, false);
    document.addEventListener('keyup', (event) => {
      keyDisplayQueue.up(event.key);
      (keysPressed as any)[event.key.toLowerCase()] = false
    }, false);




    const clock = new THREE.Clock();
    // ANIMATE
    function animate() {
      let mixerUpdateDelta = clock.getDelta();
      if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
      }
      orbitControls.update()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    //document.body.appendChild(renderer.domElement);
    animate();

    // RESIZE HANDLER

    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 500;                                          // Height

      camera.aspect = this.sizes.width / this.sizes.height;
      camera?.updateProjectionMatrix();
      renderer!.setSize(this.sizes.width, this.sizes.height);
      renderer!.render(scene, camera);
      keyDisplayQueue.updatePosition()
    }))
    this.subscription = this.animateScreenResize.subscribe();

    function wrapAndRepeatTexture(map: THREE.Texture) {
      map.wrapS = map.wrapT = THREE.RepeatWrapping
      map.repeat.x = map.repeat.y = 10
    }
  }

}
