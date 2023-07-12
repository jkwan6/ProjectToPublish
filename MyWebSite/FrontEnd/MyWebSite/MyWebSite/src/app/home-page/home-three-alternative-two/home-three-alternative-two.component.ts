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
    this.sizes.height = 600;
  }
  animateScreenResize!: Observable<IElementDimensions>;
  sizes!: IElementDimensions;
  subscription!: Subscription;
  ngOnInit(): void {

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa8def0);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 1000);
    camera.position.y = 5;
    camera.position.z = 5;
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
    orbitControls.maxDistance = 15
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2.08;
    orbitControls.update();

    // LIGHTS
    light()

    // FLOOR
    generateFloor()

    // MODEL WITH ANIMATIONS
    var characterControls: CharacterControls
    new GLTFLoader().load('../../../../../assets/models/Soldier.glb', function (gltf) {
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
    });

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
      this.sizes.height = 600;                                          // Height

      camera.aspect = this.sizes.width / this.sizes.height;
      camera?.updateProjectionMatrix();
      renderer!.setSize(this.sizes.width, this.sizes.height);
      renderer!.render(scene, camera);
      keyDisplayQueue.updatePosition()
    }))
    this.subscription = this.animateScreenResize.subscribe();


    //function onWindowResize() {
    //  camera.aspect = window.innerWidth / window.innerHeight;
    //  camera.updateProjectionMatrix();
    //  renderer.setSize(window.innerWidth, window.innerHeight);
    //  keyDisplayQueue.updatePosition()
    //}
    //window.addEventListener('resize', onWindowResize);

    function generateFloor() {
      // TEXTURES
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
      // const material = new THREE.MeshPhongMaterial({ map: placeholder})

      const floor = new THREE.Mesh(geometry, material)
      floor.receiveShadow = true
      floor.rotation.x = - Math.PI / 2
      scene.add(floor)
    }

    function wrapAndRepeatTexture(map: THREE.Texture) {
      map.wrapS = map.wrapT = THREE.RepeatWrapping
      map.repeat.x = map.repeat.y = 10
    }

    function light() {
      scene.add(new THREE.AmbientLight(0xffffff, 0.7))

      const dirLight = new THREE.DirectionalLight(0xffffff, 1)
      dirLight.position.set(- 60, 100, - 10);
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 50;
      dirLight.shadow.camera.bottom = - 50;
      dirLight.shadow.camera.left = - 50;
      dirLight.shadow.camera.right = 50;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 200;
      dirLight.shadow.mapSize.width = 4096;
      dirLight.shadow.mapSize.height = 4096;
      scene.add(dirLight);
      // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
    }
  }

}
