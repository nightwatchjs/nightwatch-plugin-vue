const path = require('path');
const fs = require('fs');
const vite = require('./vite.js');
const getPort = require('get-port')

const vite_dev_server = {
  port: process.argv.includes('--test-worker') ? null : 5173
};
try {
  const nightwatch_config = require(path.resolve('./nightwatch.conf.js'));
  Object.assign(vite_dev_server, nightwatch_config.vite_dev_server || {});
} catch (err) {}

const projectJsConfigFile = path.join(process.cwd(), 'vite.config.js');
const projectTsConfigFile = path.join(process.cwd(), 'vite.config.ts');

const hasProjectJsConfigFile = () => {
  try {
    if(fs.statSync(projectJsConfigFile).isFile()) {
      return projectJsConfigFile;
    }
  } catch(err) {
    if(fs.statSync(projectTsConfigFile).isFile()) {
      return projectTsConfigFile;
    }

    return false;
  }
}

module.exports = async function() {
  const viteConfig = {
    port: vite_dev_server.port
  };
  
  if(!viteConfig.port) {
    viteConfig.port = await getPort();
  }
  const projectConfigFile = hasProjectJsConfigFile();
  viteConfig.configFile = projectConfigFile ? projectFile : path.join(__dirname, '../vite.config.js');
  
  const viteServer = await vite.start(viteConfig);
  const nightwatchPlugin = viteServer.middlewares.stack.find(item => item.route === '_nightwatch');

  if(!nightwatchPlugin) {
    const error = new Error('Missing vite-plugin-nightwatch in '+ projectConfigFile)
    const code = `:
    
    import nightwatchPlugin from 'vite-plugin-nightwatch'

    export default {
      plugins: [
        // ... other plugins
        nightwatchPlugin({
          componentType: 'vue'
        })
      ]
    };
    `;
    error.help = ['Please ensure that "vite-nightwatch-plugin" is loaded in your Vite config file ' + code];
     throw err;
  } 
    global.viteServer = viteServer;

};

  
