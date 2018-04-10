// Parent class
import MeshFactory from './MeshFactory'

// Base geometry factories
import CubeFactory from './CubeFactory'
import CylinderFactory from './CylinderFactory'
import SphereFactory from './SphereFactory'

/**
 * A class to build a representation of robitic skeletal bipedal character
 * for use with Three.js.  Do not call makeObjectGeometry() on this class
 * as it is left abstract. Use generateMesh() instead.
 **/
class HumanoidFactory extends MeshFactory {
  /**
   * Create a new humanoid factory object.
   **/
  constructor () {
    super()
    this._name = 'Humanoid'
  }

  /**
   * Build and return a THREE.Mesh() object representing a bipedal robot.
   * @override
   **/
  generateMesh () {
    // Empty root objects for the entire humanoid character
    this.root = MeshFactory.generateEmptyNode('Humanoid') // Global root for the entire structure
    this.torso = MeshFactory.generateEmptyNode('Torso')
    this.shoulders = MeshFactory.generateEmptyNode('Shoulders')
    this.hips = MeshFactory.generateEmptyNode('Hips')

    // Mesh factories for each 3D shape
    this.cubeMaker = new CubeFactory()
    this.cylMaker = new CylinderFactory()
    this.sphereMaker = new SphereFactory()

    // Constructs the individual parts of the torso as a cube mesh
    this.buildTorso()

    // Constructs the individual parts of the shoulders as:
    // - Shoulders
    //     - Right Shoulder --> Sphere mesh
    //     - Left Shoulder --> Sphere mesh
    // - Right Arm --> Cylinder mesh
    //    - Right Hand --> Cylinder mesh
    // - Left Arm --> Cylinder mesh
    //     - Left Hand --> Cylinder mesh
    this.buildShoulders()

    // Constructs the individual parts of the hips as:
    // - Hips
    //     - Right Hip --> Sphere mesh
    //     - Left Hip --> Sphere mesh
    // - Right Leg --> Cylinder mesh
    //    - Right Foot --> Cube mesh
    // - Left Leg --> Cylinder mesh
    //     - Left Foot --> Cube mesh
    this.buildHips()

    //  Scale the root object to view a smaller object
    this.root.transform.setScale(0.2, 0.2, 0.2)

    // Return the completed mesh
    return this.root
  }

  /*
  * Constructs the individual parts of the torso as a cube mesh
  */
  buildTorso () {
    // Build and transform a cube object for the torso
    this.torsoGeom = this.cubeMaker.generateMesh()
    this.torsoGeom.name = 'Torso Geom'
    this.torsoGeom.transform.setPosition(0.0, 1.0, 0.1)
    this.torsoGeom.transform.setScale(1.5, 3.0, 0.5)

    // Set the torso as a child of the root object
    this.torso.add(this.torsoGeom)
    this.root.add(this.torso)
  }

  /*
  * Constructs the individual parts of the shoulders as:
  * - Shoulders
  *     - Right Shoulder --> Sphere mesh
  *     - Left Shoulder --> Sphere mesh
  * - Right Arm --> Cylinder mesh
  *    - Right Hand --> Cylinder mesh
  * - Left Arm --> Cylinder mesh
  *     - Left Hand --> Cylinder mesh
  */
  buildShoulders () {
    // Build and transform sphere objects for the shoulders
    this.shoulderRGeom = this.sphereMaker.generateMesh()
    this.shoulderRGeom.name = 'Shoulder R Geom'
    this.shoulderRGeom.transform.setPosition(-3.0, 8.0, 0.0)
    this.shoulderRGeom.transform.setScale(0.7, 0.7, 0.7)
    this.shoulderRGeom.transform.setPivot(3.0, -8.0, 0.0)

    this.shoulderLGeom = this.sphereMaker.generateMesh()
    this.shoulderLGeom.name = 'Shoulder L Geom'
    this.shoulderLGeom.transform.setPosition(3.0, 8.0, 0.0)
    this.shoulderLGeom.transform.setScale(0.7, 0.7, 0.7)
    this.shoulderLGeom.transform.setPivot(-3.0, -8.0, 0.0)

    // Build and transform a cylinder object for the neck
    this.neck = MeshFactory.generateEmptyNode('Neck')
    this.neck.transform.setPivot(0.0, -5.5, 0.0)

    this.neckGeom = this.cylMaker.generateMesh()
    this.neckGeom.name = 'Neck Geom'
    this.neckGeom.transform.setPosition(0.0, 16.0, 0.0)
    this.neckGeom.transform.setScale(0.4, 0.4, 0.4)
    this.neckGeom.transform.setPivot(0.0, -15.0, 0.0)

    // Build and transform a sphere object for the head
    this.head = MeshFactory.generateEmptyNode('Head')
    this.head.transform.setPivot(0.0, -7.5, 0.0)

    this.headGeom = this.sphereMaker.generateMesh()
    this.headGeom.name = 'Head Geom'
    this.headGeom.transform.setPosition(0.0, 7.5, 0.0)
    this.headGeom.transform.setPivot(0.0, -7.5, 0.0)

    // Build and transform cylinder objects for the left arm
    this.leftArm = MeshFactory.generateEmptyNode('Left Arm')
    this.leftArm.transform.setPivot(-2.1, -5.5, 0.0)

    this.lArm = MeshFactory.generateEmptyNode('L Arm')
    this.lArm.transform.setPivot(-2.1, -5.5, 0.0)

    this.lArmGeom = this.cylMaker.generateMesh()
    this.lArmGeom.name = 'L Arm Geom'
    this.lArmGeom.transform.setPosition(4.3, 2.3, 0.0)
    this.lArmGeom.transform.setScale(0.5, 1.5, 0.5)

    this.lHand = MeshFactory.generateEmptyNode('L Hand')
    this.lHand.transform.setPivot(-2.15, -1.35, 0.0)

    this.lHandGeom = this.cylMaker.generateMesh()
    this.lHandGeom.name = 'L Hand Geom'
    this.lHandGeom.transform.setPosition(-2.3, 3.6, 0.0)
    this.lHandGeom.transform.setScale(0.6, 0.6, 0.6)
    this.lHandGeom.transform.setRotation(0.0, 0.0, -90.0 * (Math.PI / 180))

    // Build and transform cylinder objects for the right arm
    this.rightArm = MeshFactory.generateEmptyNode('Right Arm')
    this.rightArm.transform.setPivot(2.1, -5.5, 0.0)

    this.rArm = MeshFactory.generateEmptyNode('R Arm')
    this.rArm.transform.setPivot(2.1, -5.5, 0.0)

    this.rArmGeom = this.cylMaker.generateMesh()
    this.rArmGeom.name = 'R Arm Geom'
    this.rArmGeom.transform.setPosition(-4.3, 2.3, 0.0)
    this.rArmGeom.transform.setScale(0.5, 1.5, 0.5)

    this.rHand = MeshFactory.generateEmptyNode('R Hand')
    this.rHand.transform.setPivot(2.15, -1.35, 0.0)

    this.rHandGeom = this.cylMaker.generateMesh()
    this.rHandGeom.name = 'R Hand Geom'
    this.rHandGeom.transform.setPosition(-2.3, -3.6, 0.0)
    this.rHandGeom.transform.setScale(0.6, 0.6, 0.6)
    this.rHandGeom.transform.setRotation(0.0, 0.0, -90.0 * (Math.PI / 180))

    // Set the left/right shoulders, head and neck as children of the shoulders object
    this.shoulders.add(this.shoulderLGeom)
    this.shoulders.add(this.shoulderRGeom)
    this.head.add(this.headGeom)
    this.neck.add(this.head)
    this.neck.add(this.neckGeom)
    this.shoulders.add(this.neck)
    this.shoulders.transform.setPivot(0.0, -5.0, 0.0)

    // Set the right arm and hand as children of the shoulders object
    this.rArm.add(this.rArmGeom)
    this.rightArm.add(this.rArm)
    this.rHand.add(this.rHandGeom)
    this.rightArm.add(this.rHand)
    this.shoulders.add(this.rightArm)

    // Set the left arm and hand as children of the shoulders object
    this.lArm.add(this.lArmGeom)
    this.leftArm.add(this.lArm)
    this.lHand.add(this.lHandGeom)
    this.leftArm.add(this.lHand)
    this.shoulders.add(this.leftArm)

    // Set the shoulders as a child of the torso object
    this.torso.add(this.shoulders)
  }

  /*
  * Constructs the individual parts of the hips as:
  * - Hips
  *     - Right Hip --> Sphere mesh
  *     - Left Hip --> Sphere mesh
  * - Right Leg --> Cylinder mesh
  *    - Right Foot --> Cube mesh
  * - Left Leg --> Cylinder mesh
  *     - Left Foot --> Cube mesh
  */
  buildHips () {
    // Build and transform sphere objects for the hips
    this.hipsRGeom = this.sphereMaker.generateMesh()
    this.hipsRGeom.name = 'Hips R Geom'
    this.hipsRGeom.transform.setPosition(-2.0, 0.0, 0.0)
    this.hipsRGeom.transform.setScale(0.8, 0.8, 0.8)
    this.hipsRGeom.transform.setPivot(2.0, 0.0, 0.0)

    this.hipsLGeom = this.sphereMaker.generateMesh()
    this.hipsLGeom.name = 'Hips L Geom'
    this.hipsLGeom.transform.setPosition(2.0, 0.0, 0.0)
    this.hipsLGeom.transform.setScale(0.8, 0.8, 0.8)
    this.hipsLGeom.transform.setPivot(-2.0, 0.0, 0.0)

    // Build and transform the right leg
    this.rightLeg = MeshFactory.generateEmptyNode('Right Leg')
    this.rightLeg.transform.setPivot(1.5, 0.0, 0.0)

    this.rLeg = MeshFactory.generateEmptyNode('R Leg')
    this.rLeg.transform.setPivot(1.65, 0.0, 0.0)

    // Build and transform a cylinder object for the right leg
    this.rLegGeom = this.cylMaker.generateMesh()
    this.rLegGeom.name = 'R Leg Geom'
    this.rLegGeom.transform.setPosition(-3.3, -1.4, 0.0)
    this.rLegGeom.transform.setScale(0.5, 2.0, 0.5)

    this.rFoot = MeshFactory.generateEmptyNode('R Foot')
    this.rFoot.transform.setPivot(1.65, 5.0, 0.0)

    // Build and transform a cube object for the right foot
    this.rFootGeom = this.cubeMaker.generateMesh()
    this.rFootGeom.name = 'R Foot Geom'
    this.rFootGeom.transform.setPosition(-2.4, -25.0, 0.6)
    this.rFootGeom.transform.setScale(0.7, 0.2, 1.5)

    // Build and transform the left leg
    this.leftLeg = MeshFactory.generateEmptyNode('Left Leg')
    this.leftLeg.transform.setPivot(-1.5, 0.0, 0.0)

    this.lLeg = MeshFactory.generateEmptyNode('L Leg')
    this.lLeg.transform.setPivot(-1.65, 0.0, 0.0)

    // Build and transform a cylinder object for the left leg
    this.lLegGeom = this.cylMaker.generateMesh()
    this.lLegGeom.name = 'L Leg Geom'
    this.lLegGeom.transform.setPosition(3.3, -1.4, 0.0)
    this.lLegGeom.transform.setScale(0.5, 2.0, 0.5)

    this.lFoot = MeshFactory.generateEmptyNode('L Foot')
    this.lFoot.transform.setPivot(-1.65, 5.0, 0.0)

    // Build and transform a cube object for the left foot
    this.lFootGeom = this.cubeMaker.generateMesh()
    this.lFootGeom.name = 'L Foot Geom'
    this.lFootGeom.transform.setPosition(2.4, -25.0, 0.6)
    this.lFootGeom.transform.setScale(0.7, 0.2, 1.5)

    // Set the left/right hips as children of the hips object
    this.hips.add(this.hipsLGeom)
    this.hips.add(this.hipsRGeom)

    // Set the left leg and foot as children of the hips object
    this.lLeg.add(this.lLegGeom)
    this.leftLeg.add(this.lLeg)
    this.lFoot.add(this.lFootGeom)
    this.leftLeg.add(this.lFoot)
    this.hips.add(this.leftLeg)

    // Set the right leg and foot as children of the hips object
    this.rLeg.add(this.rLegGeom)
    this.rightLeg.add(this.rLeg)
    this.rFoot.add(this.rFootGeom)
    this.rightLeg.add(this.rFoot)
    this.hips.add(this.rightLeg)

    // Set the hips as a child of the torso object
    this.torso.add(this.hips)
  }
}

// Export the HumanoidFactory class for use in other modules
export default HumanoidFactory
