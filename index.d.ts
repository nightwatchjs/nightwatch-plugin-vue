import { NightwatchAPI, Element } from 'nightwatch';
import { MountingOptions } from '@vue/test-utils';

type GlobalMountOptions = NonNullable<MountingOptions<any>['global']>;

declare module 'nightwatch' {
  interface NightwatchAPI {
    importScript(
      scriptPath: string,
      options: { scriptType: string; componentType: string },
      callback?: () => void
    ): this;
    mountComponent(
      componentPath: string,
      options?: {
        props?: MountingOptions<Record<string, any>>['props'];
        plugin?: Pick<GlobalMountOptions, 'plugins'>;
        mocks?: Pick<GlobalMountOptions, 'mocks'>;
      },
      callback?: (this: NightwatchAPI, result: Element) => void
    ): Awaitable<this, Element>;
    launchComponentRenderer(): this;
  }
}
