var _ = require('underscore');
var glob = require('glob');
var path = require('path')

var cli = require('./zephir-compile.js');

function ZephirWatcherPlugin(options) {
  var util = {
    extensions: function() {
      if(!options['extensions']) {
          return ['.zep'];
      } else {
          return options['extensions'];
      }
    },
    basePath: function() { return options['basePath'] },
    unionPaths: function(currentFiles) { return _.union(currentFiles, this.globPaths()); },
    globPaths: function() {
      var globPattern = this.basePath() + "/**/*";
      var paths = glob.sync(globPattern);
      return paths;
    }
  };
  return {
    apply: (function(options, compiler) {
      compiler.plugin("after-compile", function(compilation, callback) {
        compilation.fileDependencies = util.unionPaths(compilation.fileDependencies)
        callback();
      });

      compiler.plugin("watch-run", function(watching, done) {
        var files = Object.keys(watching.compiler.watchFileSystem.watcher.mtimes);
        var zepFiles = _.filter(files, function(file){
            if(util.extensions().indexOf(path.extname(file)) > -1){
                return true;
            } else {
                return false;
            }
        });
        if(zepFiles.length > 0) {
            console.log(zepFiles[0]);
            cli.zephirCompile(done);
        }
        done();
      });
    }).bind(this, options)
  }
}

module.exports = ZephirWatcherPlugin
