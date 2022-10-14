# @nightwatch/vue 
Vue component testing plugin for Nightwatch

<p align=center>
  <img alt="Nightwatch.js Logo" src="https://raw.githubusercontent.com/nightwatchjs/nightwatch-plugin-vue/main/.github/assets/nightwatch-logo.png" width=200 />
  <img alt="Vue Logo" src="https://raw.githubusercontent.com/nightwatchjs/nightwatch-plugin-vue/main/.github/assets/vue-logo.svg" width=200 />
</p>

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![Discord][discord-badge]][discord]
[![MIT License][license-badge]][license]

Official Nightwatch plugin which adds component testing support for Vue apps.
It uses the [Vite](https://vitejs.dev/) dev server under the hood and [vite-plugin-nightwatch](https://github.com/nightwatchjs/vite-plugin-nightwatch). Requires Nightwatch 2.3+

```
npm install @nightwatch/vue
```

## Usage:

### Configuration
Update your [Nightwatch configuration](https://nightwatchjs.org/guide/configuration/overview.html) and add the plugin to the list:

```js
module.exports = {
  plugins: ['@nightwatch/vue']
  
  // other nightwatch settings...
}
```

### Update your Nightwatch globals file

If you're not already using external globals with Nightwatch, go ahead and create a new file (e.g. `test/globals.js`) and then set the path in your Nightwatch config file:

```js
module.exports = {
  plugins: ['@nightwatch/vue'],
  
  globals_path: 'test/globals.js'
  // other nightwatch settings...
}
```

Read more about [external globals](https://nightwatchjs.org/guide/using-nightwatch/external-globals.html) on the Nightwatch docs website.

**`test/globals.js`:**
```js
const {setup, teardown} = require('@nightwatch/vue');

module.exports = {
  async before() {
    const viteServer = await setup({
      // you can optionally pass an existing vite.config.js file
      // viteConfigFile: '../vite.config.js'
    });
    
    // This will make sure the launch Url is set correctly when mounting the Vue component
    this.launchUrl = `http://localhost:${viteServer.config.server.port}`;
  },

  async after() {
    await teardown();
  }
}
```

## Already using Vite in your project?

If your project is already based on Vite and you'd like to use the same config file, you can either:
- pass the `viteConfigFile` property to the `setup()` method in the `before()` hook above
- run your Vite dev server separately by doing `npm run dev`

Check the [vite-plugin-nightwatch](https://github.com/nightwatchjs/vite-plugin-nightwatch) project for more configuration options.

## API Commands:
This plugin includes a few Nightwatch commands which can be used while
writing Vue component tests.

### - browser.mountComponent(`componentPath`, `[options]`, `[callback]`):
**Parameters:**
- `componentPath` – location of the component file (`.jsx`) to be mounted
- `options` – this can include:
  - `plugins`: if needed, a store (VueX or Pinia) and a router can be loaded together with the component
  - `mocks`: this can be a list of url calls that can be mocked (will be passed to [sinon](https://sinonjs.org/) automatically); at the moment only [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) calls can be mocked, but XHR support will be added soon.
- `callback` – an optional callback function which will be called with the component element

#### Example:

```js
const component = await browser.mountComponent('/src/components/Form.vue')
```

```js
const component = await browser.mountComponent('/src/components/Form.vue', {
  plugins: {
    store: '/src/lib/store.js',
      router: '/src/lib/router.js'
  },

  mocks: {
    '/api/get-user': {
      type: 'fetch',
        body: {
        data: {
          "firstName": "Jimmy",
          "lastName": "Hendrix"
        }
      }
    }
  }
})
```

### - browser.launchComponentRenderer():
This will call `browser.navigateTo('/test_renderer/')` and open the browser. Needs to be used before the `.importScript()` command, if used.

You can also set `launchUrl` as a global at runtime and then the url to be used will be `${browser.globals.launchUrl}/test_renderer`, which makes it possible to set the launch url dynamically.

### - browser.importScript(`scriptPath`, `[options]`, `[callback]`):
**Parameters:**
- `scriptPath` – location of the script file to inject into the page which will render the component; needs to be written in ESM format
- `options` – this can include:
  - `scriptType`: the `type` attribute to be set on the `<script>` tag (default is `module`)
  - `componentType`: should be set to `'vue'`
- `callback` – an optional callback function which will be called with the component element

#### Example:
```js
const formComponent = await browser
  .launchComponentRenderer()
  .importScript('/test/lib/scriptToImport.js');
```

Example `scriptToImport.js`:
```js
import { createApp } from 'vue';
import App from "/test/components/App.vue";

createApp(App).mount("#app");
```

## Debugging Component Tests
Debugging component tests in Nightwatch isn't as straightforward as debugging a regular Node.js application or service, since Nightwatch needs to inject the code to render to component into the browser.

However, for when running the tests in Chrome, you can use the DevTools to do debugging directly in the browser. For this purpose, Nightwatch provide 2 CLI flags:
- `--devtools` - when this is on, the Chrome DevTools will open automatically
- `--debug` - this will cause the test execution to pause right after the component is rendered

### Example:
```sh
npx nightwatch test/src/userInfoTest.js --devtools --debug
```

## Run tests:

Tests for this project are written in Nightwatch, so you can inspect them as
examples, located in the [tests/src] folder.

Run them with::
```sh
npm test 
```


## License
MIT

[build-badge]: https://github.com/nightwatchjs/nightwatch-plugin-vue/actions/workflows/node.js.yml/badge.svg?branch=main
[build]: https://github.com/nightwatchjs/nightwatch-plugin-vue/actions/workflows/node.js.yml
[version-badge]: https://img.shields.io/npm/v/@nightwatch/vue.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nightwatch/vue
[license-badge]: https://img.shields.io/npm/l/@nightwatch/vue.svg?style=flat-square
[license]: https://github.com/nightwatchjs/nightwatch-plugin-vue/blob/main/LICENSE
[discord-badge]: https://img.shields.io/discord/618399631038218240.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/SN8Da2X
