import RAPIER from "@dimforge/rapier3d";

export class GravitySimulation{
  timeElapsed: number;
  previousYTranslate!: number;
  rigidBody: RAPIER.RigidBody;
  constructor(rigidBody: RAPIER.RigidBody) {
    this.timeElapsed = 0;
    this.rigidBody = rigidBody;
  }

  resetGravitySimulation() {
    this.timeElapsed = 0;
  }

  getDisplacement(deltaTime: number): number {
    
    this.previousYTranslate = this.rigidBody.translation().y;
    let previousTime: number;
    let currentTime: number;
    let displacement: number;

    previousTime = this.timeElapsed;
    currentTime = this.timeElapsed + deltaTime;

    if (currentTime < 14) {
      displacement =
        (4.905 * currentTime * currentTime) -
        (4.905 * previousTime * previousTime);
    }
    else {
      displacement = 68 * (currentTime - previousTime);
    }
/*    console.log(displacement)*/
    this.timeElapsed += deltaTime;
    return displacement
  }
}
