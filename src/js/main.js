// Inspired by pauldevec code - https://github.com/mrdoob/three.js/blob/master/examples/
import Scene3D from './modules/Scene3D'

export default class Main {
  constructor() {
    this.init()
  }

  init() {
    Scene3D.init()
  }
}

const main = new Main()
