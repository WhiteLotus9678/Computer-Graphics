import HumanoidFactory from './HumanoidFactory'

/**
 * A class to animate the humanoid mesh.
 **/
class AnimationFactory {
  /**
   * Create a new AnimationFactory object.
   **/
  constructor () {
    // Make an instance of the HumanoidFactory
    this._humanoidMaker = new HumanoidFactory()
  }

  /**
   * Extract references to nodes in the hierarchy that contain a particular sub-name
   * in their name parameter.
   *
   * @param {AnimatableMesh} humanoid The hierarchical mesh to Traverse
   * @param {string} subName The name to match and extract from the hierarchy
   * @return {Array} An array of references to meshes in the hierarchy that contain
   *    the specified subName in their name parameter.
   **/
  extractNamedNodes (humanoid, name) {
    // An array to hold the extracted node
    let nodes = []

    // Traverse the entire hierarchy
    humanoid.traverse((node) => {
      // If the name contains the given sub-name, then grab it
      // Note: we ignore ones with 'Geom' because those are from isolateScale
      if (node.name.includes(name) && !node.name.includes('Geom')) {
        nodes.push(node)
        console.log(node) // or breakpoint in UI to show which one is in the array
      }
    })

    // Return an array of the extracted nodes
    return nodes
  }

  /**
   * Generate an animated humanoid that walks.
   * @return {AnimatableMesh} A humanoid with a pre-programed walk animation
   **/
  generateWalk () {
    // Create a new humanoid object using my factory
    let humanoid = this._humanoidMaker.generateMesh()
    humanoid.name = `Walking ${humanoid.name}`

    // Create a new arms array object after searching for any nodes named 'Arm' in my factory
    // arms[0] = Right Arm
    // arms[1] = R Arm
    // arms[2] = Left Arm
    // arms[3] = L Arm
    let arms = this.extractNamedNodes(humanoid, 'Arm')

    // Create a new legs array object after searching for any nodes named 'Leg' in my factory
    // legs[0] = Left Leg
    // legs[1] = L Leg
    // legs[2] = Right Leg
    // legs[3] = R Leg
    let legs = this.extractNamedNodes(humanoid, 'Leg')

    // Frame 0
    humanoid.transform.setPosition(0.0, 0.0, -3.0)
    humanoid.saveKeyframe(0)
    arms[0].transform.setRotation(0, 0, 0)
    arms[0].saveKeyframe(0)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(0)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(0)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(0)

    // Frame 4
    humanoid.transform.setPosition(0.0, 0.0, -2.8)
    humanoid.saveKeyframe(4)
    arms[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(4)
    arms[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(4)
    legs[0].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(4)
    legs[2].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(4)

    // Frame 8
    humanoid.transform.setPosition(0.0, 0.0, -2.6)
    humanoid.saveKeyframe(8)
    arms[0].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(8)
    arms[2].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(8)
    legs[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(8)
    legs[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(8)

    // Frame 12
    humanoid.transform.setPosition(0.0, 0.0, -2.4)
    humanoid.saveKeyframe(12)
    arms[0].transform.setRotation(-50 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(12)
    arms[2].transform.setRotation(50 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(12)
    legs[0].transform.setRotation(-15 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(12)
    legs[2].transform.setRotation(15 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(12)

    // Frame 16
    humanoid.transform.setPosition(0.0, 0.0, -2.2)
    humanoid.saveKeyframe(16)
    arms[0].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(16)
    arms[2].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(16)
    legs[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(16)
    legs[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(16)

    // Frame 20
    humanoid.transform.setPosition(0.0, 0.0, -2.0)
    humanoid.saveKeyframe(20)
    arms[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(20)
    arms[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(20)
    legs[0].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(20)
    legs[2].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(20)

    // Frame 24
    humanoid.transform.setPosition(0.0, 0.0, -1.8)
    humanoid.saveKeyframe(24)
    arms[0].transform.setRotation(0, 0, 0)
    arms[0].saveKeyframe(24)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(24)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(24)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(24)

    // Frame 28
    humanoid.transform.setPosition(0.0, 0.0, -1.6)
    humanoid.saveKeyframe(28)
    arms[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(28)
    arms[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(28)
    legs[0].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(28)
    legs[2].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(28)

    // Frame 32
    humanoid.transform.setPosition(0.0, 0.0, -1.4)
    humanoid.saveKeyframe(32)
    arms[0].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(32)
    arms[2].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(32)
    legs[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(32)
    legs[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(32)

    // Frame 36
    humanoid.transform.setPosition(0.0, 0.0, -1.2)
    humanoid.saveKeyframe(36)
    arms[0].transform.setRotation(50 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(36)
    arms[2].transform.setRotation(-50 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(36)
    legs[0].transform.setRotation(15 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(36)
    legs[2].transform.setRotation(-15 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(36)

    // Frame 40
    humanoid.transform.setPosition(0.0, 0.0, -1.0)
    humanoid.saveKeyframe(40)
    arms[0].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(40)
    arms[2].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(40)
    legs[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(40)
    legs[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(40)

    // Frame 44
    humanoid.transform.setPosition(0.0, 0.0, -0.8)
    humanoid.saveKeyframe(44)
    arms[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(44)
    arms[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(44)
    legs[0].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(44)
    legs[2].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(44)

    // Frame 48
    humanoid.transform.setPosition(0.0, 0.0, -0.6)
    humanoid.saveKeyframe(48)
    arms[0].transform.setRotation(0, 0, 0)
    arms[0].saveKeyframe(48)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(48)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(48)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(48)

    // Frame 52
    humanoid.transform.setPosition(0.0, 0.0, -0.4)
    humanoid.saveKeyframe(52)
    arms[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(52)
    arms[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(52)
    legs[0].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(52)
    legs[2].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(52)

    // Frame 56
    humanoid.transform.setPosition(0.0, 0.0, -0.2)
    humanoid.saveKeyframe(56)
    arms[0].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(56)
    arms[2].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(56)
    legs[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(56)
    legs[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(56)

    // Frame 60
    humanoid.transform.setPosition(0.0, 0.0, 0.0)
    humanoid.saveKeyframe(60)
    arms[0].transform.setRotation(-50 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(60)
    arms[2].transform.setRotation(50 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(60)
    legs[0].transform.setRotation(-15 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(60)
    legs[2].transform.setRotation(15 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(60)

    // Frame 64
    humanoid.transform.setPosition(0.0, 0.0, 0.2)
    humanoid.saveKeyframe(64)
    arms[0].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(64)
    arms[2].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(64)
    legs[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(64)
    legs[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(64)

    // Frame 68
    humanoid.transform.setPosition(0.0, 0.0, 0.4)
    humanoid.saveKeyframe(68)
    arms[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(68)
    arms[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(68)
    legs[0].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(68)
    legs[2].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(68)

    // Frame 72
    humanoid.transform.setPosition(0.0, 0.0, 0.6)
    humanoid.saveKeyframe(72)
    arms[0].transform.setRotation(0, 0, 0)
    arms[0].saveKeyframe(72)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(72)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(72)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(72)

    // Frame 76
    humanoid.transform.setPosition(0.0, 0.0, 0.8)
    humanoid.saveKeyframe(76)
    arms[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(76)
    arms[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(76)
    legs[0].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(76)
    legs[2].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(76)

    // Frame 80
    humanoid.transform.setPosition(0.0, 0.0, 1.0)
    humanoid.saveKeyframe(80)
    arms[0].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(80)
    arms[2].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(80)
    legs[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(80)
    legs[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(80)

    // Frame 84
    humanoid.transform.setPosition(0.0, 0.0, 1.2)
    humanoid.saveKeyframe(84)
    arms[0].transform.setRotation(50 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(84)
    arms[2].transform.setRotation(-50 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(84)
    legs[0].transform.setRotation(15 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(84)
    legs[2].transform.setRotation(-15 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(84)

    // Frame 88
    humanoid.transform.setPosition(0.0, 0.0, 1.4)
    humanoid.saveKeyframe(88)
    arms[0].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(88)
    arms[2].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(88)
    legs[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(88)
    legs[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(88)

    // Frame 92
    humanoid.transform.setPosition(0.0, 0.0, 1.6)
    humanoid.saveKeyframe(92)
    arms[0].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(92)
    arms[2].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(92)
    legs[0].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(92)
    legs[2].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(92)

    // Frame 96
    humanoid.transform.setPosition(0.0, 0.0, 1.8)
    humanoid.saveKeyframe(96)
    arms[0].transform.setRotation(0, 0, 0)
    arms[0].saveKeyframe(96)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(96)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(96)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(96)

    // Frame 100
    humanoid.transform.setPosition(0.0, 0.0, 2.0)
    humanoid.saveKeyframe(100)
    arms[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(100)
    arms[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(100)
    legs[0].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(100)
    legs[2].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(100)

    // Frame 104
    humanoid.transform.setPosition(0.0, 0.0, 2.2)
    humanoid.saveKeyframe(104)
    arms[0].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(104)
    arms[2].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(104)
    legs[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(104)
    legs[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(104)

    // Frame 108
    humanoid.transform.setPosition(0.0, 0.0, 2.4)
    humanoid.saveKeyframe(108)
    arms[0].transform.setRotation(-50 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(108)
    arms[2].transform.setRotation(50 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(108)
    legs[0].transform.setRotation(-15 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(108)
    legs[2].transform.setRotation(15 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(108)

    // Frame 112
    humanoid.transform.setPosition(0.0, 0.0, 2.6)
    humanoid.saveKeyframe(112)
    arms[0].transform.setRotation(-30 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(112)
    arms[2].transform.setRotation(30 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(112)
    legs[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(112)
    legs[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(112)

    // Frame 116
    humanoid.transform.setPosition(0.0, 0.0, 2.8)
    humanoid.saveKeyframe(116)
    arms[0].transform.setRotation(-10 * (Math.PI / 180), 0, 0)
    arms[0].saveKeyframe(116)
    arms[2].transform.setRotation(10 * (Math.PI / 180), 0, 0)
    arms[2].saveKeyframe(116)
    legs[0].transform.setRotation(-5 * (Math.PI / 180), 0, 0)
    legs[0].saveKeyframe(116)
    legs[2].transform.setRotation(5 * (Math.PI / 180), 0, 0)
    legs[2].saveKeyframe(116)

    // Frame 120
    humanoid.transform.setPosition(0.0, 0.0, 3.0)
    humanoid.saveKeyframe(120)
    arms[0].transform.setRotation(0, 0, 0)
    arms[0].saveKeyframe(120)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(120)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(120)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(120)

    // Return the animated humanoid
    return humanoid
  }

  /**
   * Generate an animated humanoid that does something other than wlaking.
   * @return {AnimatableMesh} A humanoid with a pre-programed animation
   **/
  generateOther () {
    // Create a new humanoid object using your factory
    let humanoid = this._humanoidMaker.generateMesh()
    humanoid.name = `Walking ${humanoid.name}`

    // Create a new arms array object after searching for any nodes named 'Arm' in my factory
    // arms[0] = Right Arm
    // arms[1] = R Arm
    // arms[2] = Left Arm
    // arms[3] = L Arm
    let arms = this.extractNamedNodes(humanoid, 'Arm')

    // Create a new legs array object after searching for any nodes named 'Leg' in my factory
    // legs[0] = Left Leg
    // legs[1] = L Leg
    // legs[2] = Right Leg
    // legs[3] = R Leg
    let legs = this.extractNamedNodes(humanoid, 'Leg')

    // Frame 0
    humanoid.transform.setPosition(0.0, 0.0, 0.0)
    humanoid.saveKeyframe(0)
    arms[0].transform.setRotation(0, 0, 0 * (Math.PI / 180))
    arms[0].saveKeyframe(0)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(0)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(0)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(0)

    // Frame 4
    humanoid.transform.setPosition(0.0, 0.3, 0.0)
    humanoid.saveKeyframe(4)
    arms[0].transform.setRotation(0, 0, -45 * (Math.PI / 180))
    arms[0].saveKeyframe(4)
    arms[2].transform.setRotation(0, 0, 45 * (Math.PI / 180))
    arms[2].saveKeyframe(4)
    legs[0].transform.setRotation(0, 0, 5 * (Math.PI / 180))
    legs[0].saveKeyframe(4)
    legs[2].transform.setRotation(0, 0, -5 * (Math.PI / 180))
    legs[2].saveKeyframe(4)

    // Frame 8
    humanoid.transform.setPosition(0.0, 0.6, 0.0)
    humanoid.saveKeyframe(8)
    arms[0].transform.setRotation(0, 0, -90 * (Math.PI / 180))
    arms[0].saveKeyframe(8)
    arms[2].transform.setRotation(0, 0, 90 * (Math.PI / 180))
    arms[2].saveKeyframe(8)
    legs[0].transform.setRotation(0, 0, 10 * (Math.PI / 180))
    legs[0].saveKeyframe(8)
    legs[2].transform.setRotation(0, 0, -10 * (Math.PI / 180))
    legs[2].saveKeyframe(8)

    // Frame 12
    humanoid.transform.setPosition(0.0, 0.9, 0.5)
    humanoid.saveKeyframe(12)
    arms[0].transform.setRotation(0, 0, -135 * (Math.PI / 180))
    arms[0].saveKeyframe(12)
    arms[2].transform.setRotation(0, 0, 135 * (Math.PI / 180))
    arms[2].saveKeyframe(12)
    legs[0].transform.setRotation(0, 0, 15 * (Math.PI / 180))
    legs[0].saveKeyframe(12)
    legs[2].transform.setRotation(0, 0, -15 * (Math.PI / 180))
    legs[2].saveKeyframe(12)

    // Frame 16
    humanoid.transform.setRotation(0.0, 20.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(16)

    // Frame 20
    humanoid.transform.setRotation(0.0, 40.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(20)

    // Frame 24
    humanoid.transform.setRotation(0.0, 60.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(24)

    // Frame 28
    humanoid.transform.setRotation(0.0, 80.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(28)

    // Frame 32
    humanoid.transform.setRotation(0.0, 100.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(32)

    // Frame 36
    humanoid.transform.setRotation(0.0, 120.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(36)

    // Frame 40
    humanoid.transform.setRotation(0.0, 140.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(40)

    // Frame 44
    humanoid.transform.setRotation(0.0, 160.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(44)

    // Frame 48
    humanoid.transform.setRotation(0.0, 180.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(48)

    // Frame 52
    humanoid.transform.setRotation(0.0, 200.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(52)

    // Frame 56
    humanoid.transform.setRotation(0.0, 220.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(56)

    // Frame 60
    humanoid.transform.setRotation(0.0, 240.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(60)

    // Frame 64
    humanoid.transform.setRotation(0.0, 260.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(64)

    // Frame 68
    humanoid.transform.setRotation(0.0, 280.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(68)

    // Frame 72
    humanoid.transform.setRotation(0.0, 300.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(72)

    // Frame 76
    humanoid.transform.setRotation(0.0, 320.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(76)

    // Frame 80
    humanoid.transform.setRotation(0.0, 340.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(80)

    // Frame 80
    humanoid.transform.setRotation(0.0, 360.0 * (Math.PI / 180), 0.0)
    humanoid.saveKeyframe(80)

    // Frame 84
    arms[2].transform.setRotation(0, 0, 135 * (Math.PI / 180))
    arms[2].saveKeyframe(84)

    // Frame 88
    humanoid.transform.setPosition(0.0, 0.6, 0.0)
    humanoid.saveKeyframe(88)
    arms[2].transform.setRotation(0, 0, 90 * (Math.PI / 180))
    arms[2].saveKeyframe(88)
    legs[0].transform.setRotation(0, 0, 10 * (Math.PI / 180))
    legs[0].saveKeyframe(88)
    legs[2].transform.setRotation(0, 0, -10 * (Math.PI / 180))
    legs[2].saveKeyframe(88)

    // Frame 92
    humanoid.transform.setPosition(0.0, 0.3, 0.0)
    humanoid.saveKeyframe(92)
    arms[2].transform.setRotation(0, 0, 45 * (Math.PI / 180))
    arms[2].saveKeyframe(92)
    legs[0].transform.setRotation(0, 0, 5 * (Math.PI / 180))
    legs[0].saveKeyframe(92)
    legs[2].transform.setRotation(0, 0, -5 * (Math.PI / 180))
    legs[2].saveKeyframe(92)

    // Frame 96
    humanoid.transform.setPosition(0.0, 0.0, 0.0)
    humanoid.saveKeyframe(96)
    arms[0].transform.setRotation(0, 0, -135 * (Math.PI / 180))
    arms[0].saveKeyframe(96)
    arms[2].transform.setRotation(0, 0, 0)
    arms[2].saveKeyframe(96)
    legs[0].transform.setRotation(0, 0, 0)
    legs[0].saveKeyframe(96)
    legs[2].transform.setRotation(0, 0, 0)
    legs[2].saveKeyframe(96)

    // Frame 100
    arms[0].transform.setRotation(0, 0, -160 * (Math.PI / 180))
    arms[0].saveKeyframe(100)

    // Frame 104
    arms[0].transform.setRotation(0, 0, -135 * (Math.PI / 180))
    arms[0].saveKeyframe(104)

    // Frame 108
    arms[0].transform.setRotation(0, 0, -160 * (Math.PI / 180))
    arms[0].saveKeyframe(100)

    // Frame 112
    arms[0].transform.setRotation(0, 0, -135 * (Math.PI / 180))
    arms[0].saveKeyframe(112)

    // Frame 116
    arms[0].transform.setRotation(0, 0, -160 * (Math.PI / 180))
    arms[0].saveKeyframe(116)

    // Frame 120
    arms[0].transform.setRotation(0, 0, -135 * (Math.PI / 180))
    arms[0].saveKeyframe(120)

    // Return the animated robot
    return humanoid
  }
}

// Export the AnimationFactory class for use in other modules
export default AnimationFactory
