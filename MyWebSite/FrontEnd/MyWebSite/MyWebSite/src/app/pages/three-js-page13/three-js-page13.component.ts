import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

@Component({
  selector: 'app-three-js-page13',
  templateUrl: './three-js-page13.component.html',
  styleUrls: ['./three-js-page13.component.css']
})
export class ThreeJsPage13Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
