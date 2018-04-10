// Import jQuery as the usual '$' variable
import $ from 'jquery'

// Initialize the jquery Tree Plugin
import 'jqtree/jqtree.css'
import 'jqtree/tree.jquery'

// Initialize the Bootstrap Slider plugin
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import 'bootstrap-slider/dist/bootstrap-slider'

// Global configuraiton values
import config from './config.js'

// Import the animatino factory for use in the GUI
import AnimationFactory from './objects/AnimationFactory'

let Interface = {
  initialize: () => {
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

    // Build lists of tick marks and labels
    let ticksArray = [0]
    for (let tickMark = config.FRAME_MARKS; tickMark < config.MAX_FRAMES; tickMark += config.FRAME_MARKS) {
      ticksArray.push(tickMark)
    }
    ticksArray.push(config.MAX_FRAMES)

    // Initialize the frame slider
    Interface.frameSlider = $('#frameSlider').slider({
      min: 0, max: config.MAX_FRAMES, value: 0, ticks: ticksArray
    })

    // Whenever frame slider value changes, request an update
    Interface.frameSlider.slider('on', 'change', () => {
      Interface.widget.updateMeshFrame(Interface.frameSlider.slider('getValue'))
      updateCurrentlySelectedMesh()
    })

    // Reset the current view
    $('#resetViewButton').click(() => { Interface.widget.resetView() })

    // Start/stop the animaiton
    $('#playPauseButton').click(playPauseEvent)

    // Set a keyframe
    $('#setKeyframeButton').click(setKeyFrameEvent)

    // Load animation of some type
    $('#animLoad').change(handleLoadAnimation)

    // Update the transformation of the currently selected mesh
    $('.shape-trans-control').on('input', () => {
      $('#setKeyframeButton').removeClass('btn-success')
      $('#setKeyframeButton').addClass('btn-danger')
      updateShapeTransformation()
    })
    $('.shape-trans-control').prop('disabled', true)
  }
}

// To be set from main.js as a reference to the MeshWidget object
Interface.widget = null

// Factories used by the GUI
Interface.animFactory = new AnimationFactory()

// Code for syncronizing the current scene graph with the GUI tree widget
Interface.meshNodeCount = 0
Interface.syncMeshTreeWithGeometry = () => {
  if (typeof Interface.widget._solidMesh !== 'undefined') {
    Interface.meshNodeCount = 0
    let treeDataRoot = buildTreeData(Interface.widget._solidMesh)
    updateMeshTreeWidget([treeDataRoot])
  }
}

// Expose the Interface object for use in other modules
export default Interface

// Used to build the data structure used by the jQuery Tree widget
function buildTreeData (meshNode) {
  // Build Data for this node
  let dataNode = {
    name: (meshNode.name || meshNode.type + ' Node ' + (Interface.meshNodeCount++)),
    id: meshNode.uuid,
    meshObj: meshNode
  }

  // Build children list if any
  if (meshNode.children && meshNode.children.length > 0) {
    dataNode.children = []
    meshNode.children.forEach((child, index) => {
      let childDataNode = buildTreeData(child)
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

function advanceFrameEvent () {
  // Advance the frame wrapping around to zero
  let curFrame = Interface.frameSlider.slider('getValue')

  curFrame++
  if (curFrame > Interface.frameSlider.slider('getAttribute', 'max')) {
    curFrame = Interface.frameSlider.slider('getAttribute', 'min')
  }

  // Move slider triggering only the change event
  Interface.frameSlider.slider('setValue', curFrame, false, true)
}

let animationPlaying = false
let intervalID = -1
function playPauseEvent () {
  // Reverse 'animationPlaying' and adjust GUI and events
  animationPlaying = !animationPlaying
  if (animationPlaying) {
    // Update the GUI widgets
    $('#animLoad').prop('disabled', true)
    $('#setKeyframeButton').prop('disabled', true)
    Interface.frameSlider.slider('disable')
    $('#playPauseButton').html('<span class="glyphicon glyphicon-pause"></span>')

    // Create a new 'interval' to fire at the desired Frame Rate
    intervalID = setInterval(advanceFrameEvent, 1000 / config.TARGET_FPS)
  } else {
    // Update the GUI widgets
    $('#animLoad').prop('disabled', false)
    $('#setKeyframeButton').prop('disabled', false)
    Interface.frameSlider.slider('enable')
    $('#playPauseButton').html('<span class="glyphicon glyphicon-play"></span>')

    // Stop the 'interval' event
    clearInterval(intervalID)

    // Update the selected mesh one last time
    updateCurrentlySelectedMesh()
  }
}

function setKeyFrameEvent () {
  // Retrieve the currently selected node
  let meshNode = $('#meshListTree').tree('getSelectedNode')
  if (meshNode && meshNode.meshObj) {
    // Get the current framenumber
    let frameNumber = Interface.frameSlider.slider('getValue')

    // Set/Re-set/Delete key frame and syncronize the key frame button
    if (meshNode.meshObj.frameIsKeyFrame(frameNumber)) {
      if ($('#setKeyframeButton').hasClass('btn-danger')) {
        // Update currently set keyframe by saving over it
        meshNode.meshObj.saveKeyframe(frameNumber)
        $('#setKeyframeButton').addClass('btn-success')
        $('#setKeyframeButton').removeClass('btn-danger')
      } else {
        // Remove the currently set keyframe
        meshNode.meshObj.removeKeyframe(frameNumber)
        $('#setKeyframeButton').removeClass('btn-success')
        $('#setKeyframeButton').removeClass('btn-danger')
      }
    } else {
      // Clone the current transform and add as keyframe
      meshNode.meshObj.saveKeyframe(frameNumber)
      $('#setKeyframeButton').addClass('btn-success')
      $('#setKeyframeButton').removeClass('btn-danger')
    }
    updateSelectedMesh(meshNode.meshObj)
  }
}

function updateCurrentlySelectedMesh () {
  // Get the currently selected node and update it
  let meshNode = $('#meshListTree').tree('getSelectedNode')
  if (meshNode && meshNode.meshObj) {
    updateSelectedMesh(meshNode.meshObj)
  }
}

// Update the GUI form values to match the mesh element that was just selected
function updateSelectedMesh (meshObj) {
  // Default the key frame button to disabled
  $('#setKeyframeButton').prop('disabled', true)

  if (meshObj) {
    // Copy transformation properties into the GUI
    $('#xTranslate').val(sanitizeValue(meshObj.transform._position.x, 0))
    $('#yTranslate').val(sanitizeValue(meshObj.transform._position.y, 0))
    $('#zTranslate').val(sanitizeValue(meshObj.transform._position.z, 0))

    $('#xScale').val(sanitizeValue(meshObj.transform._scale.x, 1))
    $('#yScale').val(sanitizeValue(meshObj.transform._scale.y, 1))
    $('#zScale').val(sanitizeValue(meshObj.transform._scale.z, 1))

    $('#xAngle').val(sanitizeValue(meshObj.transform._rotation.x / Math.PI * 180, 0))
    $('#yAngle').val(sanitizeValue(meshObj.transform._rotation.y / Math.PI * 180, 0))
    $('#zAngle').val(sanitizeValue(meshObj.transform._rotation.z / Math.PI * 180, 0))

    $('#xPivot').val(sanitizeValue(meshObj.transform._pivotPoint.x, 0))
    $('#yPivot').val(sanitizeValue(meshObj.transform._pivotPoint.y, 0))
    $('#zPivot').val(sanitizeValue(meshObj.transform._pivotPoint.z, 0))

    // Update keyframe button
    if (meshObj.frameIsKeyFrame(Interface.frameSlider.slider('getValue'))) {
      $('#setKeyframeButton').addClass('btn-success')
      $('#setKeyframeButton').removeClass('btn-danger')
    } else {
      $('#setKeyframeButton').removeClass('btn-success')
      $('#setKeyframeButton').removeClass('btn-danger')
    }

    // Enable the set keyframe button
    $('#setKeyframeButton').prop('disabled', false)

    // Enable the transformation controls
    if (!animationPlaying) {
      $('.shape-trans-control').prop('disabled', false)
    }
  } else {
    $('.shape-trans-control').prop('disabled', true)
  }
}

// Update the transformation on the shape to match the GUI
// form values that were just edited.
function updateShapeTransformation (e) {
  let meshNode = $('#meshListTree').tree('getSelectedNode')
  if (meshNode) {
    let meshObj = meshNode.meshObj

    meshObj.transform.setPosition(
      sanitizeValue(parseFloat($('#xTranslate').val()), meshObj.transform.position.x),
      sanitizeValue(parseFloat($('#yTranslate').val()), meshObj.transform.position.y),
      sanitizeValue(parseFloat($('#zTranslate').val()), meshObj.transform.position.z)
    )

    meshObj.transform.setScale(
      sanitizeValue(parseFloat($('#xScale').val()), meshObj.transform.scale.x),
      sanitizeValue(parseFloat($('#yScale').val()), meshObj.transform.scale.y),
      sanitizeValue(parseFloat($('#zScale').val()), meshObj.transform.scale.z)
    )

    meshObj.transform.setRotation(
      sanitizeValue(parseFloat($('#xAngle').val()) / 180 * Math.PI, meshObj.transform.rotation.x),
      sanitizeValue(parseFloat($('#yAngle').val()) / 180 * Math.PI, meshObj.transform.rotation.y),
      sanitizeValue(parseFloat($('#zAngle').val()) / 180 * Math.PI, meshObj.transform.rotation.z)
    )

    meshObj.transform.setPivot(
      sanitizeValue(parseFloat($('#xPivot').val()), meshObj.transform.pivot.x),
      sanitizeValue(parseFloat($('#yPivot').val()), meshObj.transform.pivot.y),
      sanitizeValue(parseFloat($('#zPivot').val()), meshObj.transform.pivot.z)
    )

    Interface.widget.syncronizeMeshes()
  }
}

// Respond when user selects an animation type from the drop-down menu
function handleLoadAnimation () {
  let mesh

  // Pick type based on index
  let typeSelector = $('#animLoad')[0]
  switch (typeSelector.selectedIndex) {
    // Animations
    case 2:
      mesh = Interface.animFactory.generateWalk()
      Interface.widget.requestRebuild(mesh)
      Interface.widget.updateMeshFrame(0)
      Interface.frameSlider.slider('setValue', 0)
      $('#setKeyframeButton').prop('disabled', true)
      break

    case 3:
      mesh = Interface.animFactory.generateOther()
      Interface.widget.requestRebuild(mesh)
      Interface.widget.updateMeshFrame(0)
      Interface.frameSlider.slider('setValue', 0)
      $('#setKeyframeButton').prop('disabled', true)
      break

    // Selector indexes that are decorative
    case 0: case 1:
      // This case deliberately left blank
      break

    // Should never happen (but you know, code can change)
    default:
      console.log('ERROR: Unexpected index in geometry type selector')
      break
  }

  // Reset selector back to zero index
  typeSelector.selectedIndex = 0
}

// check that a value is defined or fall back to default
function sanitizeValue (value, fallback) {
  return (value || fallback)
}
