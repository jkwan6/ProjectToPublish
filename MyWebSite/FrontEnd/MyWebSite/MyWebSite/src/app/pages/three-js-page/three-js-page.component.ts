import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { AxesHelper } from 'three';


@Component({
  selector: 'app-three-js-page',
  templateUrl: './three-js-page.component.html',
  styleUrls: ['./three-js-page.component.css']
})
export class ThreeJsPageComponent implements OnInit {

  // Properties
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshBasicMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  axesHelper!: THREE.AxesHelper;

  constructor() { }

  ngOnInit(): void {

    this.scene = new THREE.Scene();
    this.axesHelper = new THREE.AxesHelper(3);

    // Red Cube
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xFF5733 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //this.mesh.position.y = 1;
    this.scene.add(this.mesh);
    this.scene.add(this.axesHelper);

    // Sizes
    const sizes = {
      width: 800,
      height: 600
    };

    // Camera(Vertical FOV, Aspect Ratio,)
    this.camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
    this.camera.position.x = 1;
    this.camera.position.y = 1;
    this.camera.position.z = 3;

    this.scene.add(this.camera);

    // Renderer
    const canvas = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);
  }
}
