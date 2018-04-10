// Import jQuery as the usual '$' variable
import $ from 'jquery'

// Initialize the jquery Tree Plugin
import 'jqtree/jqtree.css'
import 'jqtree/tree.jquery'

// Import ALLLLL the factories for use in the GUI
import CubeFactory from './objects/CubeFactory'
import CylinderFactory from './objects/CylinderFactory'
import SphereFactory from './objects/SphereFactory'
import ClothFactory from './objects/ClothFactory'
import SculptureFactory from './objects/SculptureFactory'
import HumanoidFactory from './objects/HumanoidFactory'
import ExtraCredit1Factory from './objects/ExtraCredit1Factory'
import ExtraCredit2Factory from './objects/ExtraCredit2Factory'

// Also import the OBJ loader for use in the GUI
import ObjLoader from './objects/ObjLoader'

let Interface = {
  initialize: () => {
    // The following file-input code (and the corresponding HTML) comes from:
    // https://www.abeautifulsite.net/whipping-file-inputs-into-shape-with-bootstrap-3

    // Setup a special event lister for all file inputs
    $(document).on('change', ':file', function () {
      var input = $(this)
      let numFiles = input.get(0).files ? input.get(0).files.length : 1
      let label = input.val().replace(/\\/g, '/').replace(/.*\//, '')
      input.trigger('fileselect', [numFiles, label])
    })

    // Make all file buttons fill their paired text element
    $(':File').on('fileselect', function (event, numFiles, label) {
      // Update the text field to show what was selected
      var input = $(this).parents('.input-group').find(':text')
      var log = numFiles > 1 ? numFiles + ' files selected' : label
      if (input.length) {
        input.val(log)
      } else if (log) {
        alert(log)
      }
    })
    // End borrowed file-input code

    // Initialize the tree widget
    $('#meshListTree').tree({
      data: [], autoOpen: 0
    })

    $('#meshListTree').bind('tree.select', (event) => {
      if (event.node) {
        updateSelectedMesh(event.node.meshObj)
      } else {
        updateSelectedMesh()
      }
    })

    // Geometry loading buttons form modal dialogs
    $('#createCylinder').click(() => {
      Interface.cylinderFactory.slices = parseInt($('#cylinderSlices').val())
      let mesh = Interface.cylinderFactory.generateMesh()
      Interface.widget.requestRebuild(mesh)
    })

    $('#createSphere').click(() => {
      Interface.sphereFactory.slices = parseInt($('#sphereSlices').val())
      Interface.sphereFactory.stacks = parseInt($('#sphereStacks').val())
      let mesh = Interface.sphereFactory.generateMesh()
      Interface.widget.requestRebuild(mesh)
    })

    $('#createEC1').click(() => {
      Interface.extraCredit1Factory.param1 = parseInt($('#ec1Param1').val())
      Interface.extraCredit1Factory.param2 = parseInt($('#ec1Param2').val())
      Interface.extraCredit1Factory.param3 = parseInt($('#ec1Param3').val())
      let mesh = Interface.extraCredit1Factory.generateMesh()
      Interface.widget.requestRebuild(mesh)
    })

    $('#createEC2').click(() => {
      Interface.extraCredit2Factory.param1 = parseInt($('#ec1Param1').val())
      Interface.extraCredit2Factory.param2 = parseInt($('#ec1Param2').val())
      Interface.extraCredit2Factory.param3 = parseInt($('#ec1Param3').val())
      let mesh = Interface.extraCredit2Factory.generateMesh()
      Interface.widget.requestRebuild(mesh)
    })

    $('#objLoadButton').click(() => {
      ObjLoader.loadAndAddOBJ($('#objFile')[0].files[0])
    })

    // Reset the current view
    $('#resetViewButton').click(() => {
      Interface.widget.resetView()
    })

    // Re-calculate normals
    $('#smoothNormals').click(() => {
      Interface.widget.smoothNormals()
    })

    $('#faceNormals').click(() => {
      Interface.widget.computePerFaceNormals()
    })

    // Load a shape of some type
    $('#shapeLoad').change(handleLoadShape)

    // Respond to render mode changes
    $('#renderingMode').change(handleRenderModeChange)

    // Update the transformation of the currently selected mesh
    $('.shape-trans-control').on('input', updateShapeTransformation)
  }
}

// To be set from main.js as a reference to the MeshWidget object
Interface.widget = null

// Factories used by the GUI
Interface.cubeFactory = new CubeFactory()
Interface.cylinderFactory = new CylinderFactory()
Interface.sphereFactory = new SphereFactory()
Interface.clothFactory = new ClothFactory()
Interface.sculptureFactory = new SculptureFactory()
Interface.humanoidFactory = new HumanoidFactory()
Interface.extraCredit1Factory = new ExtraCredit1Factory()
Interface.extraCredit2Factory = new ExtraCredit2Factory()

// Code for syncronizing the current scene graph with the GUI tree widget
Interface.meshNodeCount = 0
Interface.syncMeshTreeWithGeometry = () => {
  if (typeof Interface.widget._solidMesh !== 'undefined') {
    Interface.meshNodeCount = 0
    var treeDataRoot = buildTreeData(Interface.widget._solidMesh)
    updateMeshTreeWidget([treeDataRoot])
  }
}

// Expose the Interface object for use in other modules
export default Interface

// Set OBJ Loader event handler
ObjLoader.onGeometryReady = (mesh) => {
  let fileLabel = $('#objFile').parents('.input-group').find(':text').val()
  mesh.name = fileLabel
  Interface.widget.requestRebuild(mesh)
}

// Used to build the data structure used by the jQuery Tree widget
function buildTreeData (meshNode) {
  // Build Data for this node
  var dataNode = {
    name: (meshNode.name || meshNode.type + ' Node ' + (Interface.meshNodeCount++)),
    id: meshNode.uuid,
    meshObj: meshNode
  }

  // Build children list if any
  if (meshNode.children && meshNode.children.length > 0) {
    dataNode.children = []
    meshNode.children.forEach((child, index) => {
      var childDataNode = buildTreeData(child)
      if (childDataNode != null) {
        dataNode.children.push(childDataNode)
      }
    })
  }

  // Return node
  return dataNode
}

// Place the data into the jQuery tree widget
function updateMeshTreeWidget (newData) {
  $('#meshListTree').tree('loadData', newData)
}

// Update the GUI form values to match the mesh element that was just selected
function updateSelectedMesh (meshObj) {
  if (meshObj) {
    // Copy transformation properties into the GUI
    $('#xTranslate').val(sanitizeValue(meshObj.transform.position.x, 0))
    $('#yTranslate').val(sanitizeValue(meshObj.transform.position.y, 0))
    $('#zTranslate').val(sanitizeValue(meshObj.transform.position.z, 0))

    $('#xScale').val(sanitizeValue(meshObj.transform.scale.x, 1))
    $('#yScale').val(sanitizeValue(meshObj.transform.scale.y, 1))
    $('#zScale').val(sanitizeValue(meshObj.transform.scale.z, 1))

    $('#xAngle').val(sanitizeValue(meshObj.transform.rotation.x / Math.PI * 180, 0))
    $('#yAngle').val(sanitizeValue(meshObj.transform.rotation.y / Math.PI * 180, 0))
    $('#zAngle').val(sanitizeValue(meshObj.transform.rotation.z / Math.PI * 180, 0))

    $('#xPivot').val(sanitizeValue(meshObj.transform.pivot.x, 0))
    $('#yPivot').val(sanitizeValue(meshObj.transform.pivot.y, 0))
    $('#zPivot').val(sanitizeValue(meshObj.transform.pivot.z, 0))

    // Enable the transformation controls
    $('#transformSet').prop('disabled', false)
  } else {
    $('#transformSet').prop('disabled', true)
  }
}

// Update the transformation on the shape to match the GUI
// form values that were just edited.
function updateShapeTransformation (e) {
  var meshNode = $('#meshListTree').tree('getSelectedNode')
  if (meshNode) {
    let meshObj = meshNode.meshObj

    meshObj.transform.setPosition(
      sanitizeValue($('#xTranslate').val(), meshObj.transform.position.x),
      sanitizeValue($('#yTranslate').val(), meshObj.transform.position.y),
      sanitizeValue($('#zTranslate').val(), meshObj.transform.position.z)
    )

    meshObj.transform.setScale(
      sanitizeValue($('#xScale').val(), meshObj.transform.scale.x),
      sanitizeValue($('#yScale').val(), meshObj.transform.scale.y),
      sanitizeValue($('#zScale').val(), meshObj.transform.scale.z)
    )

    meshObj.transform.setRotation(
      sanitizeValue($('#xAngle').val() / 180 * Math.PI, meshObj.transform.rotation.x),
      sanitizeValue($('#yAngle').val() / 180 * Math.PI, meshObj.transform.rotation.y),
      sanitizeValue($('#zAngle').val() / 180 * Math.PI, meshObj.transform.rotation.z)
    )

    meshObj.transform.setPivot(
      sanitizeValue($('#xPivot').val(), meshObj.transform.pivot.x),
      sanitizeValue($('#yPivot').val(), meshObj.transform.pivot.y),
      sanitizeValue($('#zPivot').val(), meshObj.transform.pivot.z)
    )

    Interface.widget.syncronizeMeshes()
  }
}

// Respond when user selects a shape type from the drop-down menu
function handleLoadShape () {
  // Pick type based on index
  var typeSelector = $('#shapeLoad')[0]
  switch (typeSelector.selectedIndex) {
    // Basic geometry
    case 2:
      let mesh = Interface.cubeFactory.generateMesh()
      Interface.widget.requestRebuild(mesh)
      break

    case 3: $('#createCylinderModal').modal(); break
    case 4: $('#createSphereModal').modal(); break

    case 5:
      mesh = Interface.clothFactory.generateMesh()
      Interface.widget.requestRebuild(mesh)
      break

    // Hierarchical geometry
    case 6:
      mesh = Interface.humanoidFactory.generateMesh()
      Interface.widget.requestRebuild(mesh)
      break

    case 7:
      mesh = Interface.sculptureFactory.generateMesh()
      Interface.widget.requestRebuild(mesh)
      break

    // Extra credit geometry
    case 9: $('#createEC1Modal').modal(); break
    case 10: $('#createEC2Modal').modal(); break

    // Loading of arbitrary geometry files
    case 12: $('#objLoadModal').modal(); break

    // Selector indexes that are decorative
    case 0: case 1: case 8: case 11:
      // These cases deliberately left blank
      break

    // Should never happen (but you know, code can change)
    default:
      console.log('ERROR: Unexpected index in geometry type selector')
      break
  }

  // Reset both selectors back to zero index
  typeSelector.selectedIndex = 0
  $('#renderingMode')[0].selectedIndex = 0
}

// Respond when the user changes the current rendering mode
function handleRenderModeChange () {
  var modeSelector = $('#renderingMode')[0]
  switch (modeSelector.selectedIndex) {
    case 0:
      Interface.widget.toggleSolid(true)
      Interface.widget.toggleWireframe(false)
      Interface.widget.toggleDebug(false)
      break

    case 1:
      Interface.widget.toggleSolid(true)
      Interface.widget.toggleWireframe(true)
      Interface.widget.toggleDebug(false)
      break

    case 2:
      Interface.widget.toggleSolid(false)
      Interface.widget.toggleWireframe(true)
      Interface.widget.toggleDebug(false)
      break

    case 4:
      Interface.widget.toggleSolid(false)
      Interface.widget.toggleWireframe(false)
      Interface.widget.toggleDebug(true)
      break

    case 13:
      Interface.widget.toggleSolid(false)
      Interface.widget.toggleWireframe(true)
      Interface.widget.toggleDebug(true)
      break

    // Selector indexes that are decorative
    case 3:
      // This case deliberately left blank
      break

    // Should never happen (but see default case above)
    default:
      console.log('ERROR: Unexpected index in rendering mode selector')
      break
  }
}

// check that a value is defined or fall back to default
function sanitizeValue (value, fallback) {
  return ((typeof value !== 'undefined') ? value : fallback)
}
