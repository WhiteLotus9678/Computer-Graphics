// Import the three.js library and components needed
import * as THREE from 'three'

// Parent class
import MeshFactory from './MeshFactory'

/**
 * A class to build cube meshes for use with Three.js
 **/
class CubeFactory extends MeshFactory {
  /**
   * Create a new cube factory object that will generate unit cubes centered
   * at (0, 0, 0).
   **/
  constructor () {
    super()
    this._count++
    this._name = `Cube ${this._count}`
  }

  /**
   * Build and return a THREE.Geometry() object representing a unit cube.
   * @override
   **/
  makeObjectGeometry () {
    // Make an empty geometry structure
    var cubeGeom = new THREE.Geometry()

    // Add the eight vertices
    cubeGeom.vertices.push(
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
      new THREE.Vector3(1.0, 0.0, 0.0), // 0
      new THREE.Vector3(-1.0, 0.0, 0.0), // 1

      new THREE.Vector3(0.0, 1.0, 0.0), // 2
      new THREE.Vector3(0.0, -1.0, 0.0), // 3

      new THREE.Vector3(0.0, 0.0, 1.0), // 4
      new THREE.Vector3(0.0, 0.0, -1.0) // 5
    ]

    // Add 12 triangles for the six faces and one normal for each
    cubeGeom.faces.push(
      // Bottom face (-Y)
      new THREE.Face3(0, 1, 2, normals[3]),
      new THREE.Face3(2, 3, 0, normals[3]),

      // Top face (Y)
      new THREE.Face3(7, 6, 5, normals[2]),
      new THREE.Face3(5, 4, 7, normals[2]),

      // Front face (Z)
      new THREE.Face3(3, 2, 6, normals[4]),
      new THREE.Face3(6, 7, 3, normals[4]),

      // Right face (X)
      new THREE.Face3(2, 1, 5, normals[0]),
      new THREE.Face3(5, 6, 2, normals[0]),

      // Back face (-Z)
      new THREE.Face3(1, 0, 4, normals[5]),
      new THREE.Face3(4, 5, 1, normals[5]),

      // Left face (-X)
      new THREE.Face3(0, 3, 7, normals[1]),
      new THREE.Face3(7, 4, 0, normals[1])
    )

    // Return the finished geometry
    return cubeGeom
  }
}

// Export the CubeFactory class for use in other modules
export default CubeFactory
