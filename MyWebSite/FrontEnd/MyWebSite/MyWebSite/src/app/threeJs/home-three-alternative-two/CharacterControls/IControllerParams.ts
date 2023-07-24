import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'

export interface IControllerParams {
  model: THREE.Group,
  mixer: THREE.AnimationMixer,
  animationsMap: Map<string, THREE.AnimationAction>,
  orbitControl: OrbitControls,
  camera: THREE.Camera,
  currentAction: string,
  ray: RAPIER.Ray,
  rigidBody: RAPIER.RigidBody,
}
