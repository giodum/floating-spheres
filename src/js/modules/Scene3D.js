import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

export default class Scene3D {
  // singleton pattern
  static item = null

  // mouse position
  #mouseX = 0
  #mouseY = 0

  constructor() {
    // check previous existance of the instance
    if (Scene3D.item) {
      throw new Error('Scene3D has already been initialized')
    }

    // initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector('canvas'),
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // initialize scene
    this.scene = new THREE.Scene()

    // set cube texture map into scene
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const cubeTexture = cubeTextureLoader
      .setPath('/maps/swedishcastle/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
    this.scene.background = cubeTexture

    // initialize camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    )
    this.camera.position.z = 3

    // temp orbit control
    // this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    // this.orbit.update()

    // generate spheres
    this.geometry = new THREE.SphereGeometry(0.1, 32, 16)
    this.material = new THREE.MeshStandardMaterial({
      envMap: cubeTexture,
      metalness: 1,
      roughness: 0,
    })

    this.spheres = []
    for (let i = 0; i < 50; i++) {
      const sphere = new THREE.Mesh(this.geometry, this.material)

      sphere.position.x = Math.random() * 10 - 5
      sphere.position.y = Math.random() * 10 - 5
      sphere.position.z = Math.random() * 10 - 5

      const scaleFactor = Math.random() * 5
      sphere.scale.x = sphere.scale.y = sphere.scale.z = scaleFactor

      this.scene.add(sphere)
      this.spheres.push(sphere)
    }

    // set event listeners
    this.eventListeners()

    // start animation loop
    this.animate()
  }

  animate() {
    const timer = 0.0001 * Date.now()

    // update camera with mouse movement
    this.camera.position.x += (this.#mouseX - this.camera.position.x) * 0.05
    this.camera.position.y += (-this.#mouseY - this.camera.position.y) * 0.05
    this.camera.lookAt(this.scene.position)

    // make spheres move
    for (let i = 0; i < this.spheres.length; i++) {
      const sphere = this.spheres[i]

      sphere.position.x = 5 * Math.cos(timer + i)
      sphere.position.y = 5 * Math.sin(timer + i * 1.1)
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate())
  }

  eventListeners() {
    window.addEventListener('resize', this.resize.bind(this))
    document.addEventListener('mousemove', this.mousemove.bind(this))
  }

  mousemove(event) {
    this.#mouseX = (event.clientX - window.innerWidth / 2) / 100
    this.#mouseY = (event.clientY - window.innerHeight / 2) / 100
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  static init() {
    if (!Scene3D.item) {
      Scene3D.item = new Scene3D()
    }
  }
}
