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

  // #region PROPERTIES

  // #endregion

  constructor(
    sideNavService: SideNavService,
    threeJsService: ThreeJsService
  ) {
    super(sideNavService, threeJsService);
  }


  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId)
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }

  ngAfterViewInit(): void {
    this.movingForward = false;
    this.mousedown = false;
    this.threeJsSetup();
    this.floorSetup();
    this.playerSetup();
    this.initializeAnimateScreenResizeEvent();
    this.animateScreenResize.subscribe();
    this.addKeyboardControl();
    this.cameraOrigin.set(this.player.position.x, this.player.position.y, this.player.position.z );
    this.initializeClockAnimationEvent()
  }

  // Material Setup

  playerSetup() {
    // Player Charachter
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

    this.scene.add(this.container)

    //this.controls.target = this.player.position;
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
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      const { keyCode } = e;
      if (keyCode === 87 || keyCode === 38) {
        //baseActions.idle.weight = 1;
        //baseActions.run.weight = 0;
        //activateAction(baseActions.run.action);
        //activateAction(baseActions.idle.action);
        this.movingForward = false;
      }
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
      }
    });
  }


  // Event Setup
  initializeClockAnimationEvent() {

    const clock = new THREE.Clock()

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
          sanitisedAngle = angleToRotate - 2 * Math.PI
        }
        if (angleToRotate < -Math.PI) {
          sanitisedAngle = angleToRotate + 2 * Math.PI
        }

        // Rotate the model by a tiny value towards the camera direction
        this.player.rotateY(
          Math.max(-0.05, Math.min(sanitisedAngle, 0.05))
        );
        this.container.position.add(cameraDirection.multiplyScalar(0.3));
        this.camera.lookAt(this.container.position.clone().add(this.cameraOrigin));
      }

      const elapsedTime = clock.getDelta()
/*      this.controls.update()*/
      this.renderer.render(this.scene, this.camera)


      //if (this.player.userData !== undefined && this.player.userData['move'] !== undefined) {
      //  this.player.translateZ(this.player.userData['move'].forward * elapsedTime * 10);
      //  this.player.rotateY(this.player.userData['move'].turn * elapsedTime);
      //}

      //const pos = this.player.position.clone();
      //pos.y += 5;
      //this.cameras[0].lookAt(pos);

      //console.log(this.camera.position)
      window.requestAnimationFrame(tick)
    }
    tick();
  }
}

