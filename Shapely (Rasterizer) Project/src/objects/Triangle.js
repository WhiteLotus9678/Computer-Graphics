// Import the Shape, Point and Line objects
import Shape from './Shape'
import Point from './Point'
import Line from './Line'

/* globals __DEV__ */

// Import the transformPoint function from matrix_math
import { transformPoint } from '../matrix_math'

// Import ArrayBuffer object from the nanogl library
import ArrayBuffer from 'nanogl/arraybuffer'

/** @class A drawable 2D triangle */
class Triangle extends Shape {
  /**
   * Create a new Triangle shape object
   * @param {gl} WebGLRenderingContext The canvas element rendering context
   * @param {newP1} Point object First triangle vertex in global coords
   * @param {newP2} Point object Second triangle vertex in global coords
   * @param {newP3} Point objec
   * t Third triangle vertex in global coords
   * @param {C} Color object (default Color.WHITE)
   * @param {fill} boolean Is the shape filled or not (default true)
   */
  constructor (gl, newP1, newP2, newP3, color, filled) {
    // Call parent constructor first
    super(color, filled)

    // Increase the global triangle count
    Shape.shapeCount[Shape.SHAPE_TYPE.TRIANGLE]++

    // Update properties inherited from Shape to be specific to triangles
    this._type = Shape.SHAPE_TYPE.TRIANGLE
    this._id = Shape.shapeCount[Shape.SHAPE_TYPE.TRIANGLE]

    // New properties for this type of shape (public)
    this.P1 = newP1
    this.P2 = newP2
    this.P3 = newP3

    // Call updateBuffers() once to initialize them
    this.updateBuffers(gl)
  }

  /**
   * Compute the center of this shape
   * Averages the vertices together
   * @return {Point} The average of the three vertices
   */
  computeCentroid () {
    return new Point(
      (this.P1.x + this.P2.x + this.P3.x) / 3,
      (this.P1.y + this.P2.y + this.P3.y) / 3,
      (this.P1.z + this.P2.z + this.P3.z) / 3
    )
  }

  /**
   * Update the internal WebGL vertex buffers for this triangle
   * Stores the transformed vertices in an ArrayBuffer so they may be used
   * to draw this shape using WebGL.
   * @param {gl} WebGLRenderingContext The canvas element rendering context
   */
  updateBuffers (gl) {
    // Transform the three vertices
    let P1 = transformPoint(this.P1, this.M)
    let P2 = transformPoint(this.P2, this.M)
    let P3 = transformPoint(this.P3, this.M)

    // Pack the vertex information into a single, typed array
    // Note: Z is included even though it should always be 0
    //       This is because WebGL/OpenGL expects it
    this._positions = new Float32Array([
      P1.x, P1.y, P1.z,
      P2.x, P2.y, P2.z,
      P3.x, P3.y, P3.z
    ])

    // Make the WebGL ArayBuffer for this shape (using nanoGL)
    this.buffer = new ArrayBuffer(gl, this._positions)
    this.buffer.attrib('aPosition', 3, gl.FLOAT)
  }

  // Overrides parent function to rasterize a triangle
  rasterize () {
    // Transforms and rounds the vertices
    let P1 = transformPoint(this.P1, this.M)
    let P2 = transformPoint(this.P2, this.M)
    let P3 = transformPoint(this.P3, this.M)
    P1.round()
    P2.round()
    P3.round()

    // Sorts the points according in increasing to their y values
    // P1 = lowest point
    // P2 = middle point
    // P3 = highest point
    let points = [ P1, P2, P3 ]
    points.sort((a, b) => {
      return a.y - b.y
    })

    P1 = points[0]
    P2 = points[1]
    P3 = points[2]

    let x1 = P1.x
    let x2 = P2.x
    let x3 = P3.x
    let y1 = P1.y
    let y2 = P2.y
    let y3 = P3.y

    if (__DEV__) {
      console.log('Begin filling in triangle')
    }

    // Handles the filled and non-filled cases
    if (this.filled) {
      let x12 = x1
      let x13 = x1
      let y = y1

      let dy12 = y2 - y1
      let dx12 = x2 - x1

      let dy13 = y3 - y1
      let dx13 = x3 - x1

      let mInv12 = dx12 / dy12
      let mInv13 = dx13 / dy13

      // Draws perfectly horizontal lines from the lowest Point to the Point in the middle of all three Points
      while (y < y2) {
        Shape.rasterizeHLine(Math.round(x12), Math.round(x13), y, this.color)
        y++
        x13 += mInv13
        x12 += mInv12
      }

      // Draws the triangle's outline using its three vertices
      Line.bresenham(P1, P2, this.color)
      Line.bresenham(P2, P3, this.color)
      Line.bresenham(P3, P1, this.color)

      let x31 = x3
      let x32 = x3
      y = y3

      let dy31 = y3 - y1
      let dx31 = x3 - x1

      let dy32 = y3 - y2
      let dx32 = x3 - x2

      let mInv31 = dx31 / dy31
      let mInv32 = dx32 / dy32

      // Draws perfectly horizontal lines from the highest Point to the Point in the middle of all three Points
      while (y >= y2) {
        Shape.rasterizeHLine(Math.round(x31), Math.round(x32), y, this.color)
        y--
        x31 -= mInv31
        x32 -= mInv32
      }
    } else {
      // Draws the triangle's outline using its three vertices
      Line.bresenham(P1, P2, this.color)
      Line.bresenham(P2, P3, this.color)
      Line.bresenham(P3, P1, this.color)
    }
  }
}

// Expose the Triangle class to other modules for importing
export default Triangle
