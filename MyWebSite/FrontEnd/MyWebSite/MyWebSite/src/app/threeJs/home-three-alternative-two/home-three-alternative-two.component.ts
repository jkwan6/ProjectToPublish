import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { CharacterControls } from './CharacterControls';
import * as RAPIER from '@dimforge/rapier3d'
import { RigidBody } from '@dimforge/rapier3d';
import { Ray } from 'cannon-es';
import { RapierPhysicsWorld } from './RapierPhysicsWorld';
import { ThreeJsWorld } from './ThreeJsWorld';
import { WebGLRenderer } from 'three';

export interface IBoxDimensions {
  length: number,
  height: number,
  width: number
}

export enum modelAnimation {
  walk = 'walk',
  run = 'run',
  idle = 'idle',
  TPose = 'TPose'
}

@Component({
  selector: 'app-home-three-alternative-two',
  templateUrl: './home-three-alternative-two.component.html',
  styleUrls: ['./home-three-alternative-two.component.css'],
  providers: [RapierPhysicsWorld, ThreeJsWorld]
})
export class HomeThreeAlternativeTwoComponent implements OnInit, OnDestroy{

  constructor(
    private sideNavService: SideNavService,
    private rapierPhysics: RapierPhysicsWorld,
    private threeJsWorld: ThreeJsWorld
  ) {
    //this.canvas = document.querySelector('.HomeWebgl')!;
    this.sizes = this.sideNavService.getBodyDims.value; this.sizes.height = 500;
    this.scene = this.threeJsWorld.instantiateThreeJsScene();
    this.camera = this.threeJsWorld.instantiateThreeJsCamera(this.sizes.width / this.sizes.height);
  }

  // PROPERTIES
  camera!: THREE.PerspectiveCamera;
  animateScreenResize!: Observable<IElementDimensions>;
  sizes!: IElementDimensions;
  subscription!: Subscription;
  scene!: THREE.Scene;
  canvas!: HTMLCanvasElement;
  world!: RAPIER.World;
  bodies: { rigid: RigidBody, mesh: THREE.Mesh }[] = [];
  animate!: (() => {}) | any;
  requestId!: number;
  renderer!: THREE.WebGLRenderer;
  keyboardUpEvent: (() => {}) | any;
  keyboardDownEvent: (() => {}) | any;

  // DESTROY
  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId);
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.subscription.unsubscribe();
    document.removeEventListener('keyup', this.keyboardUpEvent)
    document.removeEventListener('keydown', this.keyboardDownEvent)
    this.world.free();
  }

  ngOnInit(): void {

    this.world = this.rapierPhysics.instantiatePhysicsWorld();              // Creating Physics World

    var boxPosition = new RAPIER.Vector3(0, 20, 0);                         // Adding Box to Scene
    var box: IBoxDimensions = { length: 4, height: 5, width: 4};
    var boxMesh = this.threeJsWorld.createBoxMesh(box)
    var boxRigidBody = this.rapierPhysics.createRigidBox(box, boxPosition);
    this.bodies.push({ rigid: boxRigidBody, mesh: boxMesh });               // Storing them

    let heights: number[] = [];                                             // Creating Floor
    let scale = new RAPIER.Vector3(50.0, 2, 50.0);
    let nsubdivs = 20;
    this.threeJsWorld.createFloor(scale, nsubdivs, heights);
    this.rapierPhysics.createPhysicsFloor(scale, nsubdivs, heights);

    this.canvas = document.querySelector('.HomeWebgl')!;                    // Canvas & Renderer
    this.renderer = this.threeJsWorld.instantiateThreeJsRenderer(this.canvas, this.sizes);

    const orbitControls = this.threeJsWorld.instantiateThreeJsControls();   // Controls

    this.threeJsWorld.instantiateThreeJsLights();                           // Light

    // Charachter
    let characterControls: CharacterControls
    const gltfLoader = new GLTFLoader();

    gltfLoader
      .load('../../../../../assets/models/XBot/XBot2.glb',
        (gltf) => {
          const characterModel = gltf.scene;
          characterModel.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          characterModel.position.set(0, 3, 0);
          this.scene.add(characterModel);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          const animationMixer = new THREE.AnimationMixer(characterModel);
          const animationsMap: Map<string, THREE.AnimationAction> = new Map()
          gltfAnimations.filter(a => a.name != modelAnimation.TPose).forEach((a: THREE.AnimationClip) => {
            animationsMap.set(a.name, animationMixer.clipAction(a))
          })

          // Rigid Body
          let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-1, 3, 1);
          let characterRigidBody = this.world.createRigidBody(bodyDesc);
          let dynamicCollider = RAPIER.ColliderDesc.cuboid(0.5,1.7,0.5);
          this.world.createCollider(dynamicCollider, characterRigidBody);

          characterControls = new CharacterControls(
            characterModel,
            animationMixer,
            animationsMap,
            orbitControls,
            this.camera,
            modelAnimation.idle,
            new RAPIER.Ray(
              { x: 0, y: 0, z: 0 },
              { x: 0, y: -1, z: 0 }
            ),
            characterRigidBody)
        }
    );


    const mouse = new THREE.Vector2();

    this.canvas!.addEventListener('mousemove', (event: MouseEvent) => {
      var boundingRect = this.canvas.getBoundingClientRect();
      mouse.x = ((event.pageX - boundingRect.left) > 0)
        ? (event.pageX - boundingRect.left)
        : 0
      mouse.y = boundingRect.bottom - event.pageY  /*- (event.layerY / this.sizes.height - 0.5) * 2;*/

      // Normalize
      var length = boundingRect.right - boundingRect.left;
      var height = boundingRect.bottom - boundingRect.top;
      mouse.x = (-1 * (length / 2 - mouse.x)) / length;
      mouse.y = (-1 * (height / 2 - mouse.y)) / height;
    });




    // EVENT LISTENER
    // CONTROL KEYS
    this.keyboardDownEvent = (event: any) => {
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
      }
    }
    this.keyboardUpEvent = (event: any) => {
      (keysPressed as any)[event.key.toLowerCase()] = false
    }

    const keysPressed = {}
    document.addEventListener('keydown', this.keyboardDownEvent, false);
    document.addEventListener('keyup', this.keyboardUpEvent, false);

    const clock = new THREE.Clock();
    // ANIMATE
    this.animate = () => {
      let mixerUpdateDelta = clock.getDelta();
      if (characterControls) {
        characterControls.update(this.world, mixerUpdateDelta, keysPressed);
      }
      orbitControls.update()
      this.renderer.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(this.animate);

      this.world.step();
      this.bodies.forEach(body => {
        let position = body.rigid.translation();
        let rotation = body.rigid.rotation();

        body.mesh.position.x = position.x;
        body.mesh.position.y = position.y;
        body.mesh.position.z = position.z;

        body.mesh.setRotationFromQuaternion(
          new THREE.Quaternion(rotation.x,
            rotation.y,
            rotation.z,
            rotation.w));
      })
    }
    this.animate();

    // RESIZE HANDLER
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 500;                                          // Height

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();
  }

}
