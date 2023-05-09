import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { AxesHelper, PositionalAudio } from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-three-js-page',
  templateUrl: './three-js-page.component.html',
  styleUrls: ['./three-js-page.component.css']
})
export class ThreeJsPageComponent implements AfterViewInit {

  // Properties
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshBasicMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  axesHelper!: THREE.AxesHelper;

  @ViewChild('divElement') divElement: any;



  ngAfterViewInit(): void {
    this.scene = new THREE.Scene();
    this.axesHelper = new THREE.AxesHelper(3);

    // Red Cube
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xFF5733 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    //this.mesh.rotation.reorder('YXZ');
    this.mesh.rotation.y = 2 * Math.PI / 3;
    this.mesh.rotation.x = 4 * Math.PI / 3;
    this.mesh.scale.x = 2;
    //this.mesh.rotation.reorder('YXZ');
    //this.mesh.position.y = 0;
    this.scene.add(this.mesh);
    this.scene.add(this.axesHelper);

    const gui = new dat.GUI();
    gui.add(this.mesh.position, 'y')
    // Sizes
    let sizes = {
      width: this.divElement.nativeElement.offsetWidth,
      height: this.divElement.nativeElement.offsetHeight,
    };
    let aspectRatio = sizes.width / sizes.height;

    // Camera(Vertical FOV, Aspect Ratio,)
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    //this.camera.position.x = 1;
    //this.camera.position.y = 1;
    this.camera.position.z = 3;
    //this.camera.lookAt(this.mesh.position);
    this.scene.add(this.camera);

    // Renderer
    const canvas = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });

    // Animation

    window.addEventListener('resize', () => {
      let sizes = {
        width: this.divElement.nativeElement.offsetWidth,
        height: this.divElement.nativeElement.offsetHeight,
      };
      let aspectRatio = sizes.width / sizes.height;

      this.camera!.aspect = aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(sizes.width, sizes.height);
      this.renderer.render(this.scene, this.camera);
    }, false);



    this.renderer.setSize(sizes.width, sizes.height);

    this.renderer.render(this.scene, this.camera);
  }



}
