// Import the three.js library
import * as THREE from 'three'

// build a new Directional Light that supports shadow maps
export function makeShadowedLight (x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity)
  directionalLight.position.set(x, y, z)
  directionalLight.castShadow = true

  // Setup the shadow map frustum
  var d = 4.0
  directionalLight.shadow.camera.left = -d
  directionalLight.shadow.camera.right = d
  directionalLight.shadow.camera.top = d
  directionalLight.shadow.camera.bottom = -d
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 8

  // Setup shadow map resolution
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.bias = -0.005

  // Return the newly made light
  return directionalLight
}
