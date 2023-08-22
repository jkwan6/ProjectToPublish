import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { Octree } from 'three/examples/jsm/math/Octree'
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';


@Component({
  selector: 'app-home-three-alternative-four',
  templateUrl: './home-three-alternative-four.component.html',
  styleUrls: ['./home-three-alternative-four.component.css'],
})
export class HomeThreeAlternativeFourComponent implements OnInit, OnDestroy{

  constructor() {}

  @HostListener('unloaded')
  ngOnDestroy(): void {}

  ngOnInit(): void {
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x88ccee);
    scene.fog = new THREE.Fog(0x88ccee, 0, 50);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.rotation.order = 'YXZ';

    const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
    fillLight1.position.set(2, 1, 1);
    scene.add(fillLight1);

    const container: HTMLCanvasElement = document.querySelector('.HomeWebgl')!; 
    const renderer = new THREE.WebGLRenderer({ canvas: container });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const GRAVITY = 30;
    const STEPS_PER_FRAME = 5;

    const worldOctree = new Octree();
    const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
    const playerVelocity = new THREE.Vector3();
    const playerDirection = new THREE.Vector3();

    let playerOnFloor = false;

    const keyStates : any = {};


    document.addEventListener('keydown', (event) => {
      keyStates[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
      keyStates[event.code] = false;
    });

    // #region Camera Orientation
    container.addEventListener('mousedown', () => {
      document.body.requestPointerLock();
    });
    document.body.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 500;   // Sensitivity
        camera.rotation.x -= event.movementY / 500;   // Sensitivity
      }
    });
    // #endregion

    // #region Resize Event
    window.addEventListener('resize', onWindowResize);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // #endregion

    function playerCollisions() {
      const result = worldOctree.capsuleIntersect(playerCollider);    // If Capsule is intersecting World
      playerOnFloor = false;                                          // Reset playerOnFloor
      console.log(result)
      // If Capsule is intersecting World,
      // Check if Player is on Floor
      // If Player is not on Floor, do this
      // Else, do that
      if (result) {
        playerOnFloor = result.normal.y > 0;
        if (!playerOnFloor) {
          playerVelocity.addScaledVector(result.normal, - result.normal.dot(playerVelocity));
        }
        playerCollider.translate(result.normal.multiplyScalar(result.depth));
      }
    }

    function updatePlayer(deltaTime: any) {
      let damping = Math.exp(- 4 * deltaTime) - 1;
      if (!playerOnFloor) {
        playerVelocity.y -= GRAVITY * deltaTime;
        // small air resistance
        damping *= 0.1;
      }

      playerVelocity.addScaledVector(playerVelocity, damping);
      const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
      playerCollider.translate(deltaPosition);

      playerCollisions();

      camera.position.copy(playerCollider.end);

    }

    function getForwardVector() {
      camera.getWorldDirection(playerDirection);
      playerDirection.y = 0;
      playerDirection.normalize();
      return playerDirection;
    }

    function getSideVector() {
      camera.getWorldDirection(playerDirection);
      playerDirection.y = 0;
      playerDirection.normalize();
      playerDirection.cross(camera.up);
      return playerDirection;
    }

    // #region Controls
    function controls(deltaTime: any) {
      // gives a bit of air control
      const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

      if (keyStates['KeyW']) {
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
      }
      if (keyStates['KeyS']) {
        playerVelocity.add(getForwardVector().multiplyScalar(- speedDelta));
      }
      if (keyStates['KeyA']) {
        playerVelocity.add(getSideVector().multiplyScalar(- speedDelta));
      }
      if (keyStates['KeyD']) {
        playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
      }

      if (playerOnFloor) {
        if (keyStates['Space']) {
          playerVelocity.y = 15;
        }
      }
    }
    // #endregion

    const loader = new GLTFLoader().setPath('../../../../../assets/models/');
    loader.load('collision-world.glb', (gltf) => {
      scene.add(gltf.scene);
      worldOctree.fromGraphNode(gltf.scene);
      gltf.scene.traverse((child:any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.map) {
            child.material.map.anisotropy = 4;
          }
        }
      });
      const helper = new OctreeHelper(worldOctree);
      helper.visible = false;
      scene.add(helper);
      animate();
    });

    function teleportPlayerIfOob() {
      if (camera.position.y <= - 25) {
        playerCollider.start.set(0, 0.35, 0);
        playerCollider.end.set(0, 1, 0);
        playerCollider.radius = 0.35;
        camera.position.copy(playerCollider.end);
        camera.rotation.set(0, 0, 0);
      }
    }


    function animate() {
      const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
      // we look for collisions in substeps to mitigate the risk of
      // an object traversing another too quickly for detection.
      for (let i = 0; i < STEPS_PER_FRAME; i++) {
        controls(deltaTime);
        updatePlayer(deltaTime);
        teleportPlayerIfOob();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }
}
