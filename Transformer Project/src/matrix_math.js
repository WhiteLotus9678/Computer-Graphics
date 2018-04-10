// Import the Point object
import Point from './objects/Point'

//   - makeIdentityMatrix ()
// A function to return an 3x3 identity matrix
export function makeIdentityMatrix () {
  let I = [1, 0, 0, 0, 1, 0, 0, 0, 1]

  return I
}

//   - makeTranslationMatrix (tX, tY)
// A function to create a translation matrix
export function makeTranslationMatrix (tX, tY) {
  let T = [1, 0, 0, 0, 1, 0, tX, tY, 1]

  return T
}

//   - makeScaleMatrix (sX, sY)
// A function to create a scale matrix
export function makeScaleMatrix (sX, sY) {
  let S = [sX, 0, 0, 0, sY, 0, 0, 0, 1]

  return S
}

//   - makeRotationMatrix (thetaInDegrees)
// A function to create a rotation matrix
export function makRotationMatrix (angle) {
  // Converting from degrees to radians because the trigonometric
  // functions accepts radians as input
  angle = angle * (Math.PI / 180)

  let R = [Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 1]

  return R
}

//   - makeShearMatrix (shX, shY)
// A function to create a shear matrix
export function makeShearMatrix (shX, shY) {
  let S = [1, shY, 0, shX, 1, 0, 0, 0, 1]

  return S
}

// Each function constructs a particular matrix as suggested
// by its name and then returns that matrix. The matrix is stored
// as a single-dimensional array of 9 values in COLUMN-MAJOR
// order (see instructions for more details)

//   - multiplyMatrices (M1, M2)
// A function to multiply two 3x3 matrices
// The two parameters are themselves 3x3 matrices stored as single-
// dimensional arrays in column-major order. The 3x3 matrix
// (as a colum-major array) and fill it with the result of
// multiplying M1 by M2 in that order. Return that new array.

export function multiplyMatrices (M1, M2) {
  // Column-major matrix multiplied by another column-major matrix
  let M3 = [
    (M1[0] * M2[0]) + (M1[3] * M2[1]) + (M1[6] * M2[2]), // 0
    (M1[1] * M2[0]) + (M1[4] * M2[1]) + (M1[7] * M2[2]), // 3
    (M1[2] * M2[0]) + (M1[5] * M2[1]) + (M1[8] * M2[2]), // 6

    (M1[0] * M2[3]) + (M1[3] * M2[4]) + (M1[6] * M2[5]), // 1
    (M1[1] * M2[3]) + (M1[4] * M2[4]) + (M1[7] * M2[5]), // 4
    (M1[2] * M2[3]) + (M1[5] * M2[4]) + (M1[8] * M2[5]), // 7

    (M1[0] * M2[6]) + (M1[3] * M2[7]) + (M1[6] * M2[8]), // 2
    (M1[1] * M2[6]) + (M1[4] * M2[7]) + (M1[7] * M2[8]), // 5
    (M1[2] * M2[6]) + (M1[5] * M2[7]) + (M1[8] * M2[8]) // 8
  ]

  return M3
}

//   - transformPoint (P, M)
// A function to transform a point by a matrix
// The math is simple matrix-vector multiplication and returns the
// new/transformed point.
// No P.z because the z-axis isn't affected, plus we need an extra
// fake dimension for translation.
export function transformPoint (P, M) {
  return new Point(
    ((P.x * M[0]) + (P.y * M[3]) + (M[6])),
    ((P.x * M[1]) + (P.y * M[4]) + (M[7]))
  )
}

//   - rebuildTransformationMatrix (shape)
// A function to build the composite transformation for a given shape
// object.
// The 'shape' passed to this function will have the following props:
//   - shape.tx & shape.ty for translation properties
//   - shape.sx & shape.sy for scale properties
//   - shape.rotAngle & shape.rotAroundCenter for rotation properties
//   - shape.shx & shape.shy for shear properties
// The resulting matrix is then stored on the 'shape' object as 'shape.M'
export function rebuildTransformationMatrix (shape) {
  let c = shape.computeCentroid()

  shape.M = makeTranslationMatrix(shape.tx, shape.ty)
  shape.T = makeTranslationMatrix(c.x, c.y)
  shape.N = makeTranslationMatrix(-c.x, -c.y)
  shape.R = makRotationMatrix(shape.rotAngle)
  shape.S = makeScaleMatrix(shape.sx, shape.sy)
  shape.H = makeShearMatrix(shape.shx, shape.shy)

  if (shape.rotAroundCenter === true) {
    shape.M = multiplyMatrices(shape.M, shape.T)
    shape.M = multiplyMatrices(shape.M, shape.R)
    shape.M = multiplyMatrices(shape.M, shape.H)
    shape.M = multiplyMatrices(shape.M, shape.S)
    shape.M = multiplyMatrices(shape.M, shape.N)
  } else {
    shape.M = multiplyMatrices(shape.M, shape.R)
    shape.M = multiplyMatrices(shape.M, shape.T)
    shape.M = multiplyMatrices(shape.M, shape.H)
    shape.M = multiplyMatrices(shape.M, shape.S)
    shape.M = multiplyMatrices(shape.M, shape.N)
  }
}

/**
 * Generate an orthographic projeciton matrix (2D or 3D) for use
 * in defining the cannonical viewing volume for the current scene.
 * Can be used as a projection matrix in a shader.
 * @param {b} number The location of the BOTTOM of the view volume
 * @param {t} number The location of the TOP of the view volume
 * @param {l} number The location of the LEFT of the view volume
 * @param {r} number The location of the RIGHT of the view volume
 * @param {n} number The location of the NEAR face of the view
 *                   volume (optional, defaults to -1)
 * @param {f} number The location of the FAR face of the view
 *                   volume (optional, defaults to 1)
 */
export function orthoMatrix (b, t, l, r, n, f) {
  // Default values for near and far (assuming 2D projeciton)
  n = (typeof n !== 'undefined') ? n : -1.0
  f = (typeof f !== 'undefined') ? f : 1.0

  // Pre-compute matrix values
  var A1 = 2 / (r - l)
  var B1 = 2 / (t - b)
  var C1 = -2 / (f - n)
  var A2 = -(r + l) / (r - l)
  var B2 = -(t + b) / (t - b)
  var C2 = -(f + n) / (f - n)

  // Build orthographic projection matrix in col-major order
  var M = [
    A1, 0, 0, 0,
    0, B1, 0, 0,
    0, 0, C1, 0,
    A2, B2, C2, 1
  ]

  // Return matrix
  return M
}
