// Import the Shape and Point objects
import Shape from './Shape'
import Point from './Point'

// Import the transformPoint function from matrix_math
import { transformPoint } from '../matrix_math'

// Import ArrayBuffer object from the nanogl library
import ArrayBuffer from 'nanogl/arraybuffer'

/** @class A drawable 2D line */
class Line extends Shape {
  /**
   * Create a new Line shape object
   * @param {gl} WebGLRenderingContext The canvas element rendering context
   * @param {newP1} Point object Endpoint of the line in global coords
   * @param {newP2} Point object Other endpoint of the line in global coords
   * @param {C} Color object (default Color.WHITE)
   * @param {fill} boolean Is the shape filled or not (default true)
   */
  constructor (gl, newP1, newP2, color, filled) {
    // Call parent constructor first
    super(color, filled)

    // Increase the global line count
    Shape.shapeCount[Shape.SHAPE_TYPE.LINE]++

    // Update properties inherited from Shape to be specific to lines
    this._type = Shape.SHAPE_TYPE.LINE
    this._id = Shape.shapeCount[Shape.SHAPE_TYPE.LINE]

    // New properties for this type of shape (public)
    this.P1 = newP1
    this.P2 = newP2

    // Call updateBuffers() once to initialize them
    this.updateBuffers(gl)
  }

  /**
   * Compute the center of this shape
   * Computes and returns a reasonable value for the center of the line
   * @return {Point} The center of the line
   */
  computeCentroid () {
    // Computes a reasonable value for the center of the line, then returns
    // that value.
    return new Point(
      (this.P1.x + this.P2.x) / 2,
      (this.P1.y + this.P2.y) / 2,
      (this.P1.z + this.P2.z) / 2
    )
  }

  /**
   * Update the internal WebGL vertex buffers for this line
   * Stores the transformed endpoints in an ArrayBuffer so they may be used
   * to draw this shape using WebGL.
   * @param {gl} WebGLRenderingContext The canvas element rendering context
   */
  updateBuffers (gl) {
    // Transform the endpoints of the line by the matrix this.M
    // and store the result to new variables. The endpoints are
    // stored as this.P1 and this.P2.
    let P1 = transformPoint(this.P1, this.M)
    let P2 = transformPoint(this.P2, this.M)

    // Pack the transformed endpoints into a Float32Array and store
    // it in this._positions.
    this._positions = new Float32Array([
      P1.x, P1.y, P1.z,
      P2.x, P2.y, P2.z
    ])

    // Make the WebGL ArayBuffer for this shape (using nanoGL)
    this.buffer = new ArrayBuffer(gl, this._positions)
    this.buffer.attrib('aPosition', 3, gl.FLOAT)
  }
}

// Expose the Line class to other modules for importing
export default Line
