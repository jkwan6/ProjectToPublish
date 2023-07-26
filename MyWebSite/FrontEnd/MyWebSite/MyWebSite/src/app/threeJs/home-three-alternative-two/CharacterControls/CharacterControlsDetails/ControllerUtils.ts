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

export enum DIRECTIONS {
  FORWARD = 'w',
  LEFT = 'a',
  BACKWARD = 's',
  RIGHT = 'd',
  SHIFT = 'shift'
}

export enum SPACEBAR {
  SPACEBAR = " "
}

export enum modelAction {
  walk = 'walk',
  run = 'run',
  idle = 'idle',
  TPose = 'TPose'
}

export class ControllerUtils{

  static previousAndCurrentAction(currentAction: string, directionPressed: boolean, toggleRun: boolean): [previousAction: string, currentAction: string] {
    var previousAction = currentAction;
    var action: string;  // Reset
    if (directionPressed && toggleRun) { action = modelAction.run }
    else if (directionPressed) { action = modelAction.walk }
    else { action = modelAction.idle }
    (currentAction != action) ? currentAction = action : currentAction;
    return [previousAction, currentAction];
  }

  static calculateVelocity(currentAction: string): number {
    let velocity = 0
    let runVelocity = 20;
    let walkVelocity = 5;

    if (currentAction == modelAction.run || currentAction == modelAction.walk) {
      velocity = currentAction == modelAction.run ? runVelocity : walkVelocity
    }
    return velocity
  }
}
