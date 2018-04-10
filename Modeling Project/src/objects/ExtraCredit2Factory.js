// Import the three.js library and components needed
import * as THREE from 'three'

// Parent class
import MeshFactory from './MeshFactory'

/**
 * A class to build some other procedural geometry for use with Three.js.
 * Can be implemented for extra credit. It is setup to accept up to three
 * subdivision parameters but you may not need all three (or any of them)
 * depending on what you create. Feel free to remove any unnecessary
 * parameters. You should also adjust the extra credit modal in index.html
 * to match whatever you remove.
 **/
class ExtraCredit2Factory extends MeshFactory {
  /**
   * Create a new Extra Credit 2 factory object that will use the given subdivision
   * parameters to tesselate the object appropriately.
   * @param {param1} number Some necessary subdivision parameter.
   * @param {param2} number Some other necessary subdivision parameter.
   * @param {param3} number Some third necessary subdivision parameter.
   **/
  constructor (param1, param2, param3) {
    super()
    this._name = 'Extra Credit 2'
    this._param1 = param1 || 10
    this._param2 = param2 || 10
    this._param3 = param3 || 10
  }

  /**
   * Set the subdivisions along some dimension for this object.
   * @param {newVal} number The number of subdivisions along some dimension.
   **/
  set param1 (newVal) {
    if (typeof newVal === 'number') {
      this._param1 = newVal
    }
  }

  /**
   * Set the subdivisions along some other dimension for this object.
   * @param {newVal} number The number of subdivisions along some other dimension.
   **/
  set param2 (newVal) {
    if (typeof newVal === 'number') {
      this._param2 = newVal
    }
  }

  /**
   * Set the subdivisions along some last dimension for this object.
   * @param {newVal} number The number of subdivisions along some last dimension.
   **/
  set param3 (newVal) {
    if (typeof newVal === 'number') {
      this._param3 = newVal
    }
  }

  /**
   * Build and return a THREE.Geometry() object representing some other object.
   * @override
   **/
  makeObjectGeometry () {
    // A fresh, empty Geometry object that will hold the mesh geometry
    var ec2Geom = new THREE.Geometry()

    // Return finished geometry
    return ec2Geom
  }
}

// Export the ExtraCredit2Factory class for use in other modules
export default ExtraCredit2Factory
