// Import the three.js library and components needed
import * as THREE from 'three'

// Parent class
import MeshFactory from './MeshFactory'

/**
 * A class to build sphere meshes for use with Three.js
 **/
class SphereFactory extends MeshFactory {
  /**
   * Create a new sphere factory object that will use the given subdivision
   * parameters to generate unit spheres centered at (0, 0, 0).
   * @param {slices} number The number of subdivisions around the equator.
   * @param {stacks} number The number of subdivisions between the poles.
   **/
  constructor (slices, stacks) {
    super()
    this._count++
    this._name = `Sphere ${this._count}`
    this._slices = slices || 36
    this._stacks = stacks || 18
  }

  /**
   * Set the subdivisions around the equator of the sphere.
   * @param {newVal} number The number of subdivisions around the equator.
   **/
  set slices (newVal) {
    if (typeof newVal === 'number') {
      this._slices = newVal
    }
  }

  /**
   * Set the subdivisions between the poles of the sphere.
   * @param {newVal} number The number of subdivisions between the poles.
   **/
  set stacks (newVal) {
    if (typeof newVal === 'number') {
      this._stacks = newVal
    }
  }

  /**
   * Build and return a THREE.Geometry() object representing a sphere.
   * @override
   **/
  makeObjectGeometry () {
    // A fresh, empty Geometry object that will hold the mesh geometry
    var sphereGeom = new THREE.Geometry()
    var normals = []

    // Set the north pole of the sphere to to Y = 1
    sphereGeom.vertices.push(new THREE.Vector3(0, 1, 0))
    normals.push(new THREE.Vector3(0, 1, 0))

    let theta = 0 // Angle used for each slice - [0..2*PI) - Longitude
    let phi = 0 // Angle for each stack - [0...PI] - Latitude
    let deltaTheta = 2 * Math.PI / this._slices // Radians per longitude line
    let deltaPhi = Math.PI / this._stacks // Radians per latitude line
    let globalTracker = 0 // Tracks the global amount of vertices made for the whole sphere
    let localTracker = 0 // Tracks the current amount of vertices made for each stack
    let CCW = false // Controls clockwise/counter-clockwise winding

    // Draw slices of the sphere from theta = 0' to theta = 360'
    for (let i = 0; i < this._slices; i++) {
      // Draws faces of each slice from top to bottom
      for (let j = 0; j <= this._stacks * 2 + 1; j++) {
        // Push two vertices per level to create a tri-face at each stack
        sphereGeom.vertices.push(new THREE.Vector3(
          Math.sin(theta) * Math.sin(phi),
          Math.cos(phi),
          Math.cos(theta) * Math.sin(phi)
        ))

        // Push the normal for the vertex
        normals.push(new THREE.Vector3(
          Math.sin(theta) * Math.sin(phi),
          Math.cos(phi),
          Math.cos(theta) * Math.sin(phi)
        ))

        sphereGeom.vertices.push(new THREE.Vector3(
          Math.sin(theta + deltaTheta) * Math.sin(phi),
          Math.cos(phi),
          Math.cos(theta + deltaTheta) * Math.sin(phi)
        ))

        normals.push(new THREE.Vector3(
          Math.sin(theta + deltaTheta) * Math.sin(phi),
          Math.cos(phi),
          Math.cos(theta + deltaTheta) * Math.sin(phi)
        ))

        // Push the faces of the sphere
        //     A
        //    /|
        //  /  |
        // B---C
        // |  /|
        // |/  |
        // D---E
        //  \  |
        //   \ |
        //    F
        if (j >= 2) {
          let A = j + globalTracker
          let B = A - 1
          let C = A - 2
          if (CCW) {
            sphereGeom.faces.push(new THREE.Face3(A, B, C, [normals[A], normals[B], normals[C]]))
          } else {
            sphereGeom.faces.push(new THREE.Face3(A, C, B, [normals[A], normals[C], normals[B]]))
          }
          CCW = !CCW // Wind the opposite way
        }
        // After the face is drawn go down a stack:
        // - Increment phi by deltaPhi
        // - Increment localTracker by the 2 (the number of vertices made)
        phi += deltaPhi
        localTracker += 2
      }
      // After a full strip /slice is drawn:
      // - Track the total number of vertices by incrementing globalTracker with localTracker
      // - Move on to the next slice with theta
      // - Reset phi and tracker
      globalTracker += localTracker
      theta += deltaTheta
      phi = 0
      localTracker = 0
    }

    // Return the finished geometry
    return sphereGeom
  }
}

// Export the SphereFactory class for use in other modules
export default SphereFactory
