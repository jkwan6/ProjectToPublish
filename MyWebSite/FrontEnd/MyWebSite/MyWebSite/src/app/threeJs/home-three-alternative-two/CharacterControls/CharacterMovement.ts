import * as THREE from 'three'
import { modelAnimation } from '../../home-three-alternative-two/home-three-alternative-two.component'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



const W = 'w'
const A = 'a'
const S = 's'
const D = 'd'
const SPACEBAR = " ";
const SHIFT = 'shift'
const DIRECTIONS = [W, A, S, D];


export class CharacterMovement {

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
  }
  model: THREE.Group
  camera: THREE.Camera;
  currentAction: string;
  rigidBody: RAPIER.RigidBody;
  storedFall = 0;

  // constants
  fadeDuration: number = 0.2
  runVelocity = 10
  walkVelocity = 2
  cameraTarget = new THREE.Vector3()
  orbitControl: OrbitControls
  lerp = (x: number, y: number, a: number) => { return x * (1 - a) + y * a };
  calculateVelocity(currentAction: string): number {
    let velocity = 0
    if (currentAction == modelAnimation.run || currentAction == modelAnimation.walk) {
      velocity = currentAction == modelAnimation.run ? this.runVelocity : this.walkVelocity
    }
    return velocity
  }


  // Resetting Walk Direction
  calculateWalkDirection(keysPressed : string, currentAction: string): THREE.Vector3 {
    let walkDirection = new THREE.Vector3(0, 0, 0);
    let rotateQuarternion = new THREE.Quaternion();
    let rotateAngle = new THREE.Vector3(0, 1, 0);

    if (currentAction == modelAnimation.run || currentAction == modelAnimation.walk) {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        (this.camera.position.x - this.model.position.x),
        (this.camera.position.z - this.model.position.z))
      // diagonal movement angle offset
      var directionOffset = this.directionOffset(keysPressed)

      // rotate model
      rotateQuarternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + directionOffset)
      this.model.quaternion.rotateTowards(rotateQuarternion, 0.2)

      // calculate direction
      this.camera.getWorldDirection(walkDirection)
      walkDirection.y = 0;
      walkDirection.normalize(); // Unit Vector
      walkDirection.applyAxisAngle(rotateAngle, directionOffset)
    }
    return walkDirection;
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
      this.rigidBody.setNextKinematicTranslation({
        x: translation.x,
        y: 10,
        z: translation.z
      });
    } else {
      // update camera Position
      const cameraPositionOffset = this.camera.position.sub(this.model.position);
      // update model to physics coordinates and camera
      this.model.position.x = translation.x
      this.model.position.y = translation.y
      this.model.position.z = translation.z
      this.updateCameraTarget(cameraPositionOffset)

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

      if (keysPressed[SPACEBAR]) {

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




  public updateCameraTarget(offset: THREE.Vector3) {
    // move camera
    const rigidTranslation = this.rigidBody.translation();
    this.camera.position.x = rigidTranslation.x + offset.x
    this.camera.position.y = rigidTranslation.y + offset.y
    this.camera.position.z = rigidTranslation.z + offset.z

    // update camera target
    this.cameraTarget.x = rigidTranslation.x
    this.cameraTarget.y = rigidTranslation.y + 1.5
    this.cameraTarget.z = rigidTranslation.z
    this.orbitControl.target = this.cameraTarget
  }

  private directionOffset(keysPressed: any) {
    var directionOffset = 0 // w

    //switch (keysPressed[A]) {
    //  case (keysPressed[W] && keysPressed[A]): { directionOffset = Math.PI / 4; break; }
    //  case (keysPressed[W] && keysPressed[D]): { directionOffset = - Math.PI / 4; break; }
    //  case (keysPressed[S] && keysPressed[A]): { directionOffset = Math.PI / 4 + Math.PI / 2; break; }
    //  case (keysPressed[S] && keysPressed[D]): { directionOffset = -Math.PI / 4 - Math.PI / 2; break; }
    //  case (keysPressed[S]): { directionOffset = Math.PI; break; }
    //  case (keysPressed[A]): { directionOffset = Math.PI / 2; break; }
    //  case (keysPressed[D]): { directionOffset = - Math.PI / 2; break; }
    //}



    if (keysPressed[W]) {
      if (keysPressed[A]) {
        directionOffset = Math.PI / 4 // w+a
      } else if (keysPressed[D]) {
        directionOffset = - Math.PI / 4 // w+d
      }
    } else if (keysPressed[S]) {
      if (keysPressed[A]) {
        directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
      } else if (keysPressed[D]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
      } else {
        directionOffset = Math.PI // s
      }
    } else if (keysPressed[A]) {
      directionOffset = Math.PI / 2 // a
    } else if (keysPressed[D]) {
      directionOffset = - Math.PI / 2 // d
    }

    return directionOffset
  }


}
