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

export interface IBoxDimensions {
  length: number,
  height: number,
  width: number
}

export enum modelAnimation {
  walk = 'Walk',
  run = 'Run',
  idle = 'Idle',
  TPose = 'TPose'
}

@Component({
  selector: 'app-home-three-alternative-two',
  templateUrl: './home-three-alternative-two.component.html',
  styleUrls: ['./home-three-alternative-two.component.css']
})
export class HomeThreeAlternativeTwoComponent implements OnInit, OnDestroy{

  constructor(
    private sideNavService: SideNavService,
    private rapierPhysics: RapierPhysicsWorld,
    private threeJsWorld: ThreeJsWorld
  ) {
    this.sizes = this.sideNavService.getBodyDims.value; this.sizes.height = 500;
    this.scene = this.threeJsWorld.instantiateThreeJsScene();
    this.camera = this.threeJsWorld.instantiateThreeJsCamera(this.sizes.width / this.sizes.height);
    //this.canvas = document.querySelector('.HomeWebgl')!;
  }

  // PROPERTIES
  camera: THREE.PerspectiveCamera;
  animateScreenResize!: Observable<IElementDimensions>;
  sizes: IElementDimensions;
  subscription!: Subscription;
  scene: THREE.Scene;
  canvas!: HTMLCanvasElement;
  world!: RAPIER.World;
  bodies: { rigid: RigidBody, mesh: THREE.Mesh }[] = [];

  @HostListener('unloaded')
  ngOnDestroy(): void {
    //window.cancelAnimationFrame(this.requestId);
    //this.renderer!.dispose();
    //this.renderer.forceContextLoss();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // Creating World and Adding a Reference to Object
    this.world = this.rapierPhysics.instantiatePhysicsWorld();

    // Box to add
    var boxPosition = new RAPIER.Vector3(0, 20, 0);
    var box: IBoxDimensions = { length: 4, height: 5, width: 4};

    // Create in both ThreeJs and Physics
    var boxMesh = this.threeJsWorld.createBoxMesh(box)
    var boxRigidBody = this.rapierPhysics.createRigidBox(box, boxPosition);

    // Store Pairs
    this.bodies.push({ rigid: boxRigidBody, mesh: boxMesh });

    // Create Floor
    let heights: number[] = [];
    let scale = new RAPIER.Vector3(50.0, 1, 50.0);
    let nsubdivs = 20;
    this.threeJsWorld.createFloor(scale, nsubdivs, heights);
    this.rapierPhysics.createPhysicsFloor(scale, nsubdivs, heights);

    // CANVAS & RENDERER
    this.canvas = document.querySelector('.HomeWebgl')!;
    const renderer = this.threeJsWorld.instantiateThreeJsRenderer(this.canvas, this.sizes);

    // CONTROLS
    const orbitControls = this.threeJsWorld.instantiateThreeJsControls();

    // LIGHTS
    this.threeJsWorld.instantiateThreeJsLights();

    // MODEL WITH ANIMATIONS
    let characterControls: CharacterControls

    const gltfLoader = new GLTFLoader();

    gltfLoader
      .load('../../../../../assets/models/XBot/Soldier.glb',
        (gltf) => {
          const model = gltf.scene;
          model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          console.log(gltf);
          model.position.set(0, 3, 0);
          this.scene.add(model);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          const mixer = new THREE.AnimationMixer(model);
          const animationsMap: Map<string, THREE.AnimationAction> = new Map()
          gltfAnimations.filter(a => a.name != modelAnimation.TPose).forEach((a: THREE.AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
          })

          // Rigid Body
          let bocyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-1, 3, 1);
          let rigidBody = this.world.createRigidBody(bocyDesc);
          let dynamicColliser = RAPIER.ColliderDesc.ball(0.28);
          this.world.createCollider(dynamicColliser, rigidBody);

          characterControls = new CharacterControls(
            model,
            mixer,
            animationsMap,
            orbitControls,
            this.camera,
            modelAnimation.idle,
            new RAPIER.Ray(
              { x: 0, y: 0, z: 0 },
              { x: 0, y: -1, z: 0 }
            ),
            rigidBody)
        }
    );

    // EVENT LISTENER
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
        characterControls.update(this.world, mixerUpdateDelta, keysPressed);
      }
      orbitControls.update()
      renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);

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
    animate();

    // RESIZE HANDLER
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 500;                                          // Height

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera?.updateProjectionMatrix();
      renderer!.setSize(this.sizes.width, this.sizes.height);
      renderer!.render(this.scene, this.camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();
  }

}
