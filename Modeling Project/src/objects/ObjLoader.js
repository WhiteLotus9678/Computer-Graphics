// Import the three.js library and components needed
import * as THREE from 'three'
import 'three/examples/js/loaders/OBJLoader'
import '../helpers/localOBJLoader'

// Used to wrap the resulting geometry for use in a MeshWidget
import MeshFactory from './MeshFactory'

// A traditional JavaScript object with static functions used
// to load and parse an OBJ file from the local computer and
// convert it to a format for use by our MeshWidget.
let ObjLoader = {
  // Start the loading of a local obj file
  // NOTE: This requires the use of the 'localOBJLoader' in addition to
  // the usual OBJLoader that is part of Three.js
  loadAndAddOBJ: (fileBlob) => {
    console.log('Loading OBJ Model ...')
    var loader = new THREE.OBJLoader()
    loader.load2(fileBlob, ObjLoader.parseOBJResults)
  },

  // Parse the resulting obj Mesh loaded from the local computer
  parseOBJResults: (objHierarchy) => {
    // Extract all the geometry groups
    var mergedBBox = new THREE.Box3()
    mergedBBox.min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    mergedBBox.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE)

    // Rebuild geometry in proper format
    var geometryRoot = ObjLoader.convertObjHierarchy(objHierarchy, mergedBBox)
    geometryRoot.frustumCulled = false

    // Compute scale and center
    var boundingSphere = mergedBBox.getBoundingSphere()
    var scale = 1.1 / boundingSphere.radius
    var center = boundingSphere.center

    // Normalize geometry
    geometryRoot.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    geometryRoot.scale.set(scale, scale, scale)

    // Pass geometry to the 'ready' event callback
    ObjLoader.geometryReady(geometryRoot)
  },

  // Convert the hierarchy of the returned mesh into the format
  // expected by the MeshWidget object. Also computes a bounding
  // box for the entire hierarchy and stores it in mergedBBox.
  convertObjHierarchy: (objHierarchy, mergedBBox) => {
    // Build an empty Object3D to hold the new hierarchy
    var meshHierarchy = new THREE.Object3D()

    // Process all the children
    objHierarchy.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Convert child to standard 'Geometry'
        var newChild = MeshFactory.wrapGeometryWithMesh(
          new THREE.Geometry().fromBufferGeometry(child.geometry)
        )

        // Post-process the Geometry
        newChild.geometry.mergeVertices()
        newChild.geometry.computeBoundingBox()
        mergedBBox.union(newChild.geometry.boundingBox)

        // Add as child
        meshHierarchy.add(newChild)
      }
    })

    // Return the converted hierarchy
    return meshHierarchy
  },

  // Find the length of the diagonal of the bounding box
  findPrincipleAxisLength: (bbox) => {
    var lengths = [
      bbox.max.x - bbox.min.x,
      bbox.max.y - bbox.min.y,
      bbox.max.z - bbox.min.z
    ]

    return Math.sqrt(lengths[0] * lengths[0] +
      lengths[1] * lengths[1] + lengths[2] * lengths[2])
  },

  // Check if the 'onGeometryReady' function is set and call it if so.
  // NOTE: This is usally set in main.js or interface.js
  geometryReady: (geometry) => {
    if (ObjLoader.onGeometryReady) {
      ObjLoader.onGeometryReady(geometry)
    } else {
      console.error('No ObjLoader geometry ready event handler')
    }
  }
}

// Export the ObjLoader object for use in other modules
export default ObjLoader
