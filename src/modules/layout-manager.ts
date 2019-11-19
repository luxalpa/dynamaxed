import { Test1, Test2 } from "@/panels/test";
import { AssetManagerPanel } from "@/panels/asset-manager-panel";
import { InspectorPanel } from "@/panels/inspector";

export namespace LayoutManager {
  export let panels: Record<string, any> = {};
  export function registerPanel(name: string, cmp: any) {
    panels[name] = cmp;
  }

  export interface LayoutState {
    kind: "v" | "h";
    weights: number[];
    children: (string | LayoutState)[];
  }

  export let layoutState: LayoutState | string = {
    kind: "v",
    weights: [70, 30],
    children: ["asset-manager", "inspector"]
  };
}

LayoutManager.registerPanel("test1", Test1);
LayoutManager.registerPanel("test2", Test2);
LayoutManager.registerPanel("asset-manager", AssetManagerPanel);
LayoutManager.registerPanel("inspector", InspectorPanel);
