import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Camera } from 'three';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { cameraType, ICameraInitialize,  } from '../../interface/ThreeJs/ICameraInitialize';



@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class ThreeJsService {
  constructor() {
    var test: ICameraInitialize =
    {
      position : { x: 0, y: 0, z: 0 },
      aspectRatio: 75,
      fieldOfView: 75,
      cameraType: cameraType.PerspectiveCamera
    }
  }

  public initializeScene(): THREE.Scene {
    return new THREE.Scene();
  }

  public initializePerspectiveCamera(
    camera: THREE.PerspectiveCamera,
    cameraInitialValues: ICameraInitialize
  ): THREE.PerspectiveCamera  // Returns THREE.Camera
  {
    camera = new THREE.PerspectiveCamera(
      cameraInitialValues.fieldOfView,
      cameraInitialValues.aspectRatio
    );
    camera.position.x = cameraInitialValues.position.x;
    camera.position.y = cameraInitialValues.position.y;
    camera.position.z = cameraInitialValues.position.z;
    return camera;
  }

  public initializeWebGlRenderer(
    canvas: Element,
    size: IElementDimensions
  ): THREE.WebGLRenderer {
    let renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });
    renderer.setSize(size.width, size.height);
    return renderer;
  }
}
