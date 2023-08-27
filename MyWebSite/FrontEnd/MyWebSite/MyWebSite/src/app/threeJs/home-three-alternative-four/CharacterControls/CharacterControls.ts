import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'
import { CharacterControlsUtils, DIRECTIONS, IButtonPressed, IColliderVariables, IGuiParams, IKeysPressed, IPlayerVariables, ITempVariables, IThreeJsMainComponents } from './CharacterControlsUtils'
import { Injectable } from '@angular/core'
import { CharacterAnimation } from './CharacterControlDetails/CharacterAnimation'
import { CharacterWalkDirection } from './CharacterControlDetails/CharacterWalkDirection'

export class CharacterControls {

  constructor(
    playerVariables: IPlayerVariables,
    guiParams: IGuiParams,
    tempVariables: ITempVariables,
    buttonPressed: IButtonPressed,
    threeJsMainComponents: IThreeJsMainComponents,
    colliderVariables: IColliderVariables,
    keysPressed: any
  ) {
    this.playerVariables = playerVariables,
    this.guiParams = guiParams,
    this.tempVariables = tempVariables,
    this.buttonPressed = buttonPressed,
    this.threeJsMainComponents = threeJsMainComponents
    this.colliderVariables = colliderVariables
    this.keysPressed = keysPressed
    this.animation = new CharacterAnimation(playerVariables.animatedVariables.animationsMap!, playerVariables.animatedVariables.mixer!);
    this.characterWalkDirection = new CharacterWalkDirection(this.threeJsMainComponents.camera, this.playerVariables.animatedVariables.mesh);
  }
  keysPressed: any;
  threeJsMainComponents: IThreeJsMainComponents;
  playerVariables: IPlayerVariables;
  guiParams: IGuiParams;
  tempVariables: ITempVariables;
  buttonPressed: IButtonPressed;
  colliderVariables: IColliderVariables;
  toggleRun: boolean = true;
  animation: CharacterAnimation;
  characterWalkDirection: CharacterWalkDirection;

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  updatePlayer(delta: any) {


    this.playerVariables.animatedVariables.mesh.position.set(
      this.playerVariables.player.mesh.position.x,
      this.playerVariables.player.mesh.position.y-1,
      this.playerVariables.player.mesh.position.z,
    )


    var directionPressed = Object.values(DIRECTIONS).some(key => this.keysPressed[key] == true);
    // ANIMATION AND CURRENT ANIMATION
    var actions = CharacterControlsUtils.previousAndCurrentAction(
      this.playerVariables.animatedVariables.currentAction!,
      directionPressed,
      this.toggleRun);

    // ACTIONS
    var previousAction = actions[0];
    this.playerVariables.animatedVariables.currentAction = actions[1];
    this.animation.animateCharacter(previousAction, this.playerVariables.animatedVariables.currentAction, delta);

    // WALK DIRECTION
    let walkDirection = this.characterWalkDirection.calculateWalkDirection(
      this.keysPressed,
      this.playerVariables.animatedVariables.currentAction!);

    // Falling down Algo
    if (this.playerVariables.playerIsOnGround) {
      this.playerVariables.playerVelocity.y = delta * this.guiParams.gravity;
    } else {
      this.playerVariables.playerVelocity.y += delta * this.guiParams.gravity;
    }
    this.playerVariables.player.mesh.position.addScaledVector(this.playerVariables.playerVelocity, delta);

    // move the player
    const angle = this.threeJsMainComponents.controls!.getAzimuthalAngle();
    if (this.buttonPressed.fwdPressed) {
      this.tempVariables.tempVector.set(0, 0, - 1).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.buttonPressed.bkdPressed) {
      this.tempVariables.tempVector.set(0, 0, 1).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.buttonPressed.lftPressed) {
      this.tempVariables.tempVector.set(- 1, 0, 0).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.buttonPressed.rgtPressed) {
      this.tempVariables.tempVector.set(1, 0, 0).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    this.playerVariables.player.mesh.updateMatrixWorld();

    // adjust player position based on collisions
    const capsuleInfo = this.playerVariables.player.capsuleInfo;
    this.tempVariables.tempBox.makeEmpty();
    this.tempVariables.tempMat.copy(this.colliderVariables.collider!.matrixWorld).invert();
    this.tempVariables.tempSegment.copy(capsuleInfo.segment);

    // get the position of the capsule in the local space of the collider
    this.tempVariables.tempSegment.start.applyMatrix4(this.playerVariables.player.mesh.matrixWorld).applyMatrix4(this.tempVariables.tempMat);
    this.tempVariables.tempSegment.end.applyMatrix4(this.playerVariables.player.mesh.matrixWorld).applyMatrix4(this.tempVariables.tempMat);

    // get the axis aligned bounding box of the capsule
    this.tempVariables.tempBox.expandByPoint(this.tempVariables.tempSegment.start);
    this.tempVariables.tempBox.expandByPoint(this.tempVariables.tempSegment.end);
    this.tempVariables.tempBox.min.addScalar(- capsuleInfo.radius);
    this.tempVariables.tempBox.max.addScalar(capsuleInfo.radius);

    this.colliderVariables.collider!.geometry.boundsTree!.shapecast({
      intersectsBounds: (box: any) => box.intersectsBox(this.tempVariables.tempBox),
      intersectsTriangle: (tri: any) => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = this.tempVariables.tempVector;
        const capsulePoint = this.tempVariables.tempVector2;
        const distance = tri.closestPointToSegment(this.tempVariables.tempSegment, triPoint, capsulePoint);

        if (distance < capsuleInfo.radius) {
          const depth = capsuleInfo.radius - distance;
          const direction = capsulePoint.sub(triPoint).normalize();
          this.tempVariables.tempSegment.start.addScaledVector(direction, depth);
          this.tempVariables.tempSegment.end.addScaledVector(direction, depth);
        }
      }
    });

    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = this.tempVariables.tempVector;
    newPosition.copy(this.tempVariables.tempSegment.start).applyMatrix4(this.colliderVariables.collider!.matrixWorld);

    // check how much the collider was moved
    const deltaVector = this.tempVariables.tempVector2;
    deltaVector.subVectors(newPosition, this.playerVariables.player.mesh.position);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    this.playerVariables.playerIsOnGround = deltaVector.y > Math.abs(delta * this.playerVariables.playerVelocity.y * 0.25);
    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);

    // adjust the player model
    this.playerVariables.player.mesh.position.add(deltaVector);

    if (!this.playerVariables.playerIsOnGround) {
      deltaVector.normalize();
      this.playerVariables.playerVelocity.addScaledVector(deltaVector, - deltaVector.dot(this.playerVariables.playerVelocity));
    } else {
      this.playerVariables.playerVelocity.set(0, 0, 0);
    }

    // adjust the camera
    this.threeJsMainComponents.camera.position.sub(this.threeJsMainComponents.controls!.target);
    this.threeJsMainComponents.controls!.target.copy(this.playerVariables.player.mesh.position);
    this.threeJsMainComponents.camera.position.add(this.playerVariables.player.mesh.position);
  }

}
