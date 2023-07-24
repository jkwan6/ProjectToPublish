import * as THREE from 'three'
import { modelAction } from './ControllerUtils'

export class CharacterAnimation {
  fadeDuration: number = 0.2
  animationMap: Map<string, THREE.AnimationAction>
  mixer: THREE.AnimationMixer

  constructor(animationMap: Map<string, THREE.AnimationAction>, mixer: THREE.AnimationMixer ) {
    this.animationMap = animationMap;
    this.mixer = mixer
  }

  previousAndCurrentAction(currentAction: string, directionPressed: boolean, toggleRun: boolean): [previousAction: string, currentAction: string] {
    var previousAction = currentAction;
    var action: string;  // Reset
    if (directionPressed && toggleRun) { action = modelAction.run }
    else if (directionPressed) { action = modelAction.walk }
    else { action = modelAction.idle }
    (currentAction != action) ? currentAction = action : currentAction;
    return [previousAction, currentAction];
  }

  animateCharacter(
    previousAction: string,
    currentAction: string,
    delta: number
  ){
    if (previousAction != currentAction) {
      const toPlay = this.animationMap.get(currentAction)
      const current = this.animationMap.get(previousAction)
      current!.fadeOut(this.fadeDuration)
      toPlay!.reset().fadeIn(this.fadeDuration).play();
      previousAction = currentAction
    }
    this.mixer.update(delta)
  }
}
