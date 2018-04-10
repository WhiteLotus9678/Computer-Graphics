// Import the three.js library and components needed
import * as THREE from 'three'

import Transform from './Transform'
import KeyframeTransform from './KeyframeTransform'

import config from '../config.js'

class AnimatableMesh extends THREE.Mesh {
  constructor (geometry, material, name) {
    super(geometry, material)

    if (typeof name !== 'undefined' && name !== '') {
      this.name = name
    }

    // Add keyframe map that will map from frame numbers to
    // KeyframeTransform objects
    this.keyframes = new Map()
    this.loadedFrame = -1

    // Add custom transform property
    this.transform = new Transform(this)
    this.matrixAutoUpdate = false
    this.transformIsDirty = false

    // Setup shadows
    this.castShadow = true
    this.receiveShadow = true
  }

  /**
   * Check if the currently loaded frame is a keyframe
   * @return {boolean} True if a key frame exists at 'this.loadedFrame'.
   */
  loadedFrameIsKeyFrame () {
    return this.frameIsKeyFrame(this.loadedFrame)
  }

  /**
   * Check if a particular frame is a key frame in the animation.
   * @param {number} frameNumber The frame to check
   * @return {boolean} True if the key frame at 'frameNumber' exists.
   */
  frameIsKeyFrame (frameNumber) {
    return this.keyframes.has(frameNumber)
  }

  /**
   * Save the current transformation as a key frame in the animation.
   * @param {number} frameNumber The number of the frame to save.
   */
  saveKeyframe (frameNumber) {
    if (frameNumber < 0 || frameNumber > config.MAX_FRAMES) {
      alert(`Bad frame number.  Must be between 1 and ${config.MAX_FRAMES}`)
      return
    }

    // Duplicate and store the keyframe transformation
    var clone = new KeyframeTransform(this.transform)
    this.keyframes.set(frameNumber, clone)
    this.loadedFrame = frameNumber
  }

  removeKeyframe (frameNumber) {
    if (this.frameIsKeyFrame(frameNumber)) {
      this.keyframes.delete(frameNumber)
    }
  }

  /**
   * Load a particular frame in the animation
   * @param {number} frameNumber The number of the frame to load.
   */
  loadFrame (frameNumber) {
    // Don't update if not needed (no frames in keyframes, requested already loaded)
    if (this.keyframes.size < 1 || this.loadedFrame === frameNumber) {
      return
    }

    // Is the requested frame a keyframe?  Then just load it
    if (this.keyframes.has(frameNumber)) {
      this.transform = this.keyframes.get(frameNumber)
      this.transform.apply()
      this.loadedFrame = frameNumber
      return
    }

    // Search for frame before and after the requested one
    var prev = frameNumber - 1
    while (prev >= 0) {
      if (this.keyframes.has(prev)) { break }
      prev--
    }

    var next = frameNumber + 1
    while (next <= config.MAX_FRAMES) {
      if (this.keyframes.has(next)) { break }
      next++
    }

    // Check what we found and interpolate
    if (prev < 0 && next > config.MAX_FRAMES) {
      // Apparently no keyframes exist yet
      this.transform.apply()
      this.loadedFrame = -1
    } else if (prev < 0) {
      // There is no previous keyframe
      if (this.loadedFrame !== next) {
        this.transform = this.keyframes.get(next)
        this.transform.apply()
        this.loadedFrame = next
      }
    } else if (next > config.MAX_FRAMES) {
      // There is no next keyframe
      if (this.loadedFrame !== prev) {
        this.transform = this.keyframes.get(prev)
        this.transform.apply()
        this.loadedFrame = prev
      }
    } else {
      // Interpolate between prev and next
      this.transform = this.interpolateFrames(frameNumber, prev, next,
        this.keyframes.get(prev), this.keyframes.get(next))
      this.transform.apply()
      this.loadedFrame = frameNumber
    }
  }

  /**
   * Interpolate between the transformations at two keyframes
   * @param {number} requestedFrameNum The number of the frame being computed.
   * @param {number} prevFrameNum The number of the first keyframe BEFORE the requested one.
   * @param {number} nextFrameNum The number of the first keyframe AFTER the requested one.
   * @param {KeyframeTransform} prevTrans The transformation stored for 'prevFrameNum' keyframe.
   * @param {KeyframeTransform} nextTrans The transformation stored for 'nextFrameNum' keyframe.
   * @return {KeyframeTransform} The result of linearly interpolating between prevTrans and nextTrans.
   */
  interpolateFrames (requestedFrameNum, prevFrameNum, nextFrameNum, prevTrans, nextTrans) {
    // Computing the alpha value
    // Frame A <---------> Frame C <---------> Frame B
    let alpha = (requestedFrameNum - prevFrameNum) / (nextFrameNum - prevFrameNum) // (C - A) / (B - A)

    // Return an interpolated transform object
    return prevTrans.lerp(nextTrans, alpha)
  }
}

// Make AnimatableMesh available for import in other modules
export default AnimatableMesh
