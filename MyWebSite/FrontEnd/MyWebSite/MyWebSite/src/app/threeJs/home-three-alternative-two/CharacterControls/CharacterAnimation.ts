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



export class CharacterAnimation {

  fadeDuration: number = 0.2


  animateCharachter(
    directionPressed: boolean,
    toggleRun: boolean,
    currentAction: string,
    animationMap: Map<string, THREE.AnimationAction>,
    mixer: THREE.AnimationMixer,
    delta: number
  ) {
    var play = '';
    if (directionPressed && toggleRun) { play = modelAnimation.run }
    else if (directionPressed) { play = modelAnimation.walk }
    else { play = modelAnimation.idle }
    if (currentAction != play) {
      const toPlay = animationMap.get(play)
      const current = animationMap.get(currentAction)
      current!.fadeOut(this.fadeDuration)
      toPlay!.reset().fadeIn(this.fadeDuration).play();
      currentAction = play
    }
    mixer.update(delta)
  }

}
