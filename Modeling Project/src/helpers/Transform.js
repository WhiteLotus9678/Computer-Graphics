// Import the three.js library
import * as THREE from 'three'

/**
 * Object to hold and update a basic 3D transformation. It has
 * scale, translation and rotation about a pivot point.
 **/
class Transform {
  /**
   * Construct a new Transform object for the given mesh object
   * @param {THREE.Mesh} parentMesh The mesh object that is controlled
   * by this particular transform (auto-updated when changed).
   **/
  constructor (parentMesh) {
    // Treat these as private internal members accessed through
    // the setters and getters listed below.
    this._position = new THREE.Vector3(0.0, 0.0, 0.0)
    this._scale = new THREE.Vector3(1.0, 1.0, 1.0)
    this._rotation = new THREE.Vector3(0.0, 0.0, 0.0)
    this._pivotPoint = new THREE.Vector3(0.0, 0.0, 0.0)

    // The mesh object that uses this transformation
    this._meshObj = parentMesh
  }

  /**
   * Return the position which represents this object's TRANSLATION
   * @return {THREE.Vector3} Vector that holds the translation parameters
   **/
  get position () {
    return this._position
  }

  /**
   * Return the values for the sacle of this transformation
   * @return {THREE.Vector3} Vector that holds the scale parameters
   **/
  get scale () {
    return this._scale
  }

  /**
   * NOTE: Remember to keep in mind DEGREES vs RADIANS
   * Return the values for the rotation angles of this transformation
   * @return {THREE.Vector3} Vector that holds the rotation angles in RADIANS
   **/
  get rotation () {
    return this._rotation
  }

  /**
   * Return the center of rotation (pivot point) for this transformation
   * @return {THREE.Vector3} Vector that holds the location of the pivot point
   **/
  get pivot () {
    return this._pivotPoint
  }

  /**
   * Change the 'position' (aka translation) and update the world matrix
   * @param {Number} x - The x translation value
   * @param {Number} y - The y translation value
   * @param {Number} z - The z translation value
   */
  setPosition (x, y, z) {
    this._position.set(x, y, z)
    this._meshObj.matrix = this.rebuildMatrix()
    this._meshObj.matrixWorldNeedsUpdate = true
  }

  /**
   * Change the 'rotation' as Euler angles and update the world matrix
   * @param {Number} x - The x rotation angle in radians
   * @param {Number} y - The y rotation angle in radians
   * @param {Number} z - The z rotation angle in radians
   */
  setRotation (x, y, z) {
    this._rotation.set(x, y, z)
    this._meshObj.matrix = this.rebuildMatrix()
    this._meshObj.matrixWorldNeedsUpdate = true
  }

  /**
   * Change the scale values and update the world matrix
   * @param {Number} x - The x scaling value
   * @param {Number} y - The y scaling value
   * @param {Number} z - The z scaling value
   */
  setScale (x, y, z) {
    this._scale.set(x, y, z)
    this._meshObj.matrix = this.rebuildMatrix()
    this._meshObj.matrixWorldNeedsUpdate = true
  }

  /**
   * Change the pivot point for rotation and update the world matrix
   * @param {Number} x - The x-dimension of the pivot point
   * @param {Number} y - The y-dimension of the pivot point
   * @param {Number} z - The z-dimension of the pivot point
   */
  setPivot (x, y, z) {
    this._pivotPoint.set(x, y, z)
    this._meshObj.matrix = this.rebuildMatrix()
    this._meshObj.matrixWorldNeedsUpdate = true
  }

  /**
   * Rebuild the full transformation as a single 3D matrix and return the result.
   * @return {THREE.Matrix4} The 3d matrix that achieves this transformation
   */
  rebuildMatrix () {
    // Scale The Object
    var S = new THREE.Matrix4().makeScale(
      this._scale.x, this._scale.y, this._scale.z)

    // Away From Pivot
    var F = new THREE.Matrix4().makeTranslation(
      -this._pivotPoint.x, -this._pivotPoint.y, -this._pivotPoint.z)

    // Rotate On Z-Axis
    var Z = new THREE.Matrix4().makeRotationZ(this._rotation.z)

    // Rotate On Y-Axis
    var Y = new THREE.Matrix4().makeRotationY(this._rotation.y)

    // Rotate On X-Axis
    var X = new THREE.Matrix4().makeRotationX(this._rotation.x)

    // Back To Pivot
    var P = new THREE.Matrix4().makeTranslation(
      this._pivotPoint.x, this._pivotPoint.y, this._pivotPoint.z)

    // Translate The Object
    var T = new THREE.Matrix4().makeTranslation(
      this._position.x, this._position.y, this._position.z)

    // Multiple all of the matrices together in the correct order
    // Must be combined in this order, left to right:
    //   - Scale
    //   - Translate from pivot point
    //   - Rotate around Z
    //   - Rotate around Y
    //   - Rotate around X
    //   - Translate to pivot point
    //   - Translation
    var M = new THREE.Matrix4().multiplyMatrices(S, F)

    M.multiply(Z)
    M.multiply(Y)
    M.multiply(X)
    M.multiply(P)
    M.multiply(T)

    // Return the final combined matrix
    return M
  }
}

export default Transform
