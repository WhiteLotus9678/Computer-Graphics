/* eslint-disable no-undef */

/**
 * Load obj files using the HTML5 fileReader api (similar to load).
 * If using Modular JS, be sure to import this AFTER the OBJLoader.
 * Original idea form: https://github.com/mrdoob/three.js/issues/6130
 * @param {Array} file A blob returned by a file select input.
 * @param {function} callback function to call once the loading is
 *          done (receives the resulting geometry as a parmeter)
 */
THREE.OBJLoader.prototype.load2 = function (file, callback) {
  // Need reference to the loader, the file object and a file reader
  var scope = this
  var reader = new FileReader()

  // Once the file finishes reading, parse it and use callback if applicable
  reader.onload = (event) => {
    if (event.target.readyState === 2 || event.target.status === 0) {
      // Decode the results to a string
      var dataView = new DataView(event.target.result)
      var decoder = new TextDecoder('utf-8')
      var decodedString = decoder.decode(dataView)

      // Parse the string (or the error text if decoding failed)
      var meshHierarchy = scope.parse(decodedString || event.target.responseText)

      // Dispatch the necessary events after loading
      // scope.dispatchEvent({type: 'load', content: geometry});
      if (callback) { callback(meshHierarchy) }
    } else {
      // Dispatch an error message
      scope.dispatchEvent({
        type: 'error',
        message: 'Couldn\'t load URL [' + url + ']',
        response: event.target.readyState
      })
    }
  }

  // Read the file data (happens asyncronously and calls onload when done)
  reader.readAsArrayBuffer(file)
}
