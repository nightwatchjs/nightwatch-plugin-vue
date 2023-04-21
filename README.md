# @nightwatch/vue 

<p align=center>
  <img alt="Nightwatch.js Logo" src="https://raw.githubusercontent.com/nightwatchjs/nightwatch-plugin-vue/main/.github/assets/nightwatch-logo.png" width=200 />
  <img alt="Vue Logo" src="https://raw.githubusercontent.com/nightwatchjs/nightwatch-plugin-vue/main/.github/assets/vuejs-logo.svg" width=200 />
</p>

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![Discord][discord-badge]][discord]
[![MIT License][license-badge]][license]

Official Nightwatch plugin which adds component testing support for Vue apps.
It uses the [Vite](https://vitejs.dev/) dev server under the hood and [vite-plugin-nightwatch](https://github.com/nightwatchjs/vite-plugin-nightwatch). Requires Nightwatch 2.4+

```
npm install @nightwatch/vue
```

## Usage:

Update your [Nightwatch configuration](https://nightwatchjs.org/guide/configuration/overview.html) and add the plugin to the list:

```js
module.exports = {
  plugins: ['@nightwatch/vue']
  
  // other nightwatch settings...
}
```

### Already using Vite in your project?
If you already have a Vite project, then the `@nightwatch/vue` plugin will try to use the existing `vite.config.js` or `vite.config.ts`, if either one is found.

Check the [vite-plugin-nightwatch](https://github.com/nightwatchjs/vite-plugin-nightwatch) project for more configuration options.

Update the `vite.config.js` and add the `vite-plugin-nightwatch` plugin:

```js
// vite.config.js

import nightwatchPlugin from 'vite-plugin-nightwatch'

export default {
  plugins: [
    // ... other plugins, such as vue()
    nightwatchPlugin()
  ]
})
```
### Configuration
We’ve designed the `@nightwatch/vue` plugin to work with sensible configuration defaults, but in some more advanced scenarios you may need to change some of the config options.

#### Vite dev server
By default, Nightwatch will attempt to start the Vite dev server automatically. You can disable that by adding the below in your `nightwatch.conf.js` file, under the `vite_dev_server` dictionary.

This is common to other component testing plugins that are based on Vite, such as the `@nightwatch/react` plugin.

```js
// nightwatch.conf.js

module.exports = {
  plugins: ['@nightwatch/vue'],
  vite_dev_server: {
    start_vite: true,
    port: 5173
  }
}
```

#### Plugin options
The plugin accepts a few config options which can be set when working with an existing `vite.config.js` file in the project.

##### - `renderPage`
Specify the path to a custom test renderer to be used. A default renderer is included in the package, but this option can overwrite that value.

```js
// vite.config.js

export default {
  plugins: [
    // ... other plugins, such as vue() or react()
    nightwatchPlugin({
      renderPage: './src/test_renderer.html'
    })
  ]
}
```

## API Commands:
This plugin includes a few Nightwatch commands which can be used while
writing Vue component tests.

### - browser.mountComponent(`componentPath`, `[options]`, `[callback]`):
**Parameters:**
- `componentPath` – location of the component file (`.jsx`) to be mounted
- `options` – this can include:
  - `props` - properties to be passed to the Vue component, this will be serialized to JSON
  - `plugins`: if needed, a store (VueX or Pinia) and a router can be loaded together with the component
  - `mocks`: this can be a list of url calls that can be mocked (will be passed to [sinon](https://sinonjs.org/) automatically); at the moment only [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) calls can be mocked, but XHR support will be added soon.
- `callback` – an optional callback function which will be called with the component element

#### Example:

```js
const component = await browser.mountComponent('/src/components/Form.vue')
```

```js
const component = await browser.mountComponent('/src/components/Welcome.vue', {
  props: {
    username: 'John Doe'
  }
})
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

However, since Nightwatch v2.4 we provide several ways to inspect and debug the mounted component using the browser devtools console. Refer to the guide page on our docs website for more details:
https://nightwatchjs.org/guide/component-testing/debugging.html

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

### Example project
We've put together a basic To-do app written in Vue and built on top of Vite which can be used as a boilerplate. It can be found at [nightwatchjs-community/todo-vue](https://github.com/nightwatchjs-community/todo-vue).



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
