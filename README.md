### Webpack Zephir Watcher Plugin
This plugin is very naive at the moment. It is PoC that (Webpack)[https://github.com/webpack] could be used as a build tool for (Zephir)[https://github.com/phalcon/zephir].
The use case for this plugin is it will continuously re-install your zephir module when your FS triggers a save event for any of your `.zep` files.

##### For your `webpack.config.js`
```javascript
plugins: [
  new ZephirWatcherPlugin({
    basePath: __dirname + '/zephir-module'
  })
]
```
