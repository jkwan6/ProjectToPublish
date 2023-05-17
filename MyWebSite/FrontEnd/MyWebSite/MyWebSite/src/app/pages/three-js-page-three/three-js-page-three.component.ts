import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'

@Component({
  selector: 'app-three-js-page-three',
  templateUrl: './three-js-page-three.component.html',
  styleUrls: ['./three-js-page-three.component.css']
})

export class ThreeJsPageThreeComponent implements AfterViewInit {

  // PROPERTIES
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshBasicMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  axesHelper!: THREE.AxesHelper;
  controls!: OrbitControls;
  @ViewChild('divElement') divElement: any;

  constructor() { }
  ngAfterViewInit(): void {

    const test = document.getElementById('test1')
    test!.addEventListener('scroll', () => {
      console.log(test?.scrollTop)

    })
  }

}
