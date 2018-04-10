// Import the three.js library and components needed
import * as THREE from 'three'

// Import our custom Transform object to add to the Meshes
import Transform from '../helpers/Transform'

/**
 * A base class providing essential functionality for converting
 * THREE.Geometry() and THREE.Mesh() objects to be used in outwards
 * MeshWidget rendering system. These objects must be properly
 * encapsulated and/or decorated before they will work correctly
 * with MeshWidget.
 *
 * You should inherit from this class and override either
 * makeObjectGeometry (if you are generating a triangle mesh) or
 * generateMesh() of you are generating a hierarchical mesh.
 **/
class MeshFactory {
  constructor () {
    this._count = 0
  }

  /**
   * Generate a THREE.Geometry object with proper vertices, normals and
   * faces to represent the object you want to make.
   * @abstract
   **/
  makeObjectGeometry () {
    console.error('Abstract MeshFactory.makeObjectGeometry called')
    return null
  }

  /**
   * Generate a THREE.Mesh by calling makeObjectGeometry and combining the
   * returned geometry with the solidShader in the meshWidget. The mesh is
   * then configured and decorated with our own Transform object used to
   * construct and manage 3D transformations manually.
   * @virtual
   **/
  generateMesh () {
    // Build the geometry associated with this factory
    let geometry = this.makeObjectGeometry()
    if (geometry === null) { return null }
    geometry.computeBoundingSphere()
    geometry.verticesNeedUpdate = true
    geometry.normalsNeedUpdate = true
    geometry.elementsNeedUpdate = true

    // Construct the Three.js Mesh object
    let mesh = new THREE.Mesh(geometry, MeshFactory.widget._solidMaterial)
    mesh.name = this._name

    // Add custom transform property
    mesh.transform = new Transform(mesh)
    mesh.matrixAutoUpdate = false

    // Setup shadows
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Return the complete mesh object
    return mesh
  }
}

/**
 * Encapsulate a basic THREE.Geometry object with a mesh combined with
 * the solidMaterial from our mesh widget. Also decorate the resulting
 * THREE.mesh for use with that meshWidget.
 * @param {geometry} THREE.Geometry Triangle mesh to be placed inside a THREE.Mesh object.
 * @param {name} string name to apply to this mesh (displayed in the GUI).
 * @return {THREE.Mesh} An new mesh object containing the geometry for use with MeshWidget.
 * @static
 **/
MeshFactory.wrapGeometryWithMesh = (geometry, name) => {
  var mesh = new THREE.Mesh(geometry, MeshFactory.widget._solidMaterial)
  if (typeof name !== 'undefined' && name !== '') {
    mesh.name = name
  }

  // Add custom transform property
  mesh.transform = new Transform(mesh)
  mesh.matrixAutoUpdate = false

  // Setup shadows
  mesh.castShadow = true
  mesh.receiveShadow = true

  return mesh
}

/**
 * Create an EMPTY THREE.Mesh object for use with the meshWidget. It has
 * NO geometry but can be used for transformation in the scene graph.
 * @param {name} string name to apply to this mesh (displayed in the GUI).
 * @return {THREE.Mesh} An empty mesh object ready for use with MeshWidget.
 * @static
 **/
MeshFactory.generateEmptyNode = (name) => {
  return MeshFactory.wrapGeometryWithMesh(new THREE.Geometry(), name)
}

/**
 * Insert a new empty node between the given mesn and its children and
 * make that mesh a child of this new empty node. The scale will be left
 * on the mesh but all other transformation properties are removed and
 * applied to the empty node so they will still affect the children.
 * @param {mesh} THREE.Mesh Mesh with scaling you want to isolate.
 * @return {THREE.Mesh} a new empty node with the given mesh as its child.
 * @static
 **/
MeshFactory.isolateScale = (mesh) => {
  // Generate a new node for isolation of scale
  let isolater = MeshFactory.generateEmptyNode(mesh.name)
  mesh.name = `${mesh.name} Geom`

  // Is the mesh being isolated already part of the scene hierarchy
  if (mesh.parent !== null) {
    // Remove the mesh from the parent's list of children
    let oldParent = mesh.parent
    oldParent.remove(mesh)

    // Insert the newParent into the space spot
    oldParent.add(isolater)
  }

  // Move the mesh into a child of the isolation node
  isolater.add(mesh)

  // Manually copy out the translation and rotation from the old mesh
  let translate = mesh.transform.position
  let rotate = mesh.transform.rotation
  let pivot = mesh.transform.pivot

  isolater.transform.setPosition(translate.x, translate.y, translate.z)
  isolater.transform.setRotation(rotate.x, rotate.y, rotate.z)
  isolater.transform.setPivot(pivot.x, pivot.y, pivot.z)

  // Clear these values on the old mesh
  mesh.transform.setPosition(0, 0, 0)
  mesh.transform.setRotation(0, 0, 0)
  mesh.transform.setPivot(0, 0, 0)

  return isolater
}

// Reference to the MeshWidget that will use this factory.
// This is needed to setup the materials when making Mesh objects.
MeshFactory.widget = null

// Export the MeshFactory class for use in other modules
export default MeshFactory
