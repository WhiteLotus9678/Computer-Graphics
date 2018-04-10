// Parent class
import MeshFactory from './MeshFactory'

// Base geometry factories
import CubeFactory from './CubeFactory'
import CylinderFactory from './CylinderFactory'
import SphereFactory from './SphereFactory'

/**
 * A class to build a representation of the UW Stout Bell monument
 * for use with Three.js.  Do not call makeObjectGeometry() on this
 * class as it is left abstract. Use generateMesh() instead.
 **/
class SculptureFactory extends MeshFactory {
  /**
   * Create a new sculpture factory object.
   **/
  constructor () {
    super()
    this._name = 'Sculpture'
  }

  /**
   * Build and return a THREE.Mesh() object representing the Stout Bell Monument.
   * @override
   **/
  generateMesh () {
    // Empty root objects for the entire bell sculpture
    this.root = MeshFactory.generateEmptyNode('Sculpture') // Global root for the entire structure
    this.floor = MeshFactory.generateEmptyNode('Floor')
    this.bell = MeshFactory.generateEmptyNode('Bell')
    this.poles = MeshFactory.generateEmptyNode('Poles')
    this.bench1 = MeshFactory.generateEmptyNode('Bench 1')
    this.bench2 = MeshFactory.generateEmptyNode('Bench 2')
    this.bench3 = MeshFactory.generateEmptyNode('Bench 3')
    this.bench4 = MeshFactory.generateEmptyNode('Bench 4')

    // Mesh factories for each 3D shape
    this.cubeMaker = new CubeFactory()
    this.cylMaker = new CylinderFactory()
    this.sphereMaker = new SphereFactory()

    // Constructs the individual parts of the floor as a cylinder mesh
    this.buildFloor()

    // Constructs the individual parts of the bench as cube meshes
    this.buildBenches()

    //  Constructs the individual pieces of the poles as sphere meshes
    this.buildPoles()

    // Constructs the individual pieces of the bell as cylinder meshes
    this.buildBell()

    //  Scale the root object to view a smaller object
    // Translate the root object to be placed on the world floor
    this.root.transform.setScale(0.12, 0.12, 0.12)
    this.root.transform.setPosition(0.0, -8, 0.0)

    // Return finished geometry
    return this.root
  }

  /*
  * Constructs the individual parts of the floor as a cylinder mesh
  */
  buildFloor () {
    this.floor = this.cylMaker.generateMesh()
    this.floor.name = 'Floor'
    this.floor.transform.setScale(20.0, 0.1, 20.0)
    this.floor.transform.setPosition(0.0, -5.0, 0.0)

    this.root.add(this.floor)
  }

  /*
  * Constructs the individual parts of the bench as cube meshes
  */
  buildBenches () {
    // Top part of the bench1 object
    // Build and transform cube objects for the benches
    let bench1Top = this.cubeMaker.generateMesh()
    bench1Top.name = 'Bench Top'
    bench1Top.transform.setScale(3.0, 0.5, 1.0)
    bench1Top.transform.setPosition(0.0, 3.0, 0.0)

    // Right leg of the bench1 object
    let bench1RightLeg = this.cubeMaker.generateMesh()
    bench1RightLeg.name = 'Bench Right Leg'
    bench1RightLeg.transform.setScale(0.8, 0.5, 0.8)
    bench1RightLeg.transform.setPosition(2.0, 1.0, 0.0)

    // Left leg of the bench1 object
    let bench1LeftLeg = this.cubeMaker.generateMesh()
    bench1LeftLeg.name = 'Bench Left Leg'
    bench1LeftLeg.transform.setScale(0.8, 0.5, 0.8)
    bench1LeftLeg.transform.setPosition(-2.0, 1.0, 0.0)

    // Set each part for bench 1 as children of the bench1 object
    this.bench1.add(bench1Top)
    this.bench1.add(bench1RightLeg)
    this.bench1.add(bench1LeftLeg)
    this.bench1.transform.setPosition(0.0, -0.5, 15.0)
    this.bench1.transform.setRotation(0.0, 45.0 * (Math.PI / 180), 0.0)

    // Top part of the bench2 object
    let bench2Top = this.cubeMaker.generateMesh()
    bench2Top.name = 'Bench 2 Top'
    bench2Top.transform.setScale(3.0, 0.5, 1.0)
    bench2Top.transform.setPosition(0.0, 3.0, 0.0)

    // Right leg of the bench2 object
    let bench2RightLeg = this.cubeMaker.generateMesh()
    bench2RightLeg.name = 'Bench 2 Right Leg'
    bench2RightLeg.transform.setScale(0.8, 0.5, 0.8)
    bench2RightLeg.transform.setPosition(2.0, 1.0, 0.0)

    // Left leg of the bench2 object
    let bench2LeftLeg = this.cubeMaker.generateMesh()
    bench2LeftLeg.name = 'Bench 2 Left Leg'
    bench2LeftLeg.transform.setScale(0.8, 0.5, 0.8)
    bench2LeftLeg.transform.setPosition(-2.0, 1.0, 0.0)

    // Set each part for bench 2 as children of the bench2 object
    this.bench2.add(bench2Top)
    this.bench2.add(bench2RightLeg)
    this.bench2.add(bench2LeftLeg)
    this.bench2.transform.setPosition(0.0, -0.5, 15.0)
    this.bench2.transform.setRotation(0.0, 135.0 * (Math.PI / 180), 0.0)

    // Top part of the bench3 object
    let bench3Top = this.cubeMaker.generateMesh()
    bench3Top.name = 'Bench 3 Top'
    bench3Top.transform.setScale(3.0, 0.5, 1.0)
    bench3Top.transform.setPosition(0.0, 3.0, 0.0)

    // Right leg of the bench3 object
    let bench3RightLeg = this.cubeMaker.generateMesh()
    bench3RightLeg.name = 'Bench 3 Right Leg'
    bench3RightLeg.transform.setScale(0.8, 0.5, 0.8)
    bench3RightLeg.transform.setPosition(2.0, 1.0, 0.0)

    // Left leg of the bench3 object
    let bench3LeftLeg = this.cubeMaker.generateMesh()
    bench3LeftLeg.name = 'Bench 3 Left Leg'
    bench3LeftLeg.transform.setScale(0.8, 0.5, 0.8)
    bench3LeftLeg.transform.setPosition(-2.0, 1.0, 0.0)

    // Set each part for bench 3 as children of the bench3 object
    this.bench3.add(bench3Top)
    this.bench3.add(bench3RightLeg)
    this.bench3.add(bench3LeftLeg)
    this.bench3.transform.setPosition(0.0, -0.5, 15.0)
    this.bench3.transform.setRotation(0.0, -45.0 * (Math.PI / 180), 0.0)

    // Top part of the bench4 object
    let bench4Top = this.cubeMaker.generateMesh()
    bench4Top.name = 'Bench 4 Top'
    bench4Top.transform.setScale(3.0, 0.5, 1.0)
    bench4Top.transform.setPosition(0.0, 3.0, 0.0)

    // Right leg of the bench4 object
    let bench4RightLeg = this.cubeMaker.generateMesh()
    bench4RightLeg.name = 'Bench 4 Right Leg'
    bench4RightLeg.transform.setScale(0.8, 0.5, 0.8)
    bench4RightLeg.transform.setPosition(2.0, 1.0, 0.0)

    // Left leg of the bench4 object
    let bench4LeftLeg = this.cubeMaker.generateMesh()
    bench4LeftLeg.name = 'Bench 4 Left Leg'
    bench4LeftLeg.transform.setScale(0.8, 0.5, 0.8)
    bench4LeftLeg.transform.setPosition(-2.0, 1.0, 0.0)

    // Set each part for bench 4 as children of the bench4 object
    this.bench4.add(bench4Top)
    this.bench4.add(bench4RightLeg)
    this.bench4.add(bench4LeftLeg)
    this.bench4.transform.setPosition(0.0, -0.5, 15.0)
    this.bench4.transform.setRotation(0.0, -135.0 * (Math.PI / 180), 0.0)

    // Set each bench as children of the root object
    this.root.add(this.bench1)
    this.root.add(this.bench2)
    this.root.add(this.bench3)
    this.root.add(this.bench4)
  }

  /*
  * Constructs the individual pieces of the pole as sphere meshes
  */
  buildPoles () {
    var theta = 0 // Angle of longitude
    var phi = 0 // Angle of latitude
    var spheres = 50
    var poles = 4
    var deltaTheta = 2 * Math.PI / poles // Radians per longitude line based on the number of poles
    var deltaPhi = Math.PI / 2 / spheres // Radians per latitude line based on the number of spheres
    var radius = 15 // Radius of each pole to the center of the floor
    var k = 1 // Tracks the number of spheres made

    // Draw each pole
    for (let i = 0; i < poles; i++) {
      // Draw each sphere from top to bottom
      for (let j = 0; j < spheres; j++) {
        // Build and transform sphere objects for the poles
        let sphere = this.sphereMaker.generateMesh()

        // Name the sphere based on k
        sphere.name = `Sphere ${k}`

        // Set the sphere along the pole
        sphere.transform.setPosition(
          Math.sin(theta) * Math.sin(phi) * radius,
          Math.cos(phi) * radius,
          Math.cos(theta) * Math.sin(phi) * radius
        )

        // Attach the sphere to the pole object:
        // - Increment phi by deltaPhi
        // - Increment k by 1
        this.poles.add(sphere)
        phi += deltaPhi
        k++
      }
      // After a full pole is drawn:
      // - Move on to the next pole with theta
      // - Reset phi
      theta += deltaTheta
      phi = 0
    }

    // Set the poles as children of the root object
    this.poles.transform.setPosition(0.0, -1.0, 0.0)
    this.root.add(this.poles)
  }

  /*
  * Constructs the individual pieces of the bell as cylinder meshes
  */
  buildBell () {
    // Build and transform cylinder objects for the bell
    let bellLayerTop = this.cylMaker.generateMesh()
    bellLayerTop.name = 'Bell Layer Top'
    bellLayerTop.transform.setScale(1.5, 1.3, 1.5)
    bellLayerTop.transform.setPosition(0, 11.5, 0.0)

    let bellLayer1 = this.cylMaker.generateMesh()
    bellLayer1.name = 'Bell Layer 1'
    bellLayer1.transform.setScale(1.0, 0.1, 1.0)
    bellLayer1.transform.setPosition(0.0, 136, 0.0)

    let bellLayer2 = this.cylMaker.generateMesh()
    bellLayer2.name = 'Bell Layer 2'
    bellLayer2.transform.setScale(1.3, 0.2, 1.3)
    bellLayer2.transform.setPosition(0.0, 66.5, 0.0)

    let bellLayer3 = this.cylMaker.generateMesh()
    bellLayer3.name = 'Bell Layer 3'
    bellLayer3.transform.setScale(1.35, 0.2, 1.35)
    bellLayer3.transform.setPosition(0.0, 64.5, 0.0)

    let bellLayer4 = this.cylMaker.generateMesh()
    bellLayer4.name = 'Bell Layer 4'
    bellLayer4.transform.setScale(1.35, 0.1, 1.35)
    bellLayer4.transform.setPosition(0.0, 126, 0.0)

    let bellLayer5 = this.cylMaker.generateMesh()
    bellLayer5.name = 'Bell Layer 5'
    bellLayer5.transform.setScale(1.38, 0.1, 1.38)
    bellLayer5.transform.setPosition(0.0, 124, 0.0)

    let bellLayer6 = this.cylMaker.generateMesh()
    bellLayer6.name = 'Bell Layer 6'
    bellLayer6.transform.setScale(1.4, 0.1, 1.4)
    bellLayer6.transform.setPosition(0.0, 122, 0.0)

    let bellLayer7 = this.cylMaker.generateMesh()
    bellLayer7.name = 'Bell Layer 7'
    bellLayer7.transform.setScale(1.42, 0.1, 1.42)
    bellLayer7.transform.setPosition(0.0, 120.0, 0.0)

    let bellLayer8 = this.cylMaker.generateMesh()
    bellLayer8.name = 'Bell Layer 8'
    bellLayer8.transform.setScale(1.44, 0.1, 1.44)
    bellLayer8.transform.setPosition(0.0, 118, 0.0)

    let bellLayer9 = this.cylMaker.generateMesh()
    bellLayer9.name = 'Bell Layer 9'
    bellLayer9.transform.setScale(1.46, 0.1, 1.46)
    bellLayer9.transform.setPosition(0.0, 116, 0.0)

    let bellLayer10 = this.cylMaker.generateMesh()
    bellLayer10.name = 'Bell Layer 10'
    bellLayer10.transform.setScale(1.54, 0.1, 1.54)
    bellLayer10.transform.setPosition(0.0, 114, 0.0)

    let bellLayer11 = this.cylMaker.generateMesh()
    bellLayer11.name = 'Bell Layer 11'
    bellLayer11.transform.setScale(1.6, 0.1, 1.6)
    bellLayer11.transform.setPosition(0.0, 112, 0.0)

    let bellLayer12 = this.cylMaker.generateMesh()
    bellLayer12.name = 'Bell Layer 12'
    bellLayer12.transform.setScale(1.8, 0.1, 1.8)
    bellLayer12.transform.setPosition(0.0, 110.0, 0.0)

    let bellLayer13 = this.cylMaker.generateMesh()
    bellLayer13.name = 'Bell Layer 13'
    bellLayer13.transform.setScale(2.0, 0.1, 2.0)
    bellLayer13.transform.setPosition(0.0, 108, 0.0)

    let bellLayer14 = this.cylMaker.generateMesh()
    bellLayer14.name = 'Bell Layer 14'
    bellLayer14.transform.setScale(2.1, 0.1, 2.1)
    bellLayer14.transform.setPosition(0.0, 106, 0.0)

    let bellLayer15 = this.cylMaker.generateMesh()
    bellLayer15.name = 'Bell Layer 15'
    bellLayer15.transform.setScale(2.2, 0.1, 2.2)
    bellLayer15.transform.setPosition(0.0, 104, 0.0)

    let bellLayer16 = this.cylMaker.generateMesh()
    bellLayer16.name = 'Bell Layer 16'
    bellLayer16.transform.setScale(2.28, 0.1, 2.28)
    bellLayer16.transform.setPosition(0.0, 102, 0.0)

    let bellLayer17 = this.cylMaker.generateMesh()
    bellLayer17.name = 'Bell Layer 17'
    bellLayer17.transform.setScale(2.34, 0.1, 2.34)
    bellLayer17.transform.setPosition(0.0, 100.0, 0.0)

    let bellLayer18 = this.cylMaker.generateMesh()
    bellLayer18.name = 'Bell Layer 18'
    bellLayer18.transform.setScale(2.40, 0.1, 2.40)
    bellLayer18.transform.setPosition(0.0, 98, 0.0)

    let bellLayer19 = this.cylMaker.generateMesh()
    bellLayer19.name = 'Bell Layer 19'
    bellLayer19.transform.setScale(2.46, 0.1, 2.46)
    bellLayer19.transform.setPosition(0.0, 96, 0.0)

    let bellLayer20 = this.cylMaker.generateMesh()
    bellLayer20.name = 'Bell Layer 20'
    bellLayer20.transform.setScale(2.5, 0.1, 2.5)
    bellLayer20.transform.setPosition(0.0, 94, 0.0)

    let bellLayerA = this.cylMaker.generateMesh()
    bellLayerA.name = 'Bell Layer A'
    bellLayerA.transform.setScale(2.22, 0.1, 2.22)
    bellLayerA.transform.setPosition(0.0, 97, 0.0)

    let bellLayerB = this.cylMaker.generateMesh()
    bellLayerB.name = 'Bell Layer B'
    bellLayerB.transform.setScale(2.36, 0.1, 2.36)
    bellLayerB.transform.setPosition(0.0, 99, 0.0)

    let bellLayerC = this.cylMaker.generateMesh()
    bellLayerC.name = 'Bell Layer C'
    bellLayerC.transform.setScale(2.31, 0.1, 2.31)
    bellLayerC.transform.setPosition(0.0, 101, 0.0)

    let bellLayerD = this.cylMaker.generateMesh()
    bellLayerD.name = 'Bell Layer D'
    bellLayerD.transform.setScale(2.24, 0.1, 2.24)
    bellLayerD.transform.setPosition(0.0, 103, 0.0)

    let bellLayerE = this.cylMaker.generateMesh()
    bellLayerE.name = 'Bell Layer E'
    bellLayerE.transform.setScale(2.15, 0.1, 2.15)
    bellLayerE.transform.setPosition(0.0, 105, 0.0)

    let bellLayerF = this.cylMaker.generateMesh()
    bellLayerF.name = 'Bell Layer F'
    bellLayerF.transform.setScale(2.05, 0.1, 2.05)
    bellLayerF.transform.setPosition(0.0, 107, 0.0)

    let bellLayerG = this.cylMaker.generateMesh()
    bellLayerG.name = 'Bell Layer G'
    bellLayerG.transform.setScale(1.9, 0.1, 1.9)
    bellLayerG.transform.setPosition(0.0, 109, 0.0)

    let bellLayerH = this.cylMaker.generateMesh()
    bellLayerH.name = 'Bell Layer H'
    bellLayerH.transform.setScale(1.7, 0.1, 1.7)
    bellLayerH.transform.setPosition(0.0, 111, 0.0)

    // Set each piece and layer of the bell as children of the root object
    this.bell.add(bellLayerTop)
    this.bell.add(bellLayer1)
    this.bell.add(bellLayer2)
    this.bell.add(bellLayer3)
    this.bell.add(bellLayer4)
    this.bell.add(bellLayer5)
    this.bell.add(bellLayer6)
    this.bell.add(bellLayer7)
    this.bell.add(bellLayer8)
    this.bell.add(bellLayer9)
    this.bell.add(bellLayer10)
    this.bell.add(bellLayer11)
    this.bell.add(bellLayer12)
    this.bell.add(bellLayer13)
    this.bell.add(bellLayer14)
    this.bell.add(bellLayer15)
    this.bell.add(bellLayer16)
    this.bell.add(bellLayer17)
    this.bell.add(bellLayer18)
    this.bell.add(bellLayer19)
    this.bell.add(bellLayer20)
    this.bell.add(bellLayerA)
    this.bell.add(bellLayerB)
    this.bell.add(bellLayerC)
    this.bell.add(bellLayerD)
    this.bell.add(bellLayerE)
    this.bell.add(bellLayerF)
    this.bell.add(bellLayerG)
    this.bell.add(bellLayerH)
    this.bell.transform.setPosition(0.0, -1.0, 0.0)
    this.root.add(this.bell)
  }
}

export default SculptureFactory
