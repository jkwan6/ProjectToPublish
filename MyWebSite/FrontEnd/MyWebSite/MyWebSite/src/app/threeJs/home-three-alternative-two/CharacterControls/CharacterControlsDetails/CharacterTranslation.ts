import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SPACEBAR } from './ControllerUtils'
import { GravitySimulation } from './GravitySimulation'

export class CharacterTranslation {

  constructor(
    camera: THREE.Camera,
    model: THREE.Group,
    rigidBody: RAPIER.RigidBody,
    orbitControls: OrbitControls,
    ray: RAPIER.Ray,
    feetCollider: THREE.Raycaster[],
    threeJsEnv: THREE.Group,
    feetRayStepper: THREE.Raycaster[],
    bodyCollider: THREE.Raycaster[]
  ) {
    this.camera = camera;
    this.model = model;
    this.rigidBody = rigidBody;
    this.orbitControl = orbitControls
    this.ray = ray
    this.feetCollider = feetCollider
    this.threeJsEnv = threeJsEnv
    this.feetRayStepper = feetRayStepper
    this.gravitySim = new GravitySimulation(this.rigidBody);
    this.bodyCollider = bodyCollider
  }
  gravitySim: GravitySimulation;
  model: THREE.Group
  camera: THREE.Camera;
  rigidBody: RAPIER.RigidBody;
  ray: RAPIER.Ray;
  orbitControl: OrbitControls;
  feetCollider: THREE.Raycaster[]
  // constants
  gravity = new THREE.Vector3(0, -9.81, 0);
  variableToKnowIfFallingOrNot = 0;
  variableToKnowIfFallingOrNot1 = 0;
  threeJsEnv: THREE.Group
  feetRayStepper: THREE.Raycaster[];
  tempRayPoints: THREE.Vector3[] = [];
  tempRayPoints2: THREE.Vector3[] = [];
  bodyCollider: THREE.Raycaster[];


  calculateTranslation(
    translation: RAPIER.Vector3,
    delta: number,
    ray: RAPIER.Ray,
    world: RAPIER.World,
    velocity: number,
    keysPressed: any,
    walkDirection: THREE.Vector3,
  ) {
    // Method Initialization
    if (translation.y < -10) {
      this.resetPosition(translation);
      return
    }
    this.update3JsModelToPhysicsModel(translation)
    this.tempRayPoints = [];
    this.variableToKnowIfFallingOrNot = walkDirection.y


    // Gets intercept of each Ray Caster with Environment
    this.feetCollider.forEach((ray) => {
      var intersects = ray.intersectObject(this.threeJsEnv);
      if (intersects[0]) {
        this.tempRayPoints.push(intersects[0].point)
      }
    })

    // Get the first successful raycaster.
    let firstSuccesfulIntercept = this.tempRayPoints[0];
    let distanceFromIntersection: number;
    if (firstSuccesfulIntercept) {
      const pointOfImpact = firstSuccesfulIntercept;
      distanceFromIntersection = translation.y - (pointOfImpact.y + 0.0);
    }

    // Use different fall algorithm depending on distance from fall
    if (distanceFromIntersection! < 0.0)
    {
      this.variableToKnowIfFallingOrNot = 0
      walkDirection.y = this.fallLerp(this.variableToKnowIfFallingOrNot, Math.abs(distanceFromIntersection!), 0.2)
    }
    else if (distanceFromIntersection! < 0.5)
    {
      this.gravitySim.resetGravitySimulation();
      walkDirection.y += this.fallLerp(this.variableToKnowIfFallingOrNot, -9.81 * 2.5 * delta, 0.3)
    }
    else
    {
      walkDirection.y -= this.gravitySim.getDisplacement(delta);
    }


    this.tempRayPoints2 = [];

    // Gets intercept of each Ray Caster with Environment
    this.bodyCollider.forEach((ray) => {
      var intersects = ray.intersectObject(this.threeJsEnv);
      if (intersects[0]) {
        this.tempRayPoints2.push(intersects[0].point)
      }
    })
    console.log(this.tempRayPoints2)
    // Get the first successful raycaster.
    let firstSuccesfulIntercept1 = this.tempRayPoints2[0];
    let distanceFromIntersection1: number;
    if (firstSuccesfulIntercept1) {
      const pointOfImpact = firstSuccesfulIntercept1;
      distanceFromIntersection1 = translation.z - (pointOfImpact.z + 0.0);
    }

    // Use different fall algorithm depending on distance from fall
/*    console.log(distanceFromIntersection1!)*/
    if (distanceFromIntersection1! < 1) {
      walkDirection.x = 0
      walkDirection.z = 0
    }
    else {
      walkDirection.x = walkDirection.x * velocity * delta
      walkDirection.z = walkDirection.z * velocity * delta
    }

    //walkDirection.x = walkDirection.x * velocity * delta
    //walkDirection.z = walkDirection.z * velocity * delta

    // Jump
    if (keysPressed[SPACEBAR.SPACEBAR]) {

      this.rigidBody.setNextKinematicTranslation({
        x: translation.x + walkDirection.x,
        y: translation.y + walkDirection.y + 1,
        z: translation.z + walkDirection.z
      });
    }
    else {
      this.rigidBody.setNextKinematicTranslation({
        x: translation.x + walkDirection.x,
        y: translation.y + walkDirection.y,
        z: translation.z + walkDirection.z
      });
    }
  }

  fallLerp =
    (storedFall: number, displacement: number, factor: number) => {
      var x = storedFall * (1 - factor) + displacement * factor
      return x;
    };

  update3JsModelToPhysicsModel(translation: RAPIER.Vector3) {
    this.model.position.set(
      translation.x,
      translation.y,
      translation.z,
    )
  }

  resetPosition(translation: RAPIER.Vector3) {
    this.rigidBody.setNextKinematicTranslation({
      x: translation.x,
      y: 10,
      z: translation.z
    });
  }

  checkIfModelIsFallingBeneathWorld(translation: RAPIER.Vector3) {
    if (translation.y < -10) {
      this.resetPosition(translation);
    }
  }
}
