// Import the three.js library and components needed
import * as THREE from 'three'

// Parent class
import MeshFactory from './MeshFactory'

/**
 * A class to build cloth meshes for use with Three.js
 **/
class ClothFactory extends MeshFactory {
  /**
   * Create a new cloth factory object
   * at (0, 0, 0).
   **/
  constructor () {
    super()
    this._count++
    this._name = `Cloth ${this._count}`
  }

  /**
   * Build and return a THREE.Geometry() object representing a cloth.
   * @override
   **/
  makeObjectGeometry () {
    // Make an empty geometry structure
    var clothGeom = new THREE.Geometry()

    // Add the eight vertices
    clothGeom.vertices.push(
      // Add the bottom four vertices
      new THREE.Vector3(-1.0, -1.0, -1.0), // 0
      new THREE.Vector3(1.0, -1.0, -1.0), // 1
      new THREE.Vector3(1.0, -1.0, 1.0), // 2
      new THREE.Vector3(-1.0, -1.0, 1.0), // 3

      // Add the top four vertices
      new THREE.Vector3(-1.0, 1.0, -1.0), // 4
      new THREE.Vector3(1.0, 1.0, -1.0), // 5
      new THREE.Vector3(1.0, 1.0, 1.0), // 6
      new THREE.Vector3(-1.0, 1.0, 1.0) // 7
    )

    // Make the six face normals in an array
    var normals = [
      // X
      new THREE.Vector3(1.0, 0.0, 0.0), // 0
      new THREE.Vector3(-1.0, 0.0, 0.0), // 1

      // Y
      new THREE.Vector3(0.0, 1.0, 0.0), // 2
      new THREE.Vector3(0.0, -1.0, 0.0), // 3

      // Z
      new THREE.Vector3(0.0, 0.0, 1.0), // 4
      new THREE.Vector3(0.0, 0.0, -1.0) // 5
    ]

    // Add 12 triangles for the six faces and one normal for each
    clothGeom.faces.push(
      // Bottom face (-Y)
      // new THREE.Face3(0, 1, 2, normals[3]),
      // new THREE.Face3(2, 3, 0, normals[3]),

      // Top face (Y)
      // new THREE.Face3(7, 6, 5, normals[2]),
      // new THREE.Face3(5, 4, 7, normals[2]),

      // Front face (Z)
      new THREE.Face3(3, 2, 6, normals[4]), // /|
      new THREE.Face3(6, 7, 3, normals[4]),  // |/

      // Right face (X)
      // new THREE.Face3(2, 1, 5, normals[0]),
      // new THREE.Face3(5, 6, 2, normals[0]),

      // Back face (-Z)
      // new THREE.Face3(1, 0, 4, normals[5]),
      // new THREE.Face3(4, 5, 1, normals[5]),

      // Left face (-X)
      // new THREE.Face3(0, 3, 7, normals[1]),
      // new THREE.Face3(7, 4, 0, normals[1])
    )

    // Return the finished geometry
    return clothGeom
  }
}

// Export the ClothFactory class for use in other modules
export default ClothFactory
