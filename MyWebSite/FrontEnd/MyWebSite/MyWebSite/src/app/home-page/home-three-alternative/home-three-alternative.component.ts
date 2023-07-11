import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
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
    this.threeJsSetup();
    this.floorSetup();
    this.playerSetup();
    this.initializeClockAnimationEvent();
    this.initializeAnimateScreenResizeEvent();
    this.animateScreenResize.subscribe();
    this.addKeyboardControl();
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
    this.scene.add(this.player);

    this.cameras = [];
    var followCam = new THREE.Object3D();
    followCam.position.copy(this.camera.position);
    this.player.add(followCam);
    this.cameras.push(followCam);

    this.controls.target = this.player.position;
  }
  // Scene, Camera, Renderer, Controls Setup


  addKeyboardControl() {

    document.addEventListener('keydown', (event: KeyboardEvent) => {

      let forward =
        (this.player.userData !== undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].forward
          : 0;
      let turn =
        (this.player.userData != undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].turn
          : 0;

      switch (event.keyCode) {
        case 87://W
          forward = -1;
          break;
        case 83://S
          forward = 1;
          break;
        case 65://A
          turn = 1;
          break;
        case 68://D
          turn = -1;
          break;
      }
      this.playerControl(forward, turn);
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      let forward =
        (this.player.userData !== undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].forward
          : 0;
      let turn =
        (this.player.userData != undefined && this.player.userData['move'] !== undefined)
          ? this.player.userData['move'].turn
          : 0;

      switch (event.keyCode) {
        case 87://W
          forward = 0;
          break;
        case 83://S
          forward = 0;
          break;
        case 65://A
          turn = 0;
          break;
        case 68://D
          turn = 0;
          break;
      }
      this.playerControl(forward, turn);
    });
  }

  playerControl(forward: any, turn: any) {
    if (forward == 0 && turn == 0) {
      delete this.player.userData['move'];
    } else {
      if (this.player.userData === undefined) this.player.userData = {};
      this.player.userData['move'] = { forward, turn };
    }
  }

  // Event Setup
  initializeClockAnimationEvent() {

    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getDelta()
      this.controls.update()
      this.renderer.render(this.scene, this.camera)


      if (this.player.userData !== undefined && this.player.userData['move'] !== undefined) {
        this.player.translateZ(this.player.userData['move'].forward * elapsedTime * 10);
        this.player.rotateY(this.player.userData['move'].turn * elapsedTime);
      }

      const pos = this.player.position.clone();
      pos.y += 5;
      this.cameras[0].lookAt(pos);

      //console.log(this.camera.position)
      window.requestAnimationFrame(tick)
    }
    tick();
  }
}

