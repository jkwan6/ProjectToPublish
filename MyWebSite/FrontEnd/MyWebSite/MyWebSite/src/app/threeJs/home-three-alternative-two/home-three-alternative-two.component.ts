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

@Component({
  selector: 'app-home-three-alternative-two',
  templateUrl: './home-three-alternative-two.component.html',
  styleUrls: ['./home-three-alternative-two.component.css']
})
export class HomeThreeAlternativeTwoComponent implements OnInit, OnDestroy{

  constructor(
    private sideNavService: SideNavService,
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 500;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
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
    var gravity = new RAPIER.Vector3(0, -9.81, 0);
    var broadPhase = new RAPIER.BroadPhase();
    this.world = new RAPIER.World(gravity);
    this.world.broadPhase = broadPhase;


    var box = { hx: 0.5, hy: 0.5, hz: 0.5 };

    // ThreeJS
    var boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(box.hx * 2, box.hy * 2, box.hz * 2),
      new THREE.MeshPhongMaterial({ color: 'red' })
    );
    this.scene.add(boxMesh);

    // Rapier3D
    var bodyType = RAPIER.RigidBodyDesc.dynamic();
    var rigidBody = this.world.createRigidBody(bodyType);
    rigidBody.setTranslation(new THREE.Vector3(0, 30, 0), true);
    var colliderType = RAPIER.ColliderDesc.cuboid(box.hx, box.hy, box.hz);
    this.world.createCollider(colliderType, rigidBody);

    // Store Pairs
    this.bodies.push({ rigid: rigidBody, mesh: boxMesh });


    let heights: number[] = [];

    let scale = new RAPIER.Vector3(70.0, 3.0, 70.0);
    let nsubdivs = 20;

    var threeFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(scale.x, scale.z, nsubdivs, nsubdivs),
      new THREE.MeshStandardMaterial({
        color: 'grey'
      })
    );
    threeFloor.rotateX(- Math.PI / 2);
    threeFloor.receiveShadow = true;
    threeFloor.castShadow = true;
    this.scene.add(threeFloor);


    const vertices = threeFloor.geometry.attributes['position'].array;
    const dx = scale.x / nsubdivs;
    const dy = scale.z / nsubdivs;
    // store height data in map column-row map
    const columsRows = new Map();
    for (let i = 0; i < vertices.length; i += 3) {
      // translate into colum / row indices
      let row = Math.floor(Math.abs((vertices as any)[i] + (scale.x / 2)) / dx);
      let column = Math.floor(Math.abs((vertices as any)[i + 1] - (scale.z / 2)) / dy);
      // generate height for this column & row
      const randomHeight = Math.random();
      (vertices as any)[i + 2] = scale.y * randomHeight;
      // store height
      if (!columsRows.get(column)) {
        columsRows.set(column, new Map());
      }
      columsRows.get(column).set(row, randomHeight);
    }
    threeFloor.geometry.computeVertexNormals();
    for (let i = 0; i <= nsubdivs; ++i) {
      for (let j = 0; j <= nsubdivs; ++j) {
        heights.push(columsRows.get(j).get(i));
      }
    }

    let groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
    let groundBody = this.world.createRigidBody(groundBodyDesc);
    let groundCollider = RAPIER.ColliderDesc.heightfield(
      nsubdivs, nsubdivs, new Float32Array(heights), scale
    );
    this.world.createCollider(groundCollider, groundBody);






    //var collisionConfig = new AMMO.default.btDefaultCollisionConfiguration();
    //var dispatcher = new AMMO.default.btCollisionDispatcher(collisionConfig);
    //var broadPhase = new AMMO.default.btDbvtBroadphase();
    //var solver = new AMMO.default.btSequentialImpulseConstraintSolver();
    //var physicsWorld = new AMMO.default.btDiscreteDynamicsWorld(dispatcher, broadPhase as any, solver, collisionConfig);
    //physicsWorld.setGravity(new AMMO.default.btVector3(0, -10, 0));

    this.canvas = document.querySelector('.HomeWebgl')!;
    // CAMERA
    this.camera.position.set(0, 5, 50)

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true

    // CONTROLS
    const orbitControls = new OrbitControls(this.camera, renderer.domElement);
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
/*    this.scene.add(floor)*/

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
          model.position.set(0, 3, 0);
          this.scene.add(model);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          const mixer = new THREE.AnimationMixer(model);
          const animationsMap: Map<string, THREE.AnimationAction> = new Map()
          gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
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
            'Idle',
            new RAPIER.Ray(
              { x: 0, y: 0, z: 0 },
              { x: 0, y: -1, z: 0 }
            ),
            rigidBody)
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


    // EVENT LISTENER
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
