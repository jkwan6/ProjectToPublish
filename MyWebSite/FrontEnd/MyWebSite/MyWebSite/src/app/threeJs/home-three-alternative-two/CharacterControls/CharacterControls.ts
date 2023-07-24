import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'
import { CharacterTranslation } from './CharacterControlsDetails/CharacterTranslation'
import { CharacterAnimation } from './CharacterControlsDetails/CharacterAnimation'
import { DIRECTIONS, IControllerParams } from './CharacterControlsDetails/ControllerUtils'
import { CharacterWalkDirection } from './CharacterControlsDetails/CharacterWalkDirection'



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
  characterMovement: CharacterTranslation;
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

    // Constructor Logic
    this.characterMovement = new CharacterTranslation(this.camera, this.currentAction, this.model, this.rigidBody, this.orbitControl)
    this.animation = new CharacterAnimation(this.animationsMap, this.mixer);
    this.characterWalkDirection = new CharacterWalkDirection(this.camera, this.model);
    this.characterMovement.updateCameraTarget(new THREE.Vector3(0, 1, 5))
    this.animationsMap.forEach((value, key) => (key == params.currentAction) ? value.play() : null);
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  public update(world: RAPIER.World, delta: number, keysPressed: any) {
    // Returns True is WASD is pressed
    const directionPressed = Object.values(DIRECTIONS).some(key => keysPressed[key] == true)

    // animation & current action
    var actions = this.animation.previousAndCurrentAction(this.currentAction, directionPressed, this.toggleRun)
    var previousAction = actions[0];
    this.currentAction = actions[1];
    this.animation.animateCharacter(previousAction, this.currentAction, delta);

    // walk direction and velocity
    this.walkDirection = this.characterWalkDirection.calculateWalkDirection(keysPressed, this.currentAction);
    let velocity = this.characterMovement.calculateVelocity(this.currentAction)

    // Get Translation of RigidBody in relation to origin
    const translation = this.rigidBody.translation();

    this.characterMovement.calculateTranslation(
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
