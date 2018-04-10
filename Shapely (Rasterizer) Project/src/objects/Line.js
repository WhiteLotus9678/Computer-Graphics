// Import the Shape and Point objects
import Shape from './Shape'
import Point from './Point'

// Import the setPixel funciton for rasterizing
import { setPixel } from '../main'

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

  // Overrides parent function to rasterize a line using only integer arithmetic in the main loop
  // Only uses integer arithmetic in the main loop
  rasterize () {
    // Transforms and rounds the endpoints
    let P1 = transformPoint(this.P1, this.M)
    let P2 = transformPoint(this.P2, this.M)
    P1.round()
    P2.round()

    // Calls Line.bresenham (defined below) with the ROUNDED points
    Line.bresenham(P1, P2, this.color)
  }
}

// Rasterizes a general line using Bresenham's algorithm
Line.bresenham = function (P1, P2, color) {
  // Split up the Point coordinates into their respective x and y values
  let x1 = P1.x
  let x2 = P2.x
  let y1 = P1.y
  let y2 = P2.y

  // Handles perfectly horizontal and vertical lines as special cases
  // Checks if the corresponding x or y values are the same
  if (y1 === y2) {
    Shape.rasterizeHLine(x1, x2, y1, color)
  } else if (x1 === x2) {
    Shape.rasterizeVLine(x1, y1, y2, color)
  } else {
    let temp

    // Checks if the slope of the line is more than 1
    // If true, we swap the x and y values of each point
    let xySwapped = false
    if (Math.abs(y2 - y1) > Math.abs(x2 - x1)) {
      xySwapped = true

      temp = x1
      x1 = y1
      y1 = temp

      temp = x2
      x2 = y2
      y2 = temp
    }

    // Checks if the Point 1 was drawn close to the right side of the screen
    // If true, swap the x and y values of Point 1 & 2 with each other
    if (x1 > x2) {
      temp = x1
      x1 = x2
      x2 = temp

      temp = y1
      y1 = y2
      y2 = temp
    }

    // Check if the slope of the line is negative
    // If true, then we decrement y
    let negativeY = false
    if ((y2 - y1) < 0) {
      negativeY = true
    }

    let dy = Math.abs(y2 - y1)
    let dx = x2 - x1

    let err = (2 * dy) - dx
    let dErrSame = 2 * dy
    let dErrUp = 2 * (dy - dx)

    let y = y1

    for (let x = x1; x <= x2; x++) {
      if (xySwapped) {
        setPixel(new Point(y, x), color)
      } else {
        setPixel(new Point(x, y), color)
      }
      if (err > 0) {
        if (negativeY) {
          y--
        } else {
          y++
        }
        err += dErrUp
      } else {
        err += dErrSame
      }
    }
  }
}

// Expose the Line class to other modules for importing
export default Line
