var compiler = {
  zephirCompile: function(callback) {
    var args = ['install'];
    child = require('child_process').spawn('zephir', args);
    var self = this;

    // Send data to the child process via its stdin stream
    // child.stdin.write(content);
    child.stdin.end();

    // Keep track of wich buffer is closed, since we can not determine it ourself.
    // We could use the "ended" property, but this one is not a public one
    // @See https://github.com/nodejs/node-v0.x-archive/blob/v0.11.11/lib/_stream_readable.js#L50
    var outIsClosed = false;
    var errIsClosed = false;

    /**
    * Run each time one of the two stream is closed.
    * If the two streams (out and err) are closed, then fire the callback:
    *   - if something went out on stderr, consider this as an error, and fire an error,
    *   - otherwise, everything went fine, and stream out the zephir content.
    */
    function endOfZephir() {
    // Listen for any response from the child:
      var fullFile = "";
      var fullError = "";
      if (outIsClosed && errIsClosed) {
        if (fullError) {
          self.emitError(fullError);
          callback(fullError);
        } else {
          callback(null, fullFile);
        }
      }
    }

    // Listen for content
    child.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    // Listen for errors
    child.stderr.on('data', function (data) {
      console.log(data.toString());
    });

    // When strout is closed, test if the process is ended
    child.stdout.on('end', function () {
      outIsClosed = true;
      endOfZephir();
    });

    // When strerr is closed, test if the process is ended
    child.stderr.on('end', function () {
      errIsClosed = true;
      endOfZephir();
    });
  }
}

module.exports = compiler;
