var _ = require('underscore');
var glob = require('glob');

function ZephirWatcherPlugin(options) {
  var util = {
    basePath: function() { return options['basePath'] },
    unionPaths: function(currentFiles) { return _.union(currentFiles, this.globPaths()); },
    globPaths: function() {
      var globPattern = __dirname + '/' + this.basePath() + "/**/*";
      var paths = glob.sync(globPattern);
      return paths;
    }
  }
  return {
    apply: (function(options, compiler) {
      compiler.plugin("after-compile", function(compilation, callback) {
        compilation.fileDependencies = util.unionPaths(compilation.fileDependencies)
        callback();
      });
    }).bind(this, options)
  }
}

module.exports = ZephirWatcherPlugin
