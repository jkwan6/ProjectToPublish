import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { ThreeJsService } from '../../service/ThreeJsService/ThreeJsService';
import { HomeThreeBase } from './home-three.helper';


@Component({
  selector: 'app-home-three-alternative',
  templateUrl: './home-three-alternative.component.html',
  styleUrls: ['./home-three-alternative.component.css']
})


export class HomeThreeAlternativeComponent extends HomeThreeBase implements AfterViewInit, OnDestroy {

  player!: THREE.Group;
  movingForward!: boolean;
  mousedown!: boolean;
  container!: THREE.Group;
  tempCameraVector!: THREE.Vector3 | any;
  tempModelVector!: THREE.Vector3 | any;
  xAxis!: THREE.Vector3;

  constructor(
    sideNavService: SideNavService
  ) {
    super(sideNavService);

    this.xAxis = new THREE.Vector3(1, 0, 0);
    this.cameraOrigin = new THREE.Vector3(0, 1.5, 0);
    this.tempCameraVector = new THREE.Vector3(0, 0, 0);
    this.tempModelVector = new THREE.Vector3(0, 0, 0);
    this.movingForward = false;
    this.mousedown = false;



    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;

    this.aspectRatio = this.sizes.width / this.sizes.height;
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId);
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    let canvas: HTMLCanvasElement = document.querySelector('.HomeWebgl')!;
    this.threeJsSetup(canvas);
    this.floorSetup();
    this.playerSetup();
    this.initializeAnimateScreenResizeEvent();
    this.addKeyboardControl();
    this.cameraOrigin.set(this.container.position.x, this.container.position.y, this.container.position.z);
    this.controls.target = this.container.position;
    this.initializeClockAnimationEvent();
  }

  // Material Setup

  playerSetup() {
    this.player = new THREE.Group();
    var bodyGeometry = new THREE.CylinderGeometry(0.5, 0.3, 1.6, 20);
    var headGeometry = new THREE.SphereGeometry(0.3, 20, 15);
    var material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

    var body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 0.8;
    var head = new THREE.Mesh(headGeometry, material);
    head.position.y = 2;
    this.player.add(body, head);


    this.container = new THREE.Group();
    this.container.add(this.camera);
    this.container.add(this.player);

    this.scene.add(this.container);
  }

  // Scene, Camera, Renderer, Controls Setup
  addKeyboardControl() {

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      const { keyCode } = e;
      if (keyCode === 87 || keyCode === 38) {
        //baseActions.idle.weight = 0;
        //baseActions.run.weight = 5;
        //activateAction(baseActions.run.action);
        //activateAction(baseActions.idle.action);
        this.movingForward = true;
      };
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      const { keyCode } = e;
      if (keyCode === 87 || keyCode === 38) {
        //baseActions.idle.weight = 1;
        //baseActions.run.weight = 0;
        //activateAction(baseActions.run.action);
        //activateAction(baseActions.idle.action);
        this.movingForward = false;
      };
    });

    document.addEventListener("pointerdown", (e: PointerEvent) => {
      this.mousedown = true;
    });

    document.addEventListener("pointerup", (e: PointerEvent) => {
      this.mousedown = false;
    });

    document.addEventListener("pointermove", (e: PointerEvent) => {
      if (this.mousedown) {
        const { movementX, movementY } = e;
        const offset = new THREE.Spherical().setFromVector3(
          this.camera.position.clone().sub(this.cameraOrigin)
        );
        const phi = offset.phi - movementY * 0.02;
        offset.theta -= movementX * 0.002;
        offset.phi = Math.max(0.01, Math.min(0.47 * Math.PI, phi));
        this.camera.position.copy(
          this.cameraOrigin.clone().add(new THREE.Vector3().setFromSpherical(offset))
        );
        this.camera.lookAt(this.container.position.clone().add(this.cameraOrigin));
      };
    });
  }


  // Event Setup
  initializeClockAnimationEvent() {

    const clock = new THREE.Clock();

    const tick = () => {

      if (this.movingForward) {
        // Get the X-Z plane in which camera is looking to move the player
        this.camera.getWorldDirection(this.tempCameraVector);
        const cameraDirection = this.tempCameraVector.setY(0).normalize();

        // Get the X-Z plane in which player is looking to compare with camera
        this.player.getWorldDirection(this.tempModelVector);
        const playerDirection = this.tempModelVector.setY(0).normalize();

        // Get the angle to x-axis. z component is used to compare if the angle is clockwise or anticlockwise since angleTo returns a positive value
        const cameraAngle = cameraDirection.angleTo(this.xAxis) * (cameraDirection.z > 0 ? 1 : -1);
        const playerAngle = playerDirection.angleTo(this.xAxis) * (playerDirection.z > 0 ? 1 : -1);

        // Get the angle to rotate the player to face the camera. Clockwise positive
        const angleToRotate = playerAngle - cameraAngle;

        // Get the shortest angle from clockwise angle to ensure the player always rotates the shortest angle
        let sanitisedAngle = angleToRotate;
        if (angleToRotate > Math.PI) {
          sanitisedAngle = angleToRotate - 2 * Math.PI;
        }
        if (angleToRotate < -Math.PI) {
          sanitisedAngle = angleToRotate + 2 * Math.PI;
        }

        // Rotate the model by a tiny value towards the camera direction
        this.player.rotateY(
          Math.max(-0.05, Math.min(sanitisedAngle, 0.05))
        );
        this.container.position.add(cameraDirection.multiplyScalar(0.3));
        this.camera.lookAt(this.container.position.clone().add(this.cameraOrigin));
      }

      const elapsedTime = clock.getDelta();
/*      this.controls.update()*/
      this.renderer.render(this.scene, this.camera);

      //console.log(this.camera.position)
      window.requestAnimationFrame(tick);
    }
    tick();
  }
}

