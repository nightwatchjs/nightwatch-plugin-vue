import { NightwatchAPI, Element } from 'nightwatch';

type RecordObject = Record<string, any>;

declare module 'nightwatch' {
  interface NightwatchAPI {
    importScript(
      scriptPath: string,
      options: { scriptType: string; componentType: string },
      callback?: () => void
    ): this;
    mountComponent(
      componentPath: string,
      options?: { plugins: RecordObject; mocks: RecordObject },
      callback?: (this: NightwatchAPI, result: Element) => void
    ): Awaitable<this, Element>;
    launchComponentRenderer(): this;
  }
}
