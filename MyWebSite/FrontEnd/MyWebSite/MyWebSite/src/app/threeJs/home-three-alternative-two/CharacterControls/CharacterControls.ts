import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const W = 'w'
const A = 'a'
const S = 's'
const D = 'd'
const SPACEBAR = " ";
const SHIFT = 'shift'
const DIRECTIONS = [W, A, S, D];
import * as RAPIER from '@dimforge/rapier3d'
import { modelAnimation } from '../home-three-alternative-two.component'
import { CharacterMovement } from './CharacterMovement'
import { CharacterAnimation } from './CharacterAnimation'
import { IControllerParams } from './IControllerParams'



export class CharacterControls {

  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  animationsMap: Map<string, THREE.AnimationAction>;
  orbitControl: OrbitControls;
  camera: THREE.Camera;
  ray: RAPIER.Ray;
  rigidBody: RAPIER.RigidBody;
  currentAction: string

  // Walk/Run
  toggleRun: boolean = true

  // temporary data
  walkDirection = new THREE.Vector3()
  cameraTarget = new THREE.Vector3()

  // constants
  fadeDuration: number = 0.2


  characterMovement!: CharacterMovement;
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
    this.characterMovement = new CharacterMovement(this.camera, this.currentAction, this.model, this.rigidBody, this.orbitControl)

    this.characterMovement.updateCameraTarget(new THREE.Vector3(0, 1, 5))
    this.animationsMap.forEach((value, key) => (key == params.currentAction) ? value.play() : null);
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  public update(world: RAPIER.World, delta: number, keysPressed: any) {

    const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true)

    // #region Start Animation
    var play = '';
    if (directionPressed && this.toggleRun)
    { play = modelAnimation.run }
    else if (directionPressed)
    { play = modelAnimation.walk }
    else
    { play = modelAnimation.idle }


    if (this.currentAction != play) {
      const toPlay = this.animationsMap.get(play)
      const current = this.animationsMap.get(this.currentAction)
      current!.fadeOut(this.fadeDuration)
      toPlay!.reset().fadeIn(this.fadeDuration).play();
      this.currentAction = play
    }

    this.mixer.update(delta)
    // #endregion End Animation

    this.walkDirection = this.characterMovement.calculateWalkDirection(keysPressed, this.currentAction);
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
