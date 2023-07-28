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
    feetRayStepper: THREE.Raycaster[]
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
  threeJsEnv: THREE.Group
  feetRayStepper: THREE.Raycaster[];
  tempRayPoints: THREE.Vector3[] = [];

  calculateTranslation(
    translation: RAPIER.Vector3,
    delta: number,
    ray: RAPIER.Ray,
    world: RAPIER.World,
    velocity: number,
    keysPressed: any,
    walkDirection: THREE.Vector3,
  ) {

    this.update3JsModelToPhysicsModel(translation)
    this.tempRayPoints = [];

    if (translation.y < -10) {
      this.resetPosition(translation);
      return
    }

    this.variableToKnowIfFallingOrNot = walkDirection.y

    this.feetCollider.forEach((ray) => {
      var intersects = ray.intersectObject(this.threeJsEnv);
      if (intersects[0]) {
        this.tempRayPoints.push(intersects[0].point)
      }
      //this.tempRayPoints.push(intersects[0].point);
    })
    var x = this.tempRayPoints.some((vector => { return (vector) ? true : false; }));
    if (x) {


    }
    //this.tempRayPoints.some(x => x!);
    let firstRay = this.feetCollider[0] as THREE.Raycaster;
    let hit = firstRay.intersectObject(this.threeJsEnv);
    let distanceFromIntersection: number;
    if (hit[0]) {
      const pointOfImpact = hit[0].point;
      distanceFromIntersection = translation.y - (pointOfImpact.y + 0.0);
    }

    if (distanceFromIntersection! < 0.0) {
      this.variableToKnowIfFallingOrNot = 0
      walkDirection.y = this.fallLerpFunction(this.variableToKnowIfFallingOrNot, Math.abs(distanceFromIntersection!), 0.2)
    }
    else if (distanceFromIntersection! < 0.5) {
      this.gravitySim.resetGravitySimulation();
      walkDirection.y += this.fallLerpFunction(this.variableToKnowIfFallingOrNot, -9.81 * 2.5 * delta, 0.3)
    }
    else {
      walkDirection.y -= this.gravitySim.getDisplacement(delta);
    }

    walkDirection.x = walkDirection.x * velocity * delta
    walkDirection.z = walkDirection.z * velocity * delta

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

  fallLerpFunction =
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
}
