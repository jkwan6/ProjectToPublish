import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'
import { CharacterTranslation } from './CharacterControlsDetails/CharacterTranslation'
import { CharacterAnimation } from './CharacterControlsDetails/CharacterAnimation'
import { ControllerUtils, DIRECTIONS, IControllerParams } from './CharacterControlsDetails/ControllerUtils'
import { CharacterWalkDirection } from './CharacterControlsDetails/CharacterWalkDirection'
import { CharacterCameraUpdate } from './CharacterControlsDetails/CharacterCameraUpdate'

export class CharacterControls {
  // Reference from Parent
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  animationsMap: Map<string, THREE.AnimationAction>;
  orbitControl: OrbitControls;
  camera: THREE.Camera;
  ray: RAPIER.Ray;
  rigidBody: RAPIER.RigidBody;
  currentAction: string

  // Global Variable
  toggleRun: boolean = true
  walkDirection = new THREE.Vector3()

  // Can do an DI with those
  characterWalkDirection: CharacterWalkDirection;
  animation: CharacterAnimation;
  characterTranslation: CharacterTranslation;
  characterCameraUpdate: CharacterCameraUpdate;
  constructor(params: IControllerParams
  ) {
    this.model = params.model
    this.mixer = params.mixer
    this.animationsMap = params.animationsMap
    this.currentAction = params.currentAction
    this.ray = params.ray;
    this.rigidBody = params.rigidBody;
    this.orbitControl = params.orbitControl
    this.camera = params.camera;

    // Constructor Future DI
    this.animation = new CharacterAnimation(this.animationsMap, this.mixer);
    this.characterWalkDirection = new CharacterWalkDirection(this.camera, this.model);
    this.characterCameraUpdate = new CharacterCameraUpdate(this.camera, this.orbitControl)
    this.characterTranslation = new CharacterTranslation(
      this.camera,
      this.currentAction,
      this.model,
      this.rigidBody,
      this.orbitControl)

    // Constructor Logic
    this.animationsMap.forEach((value, key) => (key == params.currentAction) ? value.play() : null);
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  public update(world: RAPIER.World, delta: number, keysPressed: any) {
    // Returns True is WASD is pressed
    const directionPressed = Object.values(DIRECTIONS).some(key => keysPressed[key] == true)

    // animation & current action
    var actions = ControllerUtils.previousAndCurrentAction(this.currentAction, directionPressed, this.toggleRun);
    let velocity = ControllerUtils.calculateVelocity(actions[1])
    var previousAction = actions[0];
    this.currentAction = actions[1];
    this.animation.animateCharacter(previousAction, this.currentAction, delta);

    // walk direction
    this.walkDirection = this.characterWalkDirection.calculateWalkDirection(keysPressed, this.currentAction);

    // Get Translation of RigidBody in relation to origin
    const translation = this.rigidBody.translation();
    var threeTranslate = new THREE.Vector3;
    this.model.getWorldPosition(threeTranslate);
    this.characterCameraUpdate.updateCameraTarget(
      this.model,
      translation
    )

    this.characterTranslation.calculateTranslation(
      this.model,
      translation,
      delta,
      this.ray,
      world,
      velocity,
      keysPressed,
      this.walkDirection)
  }
}
