// Import the three.js library and components needed
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/controls/TrackballControls'

import Interface from '../interface'

// Utility function for shadow-mapped lights
import { makeShadowedLight } from '../utils'

// A Three.js backed widget for rendering a 3d mesh
class MeshWidget {
  constructor (element, controlType, nudgeFloor) {
    // Default parameters
    this._container = element
    this._controlType = (controlType || MeshWidget.ControlTypes.STATIC_FIXED)
    this._rotTimer = 0
    this._fogColor = 0x72645b

    // Floor related properties
    this._floorGeometry = null
    this._floorNudge = (nudgeFloor || -0.04)

    // Rendering Materials
    this._solidMaterial = null
    this._wireMaterial = null
    this._debugMaterial = null

    // Meshes for the different render modes
    this._solidMesh = null
    this._wireMesh = null
    this._debugMesh = null

    // Camera related properties
    this._camera = null
    this._camTarget = null
    this._camX = 8
    this._camY = 8
    this._rotateCam = false

    // Three.js related variables
    this._controls = null
    this._scene = null
    this._renderer = null

    // Request a rebuild of the entire scene
    this._rebuildRequested = true
    this._resizeRequested = true

    // Initialize the widget
    this.initialize()
  }

  initialize () {
    // Make and orient the main camera
    this._camera = new THREE.PerspectiveCamera(35,
      this._container.clientWidth / this._container.clientHeight, 0.1, 30)
    this._camera.position.set(0.0, 0.15, this._camY)
    this._camTarget = new THREE.Vector3(0, 0, 0)
    this._camera.lookAt(this._camTarget)

    // Make the Three.js renderer
    this._renderer = new THREE.WebGLRenderer({ antialias: true })
    this._renderer.setClearColor(this._fogColor)
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(this._container.clientWidth, this._container.clientHeight)

    // Setup the Three.js renderer
    this._renderer.gammaInput = true
    this._renderer.gammaOutput = true

    this._renderer.shadowMap.enabled = true
    this._renderer.shadowMap.renderReverseSided = true
    this._renderer.shadowMap.renderSingleSided = false
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Append the renderer canvas to the scene
    this._container.appendChild(this._renderer.domElement)

    // Setup the requested control type (default is fixed w/o controls)
    this._controls = null
    switch (this._controlType) {
      // Setup the widget to rotate when the mouse is over it
      case MeshWidget.ControlTypes.STATIC_ROTATE:
        this._container.addEventListener('mouseover',
          () => { this._rotateCam = true }, false)

        this._container.addEventListener('mouseout',
          () => { this._rotateCam = false }, false)
        break

      // Setup a custom orbit control
      case MeshWidget.ControlTypes.DYNAMIC_ORBIT:
        this._rotateCam = false
        this._controls = new THREE.OrbitControls(
          this._camera, this._renderer.domElement)

        this._controls.keys = { LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 }

        this._controls.rotateSpeed = 1.0
        this._controls.zoomSpeed = 0.5

        this._controls.minDistance = 1.0
        this._controls.maxDistance = 20.0

        this._controls.minPolarAngle = -Math.PI / 4.0
        this._controls.maxPolarAngle = Math.PI / 2.0
        break

      // Setup a custom trackball control
      case MeshWidget.ControlTypes.DYNAMIC_TRACKBALL:
        this._rotateCam = false
        this._controls = new THREE.TrackballControls(
          this._camera, this._renderer.domElement)

        this._controls.rotateSpeed = 1.2
        this._controls.zoomSpeed = 0.5
        this._controls.panSpeed = 0.8

        this._controls.noZoom = false
        this._controls.noPan = false

        this._controls.staticMoving = true
        this._controls.dynamicDampingFactor = 0.3

        this._controls.keys = [65, 83, 68]
        break
    }

    // Make the ground plane
    let floorPlane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(40, 40),
      new THREE.MeshPhongMaterial({color: 0x999999, specular: 0x101010})
    )

    floorPlane.rotation.x = -Math.PI / 2
    floorPlane.position.y = -1.0 + this._floorNudge
    floorPlane.receiveShadow = true
    this._floorGeometry = floorPlane

    // Normal material for the central geometry
    this._solidMaterial = new THREE.MeshPhongMaterial({
      flatShading: false,
      side: THREE.DoubleSide,
      color: 0x156289,
      emissive: 0x072534
    })

    // Wireframe material for the central geometry
    this._wireMaterial = new THREE.MeshPhongMaterial({
      flatShading: false,
      wireframeLinewidth: 2.0,
      color: 0xFFFFFF
    })

    this._wireMaterial.wireframe = true
    this._wireMaterial.polygonOffset = true
    this._wireMaterial.polygonOffsetFactor = 1
    this._wireMaterial.polygonOffsetUnits = 0.01

    // Debugging material that visualizes the surface normals
    this._debugMaterial = new THREE.MeshNormalMaterial()

    // Build the initial scene
    this.rebuildScene()
  }

  requestRebuild (geometryMesh) {
    // Dispose of old geometry
    if (typeof this._solidMesh !== 'undefined' && this._solidMesh != null) {
      this._solidMesh = null
    }

    // Retain reference to geometry
    if (typeof geometryMesh !== 'undefined') {
      this._solidMesh = geometryMesh
    }

    // Queue for rebuild on next render
    this._rebuildRequested = true
  }

  rebuildScene () {
    // re-make the main scene
    this._scene = null // To try and force GC
    this._scene = new THREE.Scene()
    this._scene.fog = new THREE.Fog(this._fogColor, 20, 25)
    this._scene.add(this._floorGeometry)

    // Lights
    this._scene.add(new THREE.HemisphereLight(0x443333, 0x111122))
    this._scene.add(makeShadowedLight(1, 1, 1, 0xffffff, 1.35))
    this._scene.add(makeShadowedLight(0.5, 1, -1, 0xffaa00, 1))

    // Central geometry
    if (this._solidMesh) {
      // Add to scene
      this._scene.add(this._solidMesh)
      this.syncronizeMeshes()

      // Try to syncronize GUI mesh tree
      Interface.syncMeshTreeWithGeometry()
    }
  }

  smoothNormals () {
    if (this._solidMesh != null && this._solidMaterial != null) {
      this._solidMaterial.flatShading = false
      this._solidMaterial.needsUpdate = true

      this._solidMesh.traverse((node) => {
        if (typeof node.geometry !== 'undefined') {
          node.geometry.computeVertexNormals()
        }
      })
    }
  }

  computePerFaceNormals () {
    if (this._solidMesh != null && this._solidMaterial != null) {
      this._solidMaterial.flatShading = true
      this._solidMaterial.needsUpdate = true

      this._solidMesh.traverse((node) => {
        if (typeof node.geometry !== 'undefined') {
          node.geometry.computeFaceNormals()
        }
      })
    }
  }

  updateMaterialProperties (colorRGB, specularRGB, emissiveRGB, shinyExp) {
    if (this._solidMaterial != null) {
      // Change material properties
      this._solidMaterial.color.r = colorRGB.r / 255
      this._solidMaterial.color.g = colorRGB.g / 255
      this._solidMaterial.color.b = colorRGB.b / 255

      this._solidMaterial.specular.r = specularRGB.r / 255
      this._solidMaterial.specular.g = specularRGB.g / 255
      this._solidMaterial.specular.b = specularRGB.b / 255

      this._solidMaterial.emissive.r = emissiveRGB.r / 255
      this._solidMaterial.emissive.g = emissiveRGB.g / 255
      this._solidMaterial.emissive.b = emissiveRGB.b / 255

      this._solidMaterial.shininess = shinyExp

      // Signal for update
      this._solidMaterial.needsUpdate = true
    }
  }

  toggleSolid (enable) {
    if (this._solidMesh != null) {
      this._solidMesh.visible = enable
    }
  }

  toggleWireframe (enable) {
    if (this._wireMesh != null) {
      this._wireMesh.visible = enable
    }
  }

  toggleDebug (enable) {
    if (this._debugMesh != null) {
      this._debugMesh.visible = enable
    }
  }

  syncronizeMeshes () {
    // Clear out old wireframe mesh
    let wireVisible = false
    if (typeof this._wireMesh !== 'undefined' && this._wireMesh !== null) {
      wireVisible = this._wireMesh.visible
      this._scene.remove(this._wireMesh)
      this._wireMesh = null
    }

    if (this._solidMesh) {
      // Make/Re-make wireframe mesh
      this._wireMesh = this._solidMesh.clone()
      this._wireMesh.traverse((node) => {
        node.material = this._wireMaterial
        node.receiveShadow = false
      })

      // Add to scene re-setting prior visibility
      this._scene.add(this._wireMesh)
      this._wireMesh.visible = wireVisible
    }

    // Clear out old debug mesh
    let dbgVisible = false
    if (typeof this._debugMesh !== 'undefined' && this._debugMesh !== null) {
      dbgVisible = this._debugMesh.visible
      this._scene.remove(this._debugMesh)
      this._debugMesh = null
    }

    if (this._solidMesh) {
      // Make/re-make debug mesh
      this._debugMesh = this._solidMesh.clone()
      this._debugMesh.traverse((node) => {
        node.material = this._debugMaterial
        node.receiveShadow = true
      })

      // Add to scene copying the prior visibility
      this._scene.add(this._debugMesh)
      this._debugMesh.visible = dbgVisible
    }
  }

  requestResize () {
    this._resizeRequested = true
  }

  resize () {
    this._camera.aspect =
      this._container.clientWidth / this._container.clientHeight
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._container.clientWidth,
      this._container.clientHeight)

    if (this._controlType === MeshWidget.ControlTypes.DYNAMIC_TRACKBALL) {
      this._controls.handleResize()
    }
  }

  // Reset the view to remove any changes caused by the controller
  resetView () {
    if (this._controls !== null) {
      this._controls.reset()
    } else if (this._controlType === MeshWidget.ControlTypes.STATIC_ROTATE) {
      this._rotTimer = 0.0
    }
  }

  render () {
    if (this._resizeRequested) {
      this.resize()
      this._resizeRequested = false
    }

    // Update the controls if they exist
    if (this._controls !== null) {
      this._controls.update()
    } else if (this._controlType === MeshWidget.ControlTypes.STATIC_ROTATE) {
      // Animate rotating camera
      if (this._rotateCam) {
        this._rotTimer += 15
        var angle = this._rotTimer * 0.0005

        // Move camera
        this._camera.position.x = Math.sin(angle) * this._camX
        this._camera.position.z = Math.cos(angle) * this._camY
        this._camera.lookAt(this._camTarget)
      }
    }

    // Check if scene needs to be rebuilt
    if (this._rebuildRequested) {
      this.rebuildScene()
      this._rebuildRequested = false
    }

    // Re-render the scene
    this._renderer.render(this._scene, this._camera)
  }
}

// Different widget control paradigms
MeshWidget.ControlTypes = Object.freeze({
  STATIC_FIXED: 0,
  STATIC_ROTATE: 1,
  DYNAMIC_ORBIT: 2,
  DYNAMIC_TRACKBALL: 3
})

export default MeshWidget
