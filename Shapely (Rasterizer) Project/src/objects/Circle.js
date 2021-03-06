// Import the Shape and Point objects
import Shape from './Shape'
import Point from './Point'

/* globals __DEV__ */

// Import the setPixel funciton for rasterizing
import { setPixel } from '../main'

// Import the transformPoint function from matrix_math
import { transformPoint } from '../matrix_math'

// Import ArrayBuffer object from the nanogl library
import ArrayBuffer from 'nanogl/arraybuffer'

/** @class A drawable 2D circle with variable radius */
class Circle extends Shape {
  /**
   * Create a new Circle shape object
   * @param {gl} WebGLRenderingContext The canvas element rendering context
   * @param {center} Point object Location of the center in global coords
   * @param {radius} number The radius of the circle
   * @param {C} Color object (default Color.WHITE)
   * @param {fill} boolean Is the shape filled or not (default true)
   */
  constructor (gl, center, radius, color, filled) {
    // Call parent constructor first
    super(color, filled)

    // Increase the global circle count
    Shape.shapeCount[Shape.SHAPE_TYPE.CIRCLE]++

    // Update properties inherited from Shape to be specific to circles
    this._type = Shape.SHAPE_TYPE.CIRCLE
    this._id = Shape.shapeCount[Shape.SHAPE_TYPE.CIRCLE]

    // New properties for this type of shape (public)
    this.center = center
    this.radius = radius

    // Call updateBuffers() once to initialize them
    this.updateBuffers(gl)
  }

  /**
   * Compute the center of this shape
   * This returns the center of the circle as the centroid
   * @return {Point} The center of the cirlce
   */
  computeCentroid () {
    return this.center
  }

  /**
   * Update the internal WebGL vertex buffers for this circle
   * Computes and stores the set of transformedvertices that will be used
   * to draw this shape using WebGL. The circle will be represented as a
   * set of triangles drawn as a 'triangle fan'
   * @param {gl} WebGLRenderingContext The canvas element rendering context
   */
  updateBuffers (gl) {
    // Raw data will be stored in this array
    let pointData = []

    // Variables to track our current angle and increment it
    let angle = 0
    let angleD = 2 * Math.PI / Circle.SLICES

    // Start at 0 rads and proceed to 2PI by 'angleD' increments
    for (let slice = 0; slice < Circle.SLICES; slice++) {
      // Compute point around circle at 'angle'
      // Note: Z is included even though it should always be 0
      //       This is because WebGL/OpenGL expects it
      let P = new Point(
        this.center.x + Math.cos(angle) * this.radius,
        this.center.y + Math.sin(angle) * this.radius,
        this.center.z)

      // Transform that point and add its data to the array
      let newP = transformPoint(P, this.M)
      pointData.push(newP.x, newP.y, newP.z)

      // Advance the angle
      angle += angleD
    }

    // Pack the vertex information into a single, typed array
    this._positions = new Float32Array(pointData)

    // Make the WebGL ArayBuffer for this shape (using nanoGL)
    this.buffer = new ArrayBuffer(gl, this._positions)
    this.buffer.attrib('aPosition', 3, gl.FLOAT)
  }

  // Overrides parent function to rasterize a circle using the Midpoint Circle Algorithm
  // Only uses integer arithmetic in the main loop
  rasterize () {
    // Transforms and rounds the center point
    let center = transformPoint(this.center, this.M)
    center.round()

    let centerX = center.x
    let centerY = center.y
    let x = this.radius - 1
    let y = 0
    let dx = 1
    let dy = 1
    let err = dx - (this.radius * 2)

    if (__DEV__) {
      console.log('Midpoint Circle Algorithm entered')
    }

    while (x >= y) {
      // Handles the filled and non-filled cases
      if (this.filled) {
        // Draws perfectly horizontal lines using paired points with the same y-values
        Shape.rasterizeHLine(centerX + x, centerX - x, centerY + y, this.color) // Pair 1
        Shape.rasterizeHLine(centerX + y, centerX - y, centerY + x, this.color) // Pair 2
        Shape.rasterizeHLine(centerX - x, centerX + x, centerY - y, this.color) // Pair 3
        Shape.rasterizeHLine(centerX - y, centerX + y, centerY - x, this.color) // Pair 4
      } else {
        // Draws each side of the circle in all 8 octants
        setPixel(new Point(centerX + x, centerY + y), this.color) // Pair 1
        setPixel(new Point(centerX + y, centerY + x), this.color) // Pair 2
        setPixel(new Point(centerX - y, centerY + x), this.color) // Pair 2
        setPixel(new Point(centerX - x, centerY + y), this.color) // Pair 1
        setPixel(new Point(centerX - x, centerY - y), this.color) // Pair 3
        setPixel(new Point(centerX - y, centerY - x), this.color) // Pair 4
        setPixel(new Point(centerX + y, centerY - x), this.color) // Pair 4
        setPixel(new Point(centerX + x, centerY - y), this.color) // Pair 3
      }

      if (err <= 0) {
        y++
        err += dy
        dy += 2
      }

      if (err > 0) {
        x--
        dx += 2
        err += -(this.radius * 2) + dx
      }
    }
  }
}

// The number of triangles (aka slices) in all Circle shapes
Circle.SLICES = 36

// Expose the Circle class to other modules for importing
export default Circle
