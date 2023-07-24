import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DIRECTIONS, modelAction } from './ControllerUtils'

export class CharacterTranslation {

  constructor(
    camera: THREE.Camera,
    currentAction: string,
    model: THREE.Group,
    rigidBody: RAPIER.RigidBody,
    orbitControls: OrbitControls,
  ) {
    this.currentAction = currentAction;
    this.camera = camera;
    this.model = model;
    this.rigidBody = rigidBody;
    this.orbitControl = orbitControls
    const rigidTranslation = this.rigidBody.translation();
/*    this.updateCameraTarget(new THREE.Vector3(0, 1, 5), rigidTranslation)*/
  }
  model: THREE.Group
  camera: THREE.Camera;
  currentAction: string;
  rigidBody: RAPIER.RigidBody;
  storedFall = 0;

  // constants
  runVelocity = 10
  walkVelocity = 2
  cameraTarget = new THREE.Vector3()
  orbitControl: OrbitControls
  lerp = (x: number, y: number, a: number) => { return x * (1 - a) + y * a };

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
      this.rigidBody.setNextKinematicTranslation({
        x: translation.x,
        y: 10,
        z: translation.z
      });
    } else {
      // update camera Position


      // update model to physics coordinates and camera
      this.model.position.x = translation.x
      this.model.position.y = translation.y
      this.model.position.z = translation.z

      walkDirection.y += this.lerp(this.storedFall, -9.81 * delta, 0.3)
      this.storedFall = walkDirection.y
      // Update Camera Position
      ray.origin.x = translation.x
      ray.origin.y = translation.y
      ray.origin.z = translation.z

      // Falling Algorithm
      let hit = world.castRay(ray, 0.5, false, 0xfffffffff);
      if (hit) {
        console.log(hit.toi)  //Distance from ray to impact
        // Ray is attached to Charachter
        // Origin of Ray similar to origin of Character
        // Compare translation of Ray vs Point Hit

        const pointOfImpact = ray.pointAt(hit.toi);
        let diff = translation.y - (pointOfImpact.y + 0.5);
        /*        console.log(translation.y - (pointOfImpact.y + 0.5))*/
        if (diff < 0.0) {
          this.storedFall = 0
          walkDirection.y = this.lerp(this.storedFall, Math.abs(diff), 0.5)
        }
      }

      walkDirection.x = walkDirection.x * velocity * delta
      walkDirection.z = walkDirection.z * velocity * delta

      if (keysPressed[DIRECTIONS.SPACEBAR]) {

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

}
