import Vue, { FunctionalComponentOptions, VNode } from "vue";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    // type ElementClass = any;
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module "typestyle/lib/types" {
  interface CSSProperties {
    "-webkit-font-smoothing"?: string;
    "-moz-osx-font-smoothing"?: string;
  }
}
