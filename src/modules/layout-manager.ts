import { Test1, Test2 } from "@/panels/test";

export namespace LayoutManager {
  export let panels: Record<string, any> = {};
  export function registerPanel(name: string, cmp: any) {
    panels[name] = cmp;
  }

  export interface LayoutState {
    kind: "v" | "h";
    weight: number;
    left: string | LayoutState;
    right: string | LayoutState;
  }

  export let layoutState: LayoutState | string = {
    kind: "h",
    weight: 50,
    left: "test1",
    right: {
      kind: "v",
      weight: 50,
      left: "test2",
      right: "test1"
    }
  };
}

LayoutManager.registerPanel("test1", Test1);
LayoutManager.registerPanel("test2", Test2);
