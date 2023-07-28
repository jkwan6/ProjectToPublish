import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SPACEBAR } from './ControllerUtils'

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
  }
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

    this.tempRayPoints = [];

    if (translation.y < -10) {
      this.resetPosition(translation);
    } else {

      this.update3JsModelToPhysicsModel(translation)
      walkDirection.y += this.fallLerpFunction(this.variableToKnowIfFallingOrNot, -9.81 * 2.5 * delta, 0.3)
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
      let test = this.feetCollider[0] as THREE.Raycaster;
      let hit2 = test.intersectObject(this.threeJsEnv);

      if (hit2[0]) {
        /*console.log(hit.toi)*/  //Distance from ray to impact
        // Ray is attached to Charachter
        // Origin of Ray similar to origin of Character
        // Compare translation of Ray vs Point Hit
        const pointOfImpact = hit2[0].point;
        //console.log(pointOfImpact.y)
        let diff = translation.y - (pointOfImpact.y + 0.0);
        if (diff < 0.0) {
          this.variableToKnowIfFallingOrNot = 0
          walkDirection.y = this.fallLerpFunction(this.variableToKnowIfFallingOrNot, Math.abs(diff), 0.2)
        }
      }




      //// Falling Algorithm
      //let hit = world.castRay(ray, 20, false, 0xfffffffff);
      //if (hit) {
      //  /*console.log(hit.toi)*/  //Distance from ray to impact
      //  // Ray is attached to Charachter
      //  // Origin of Ray similar to origin of Character
      //  // Compare translation of Ray vs Point Hit
      //  const pointOfImpact = ray.pointAt(hit.toi);
      //  //console.log(pointOfImpact.y)
      //  let diff = translation.y - (pointOfImpact.y + 0.5);
      //  if (diff < 0.0) {
      //    this.variableToKnowIfFallingOrNot = 0
      //    walkDirection.y = this.fallLerpFunction(this.variableToKnowIfFallingOrNot, Math.abs(diff), 0.5)
      //  }
      //}

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
  }

  fallLerpFunction =
    (storedFall: number, displacement: number, factor: number) => {
      var x = storedFall * (1 - factor) + displacement * factor
      return x;
    };

  update3JsModelToPhysicsModel(translation: RAPIER.Vector3) {
    // update 3js model to physics coordinates
    this.model.position.set(
      translation.x,
      translation.y,
      translation.z,
    )
    // Update Ray Position to new coord
    this.ray.origin.x = translation.x
    this.ray.origin.y = translation.y
    this.ray.origin.z = translation.z
  }

  resetPosition(translation: RAPIER.Vector3) {
    this.rigidBody.setNextKinematicTranslation({
      x: translation.x,
      y: 10,
      z: translation.z
    });
  }
}
