import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DIRECTIONS, modelAction, SPACEBAR } from '../ControllerUtils'
import { GravitySimulation } from './GravitySimulation';

export class CharacterTranslation {

  constructor(
    camera: THREE.Camera,
    currentAction: string,
    model: THREE.Group,
    rigidBody: RAPIER.RigidBody,
    orbitControls: OrbitControls,
    ray: RAPIER.Ray
  ) {
    this.currentAction = currentAction;
    this.camera = camera;
    this.model = model;
    this.rigidBody = rigidBody;
    this.orbitControl = orbitControls
    this.ray = ray
    const rigidTranslation = this.rigidBody.translation();


    this.gravitySimulation = new GravitySimulation(this.rigidBody);
    //this.updateCameraTarget(new THREE.Vector3(0, 1, 5), rigidTranslation)
  }
  model: THREE.Group
  camera: THREE.Camera;
  currentAction: string;
  rigidBody: RAPIER.RigidBody;
  storedFall = 0;
  ray: RAPIER.Ray;
  // constants
  runVelocity = 10
  walkVelocity = 2
  cameraTarget = new THREE.Vector3()
  orbitControl: OrbitControls;
  gravitySimulation: GravitySimulation;

  gravity = new THREE.Vector3(0, -9.81, 0);
  fallLerpFunction =
    (storedFall: number, displacement: number, factor: number) =>
    {
      var x = storedFall * (1 - factor) + displacement * factor

      return x;
    };


  characterFalls() {
  }


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

  calculateTranslation(
    threeJsModel: THREE.Group,
    translation: RAPIER.Vector3,
    delta: number,
    ray: RAPIER.Ray,
    world: RAPIER.World,
    velocity: number,
    keysPressed: any,
    walkDirection: THREE.Vector3
  ) {

    if (translation.y < -10) {
      this.resetPosition(translation);
    } else {

      this.update3JsModelToPhysicsModel(translation)


      walkDirection.y += this.fallLerpFunction(this.storedFall, -9.81 * delta, 0.3)
      //walkDirection.y += -9.81 * 3 * delta
      //walkDirection.y -= this.gravitySimulation.getDisplacement(delta);


      this.storedFall = walkDirection.y

      // Falling Algorithm
      let hit = world.castRay(ray, 0.5, false, 0xfffffffff);
      if (hit) {
        /*console.log(hit.toi)*/  //Distance from ray to impact
        // Ray is attached to Charachter
        // Origin of Ray similar to origin of Character
        // Compare translation of Ray vs Point Hit

        const pointOfImpact = ray.pointAt(hit.toi);
        let diff = translation.y - (pointOfImpact.y + 0.5);
        /*        console.log(translation.displacement - (pointOfImpact.displacement + 0.5))*/
        if (diff < 0.0) {
          this.storedFall = 0
          walkDirection.y = this.fallLerpFunction(this.storedFall, Math.abs(diff), 0.5)
        }
      }

      walkDirection.x = walkDirection.x * velocity * delta
      walkDirection.z = walkDirection.z * velocity * delta
      //this.rigidBody.setNextKinematicTranslation({
      //  x: translation.x + walkDirection.x,
      //  y: translation.y + walkDirection.y,
      //  z: translation.z + walkDirection.z
      //});


















      if (keysPressed[SPACEBAR.SPACEBAR]) {

        this.rigidBody.setNextKinematicTranslation({
          x: translation.x + walkDirection.x,
          y: translation.y + walkDirection.y + 2,
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





  resetPosition(translation: RAPIER.Vector3) {
    this.rigidBody.setNextKinematicTranslation({
      x: translation.x,
      y: 10,
      z: translation.z
    });
  }
}
