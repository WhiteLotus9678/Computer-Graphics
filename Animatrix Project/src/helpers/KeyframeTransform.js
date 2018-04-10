import Transform from './Transform'

/**
 * A child of Transform that adds the ability to clone other transform
 * Objects and to interpolate between them.
 */
class KeyframeTransform extends Transform {
  /**
    * @constructor
    * @param {Transform} copyMe - A transform to copy (must always be provided)!
    */
  constructor (copyMe) {
    // Inherit all the stuff from parent mesh
    super(copyMe._meshObj)

    // Copy the core properties from the other Transform object
    this._position.copy(copyMe._position)
    this._rotation.copy(copyMe._rotation)
    this._scale.copy(copyMe._scale)
    this._pivotPoint.copy(copyMe._pivotPoint)
  }

  /**
   * Create a new KeyframeTransformation that is the linear interpolation
   * of 'this' with Btrans using 'alpha'.
   * @this {KeyframeTransform} The 'previous' transform in the pair.
   * @param {KeyframeTransform} Btrans The 'next' transform in the pair.
   * @param {number} alpha A value between 0 and 1 used for interpolation.
   * @return {KeyframeTransform} The result of linearly interpolating
   */
  lerp (Btrans, alpha) {
    // Clone the current transform
    let interp = new KeyframeTransform(this)

    // Interpolate the four Vector3's stored in the transform (position, rotation, scale, and pivot point)
    // The ones stored in BTrans use the alpha value for interpolation
    // Interpolate the individual x, y and z values
    // Store the results in the cloned transform object, interp
    // interp = start + percent * (end - start)

    // Position
    interp.setPosition(
      this._position.x + alpha * (Btrans._position.x - this._position.x),
      this._position.y + alpha * (Btrans._position.y - this._position.y),
      this._position.z + alpha * (Btrans._position.z - this._position.z)
    )

    // Rotation
    interp.setRotation(
      this._rotation.x + alpha * (Btrans._rotation.x - this._rotation.x),
      this._rotation.y + alpha * (Btrans._rotation.y - this._rotation.y),
      this._rotation.z + alpha * (Btrans._rotation.z - this._rotation.z)
    )

    // Scale
    interp.setScale(
      this._scale.x + alpha * (Btrans._scale.x - this._scale.x),
      this._scale.y + alpha * (Btrans._scale.y - this._scale.y),
      this._scale.z + alpha * (Btrans._scale.z - this._scale.z)
    )

    // Pivot Point setPivot
    interp.setPivot(
      this._pivotPoint.x + alpha * (Btrans._pivotPoint.x - this._pivotPoint.x),
      this._pivotPoint.y + alpha * (Btrans._pivotPoint.y - this._pivotPoint.y),
      this._pivotPoint.z + alpha * (Btrans._pivotPoint.z - this._pivotPoint.z)
    )

    // Return the interpolated result
    return interp
  }
}

export default KeyframeTransform
