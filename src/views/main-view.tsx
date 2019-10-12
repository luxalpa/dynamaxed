import { Component, Vue } from "vue-property-decorator";
import { Toolbar } from "@/components/toolbar";
import Navbar from "@/components/navbar";
import { ViewManager } from "@/modules/view-manager";
import * as tsx from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";

export const MainView = tsx.componentFactory.create({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    const Content = ViewManager.activeView;

    return [
      <Navbar />,

      <Toolbar />,
      <v-content>
        <Content />
      </v-content>
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
