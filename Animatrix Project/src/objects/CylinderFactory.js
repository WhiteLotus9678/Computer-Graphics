// Import the three.js library and components needed
import * as THREE from 'three'

// Parent class
import MeshFactory from './MeshFactory'

/**
 * A class to build cylinder meshes for use with Three.js
 **/
class CylinderFactory extends MeshFactory {
  /**
   * Create a new cylinder Factory object that will use the given subdivision
   * parameter to generate unit cylinders centered at (0, 0, 0) aligned with Y.
   * @param {slices} number The number of subdivisions around the central axis.
   **/
  constructor (slices) {
    super()
    this._count++
    this._name = `Cylinder ${this._count}`
    // 18 default slices
    this._slices = slices || 18
  }

  /**
   * Set the subdivisions around the outside of the cylinder.
   * @param {newVal} number The number of subdivisions around the central axis.
   **/
  set slices (newVal) {
    if (typeof newVal === 'number') {
      this._slices = newVal
    }
  }

  /**
   * Build and return a THREE.Geometry() object representing a cylinder.
   * @override
   **/
  makeObjectGeometry () {
    // A fresh, empty Geometry object that will hold the mesh geometry
    var cylGeom = new THREE.Geometry()
    var normals = []

    // The bottom face is set at Y = -1
    cylGeom.vertices.push(new THREE.Vector3(0, -1, 0))
    normals.push(new THREE.Vector3(0, -1, 0))

    // Create and push the vertices/normals of the bottom face
    for (let i = this._slices; i > 0; i--) {
      var theta = (i / this._slices) * Math.PI * 2
      cylGeom.vertices.push(new THREE.Vector3(Math.cos(theta), -1, Math.sin(theta)))
      normals.push(new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)))
    }

    // Push the faces for the bottom circle
    for (let i = 1; i <= this._slices; i++) {
      if (i === this._slices) {
        cylGeom.faces.push(new THREE.Face3(1, i, 0, normals[0]))
      } else {
        cylGeom.faces.push(new THREE.Face3(i + 1, i, 0, normals[0]))
      }
    }

    // topCircle checks the length of the vertices on the bottom circle
    // Later used to draw faces for the side
    let topCircle = cylGeom.vertices.length

    // // The top face is set at Y = 1
    cylGeom.vertices.push(new THREE.Vector3(0, 1, 0))
    normals.push(new THREE.Vector3(0, 1, 0))

    // Create and push the vertices/normals of the top face
    for (let i = this._slices; i > 0; i--) {
      theta = (i / this._slices) * Math.PI * 2
      cylGeom.vertices.push(new THREE.Vector3(Math.cos(theta), 1, Math.sin(theta)))
      normals.push(new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)))
    }

    // Push the faces for the top circle
    for (let i = 1; i <= this._slices; i++) {
      if (i === this._slices) {
        cylGeom.faces.push(new THREE.Face3(this._slices + 2, this._slices + 1, i + this._slices + 1, normals[this._slices + 1]))
      } else {
        cylGeom.faces.push(new THREE.Face3(i + this._slices + 2, this._slices + 1, i + this._slices + 1, normals[this._slices + 1]))
      }
    }

    // Push the faces for the sides
    // C---D
    // |\  |
    // | \ |
    // |  \|
    // A---B
    //
    for (let i = 1; i <= this._slices; i++) {
      let A = i
      let B = A + 1
      let C = topCircle + i
      let D = C + 1

      // Alter vertices B and D for the last face of the cylinder
      if (i === this._slices) {
        B = 1
        D = topCircle + 1
      }

      cylGeom.faces.push(new THREE.Face3(C, A, B, [normals[C], normals[A], normals[B]]))
      cylGeom.faces.push(new THREE.Face3(C, B, D, [normals[C], normals[B], normals[D]]))
    }

    // Return the finished geometry
    return cylGeom
  }
}

// Export the CylinderFactory class for use in other modules
export default CylinderFactory
