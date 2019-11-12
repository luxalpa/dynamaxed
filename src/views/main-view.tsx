import { Component, Vue } from "vue-property-decorator";
import { Toolbar } from "@/components/toolbar";
import Navbar from "@/components/navbar";
import { ViewManager } from "@/modules/view-manager";
import * as tsx from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";
import { Button } from "@/components/button";
import { TextInput } from "@/components/text-input";
import { LayoutManager } from "@/modules/layout-manager";
import LayoutState = LayoutManager.LayoutState;
// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { Panel } from "@/components/panel";

function buildLayout(h: CreateElement, obj: LayoutState | string) {
  if (typeof obj == "string") {
    let Comp = LayoutManager.panels[obj];
    if (!Comp) {
      throw new Error(`Component '${obj}' not registered`);
    }
    return (
      <Panel>
        <Comp />
      </Panel>
    );
  }

  let onResize = function(e: Array<any>) {
    obj.weights = e.map(e => e.size);
  };

  return (
    <Splitpanes
      class="default-theme"
      onresize={onResize}
      horizontal={obj.kind === "h"}
    >
      {obj.children.map((v: string | LayoutState, i: number) => (
        <Pane size={obj.weights[i]}>{buildLayout(h, v)}</Pane>
      ))}
    </Splitpanes>
  );
}

export const MainView = tsx.componentFactory.create({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    const Content = ViewManager.activeView;

    return [
      <Toolbar />,
      <div class="masterpanel">
        {buildLayout(createElement, LayoutManager.layoutState)}
      </div>

      /*<div>
        <Button>Click me outside!</Button>
        <TextInput />
        <Splitter>
          <Button>In Splitter</Button>
          <TextInput />
        </Splitter>
      </div>*/

      /*,

      <Toolbar />,
      <v-content>
        <Content />
      </v-content>*/
    ];
  }
});

// @Component({
//   name: "MainView"
// })
// export default class MainView extends Vue {
//   render() {
//     const Content = ViewManager.activeView;
//
//     return (
//       <div id="mainView">
//         <Toolbar />
//         {/*<div id="main-wrapper">*/}
//         {/*  <Navbar />*/}
//         {/*  <div id="content">*/}
//         {/*    <Content />*/}
//         {/*  </div>*/}
//         {/*</div>*/}
//       </div>
//     );
//   }
// }
