import { ViewManager } from "@/modules/view-manager";
import * as tsx from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";
// @ts-ignore
import "splitpanes/dist/splitpanes.css";
import { Menubar } from "@/components/menubar";

export const MainView = tsx.componentFactory.create({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    const Content = ViewManager.activeView;

    return [
      <Menubar />

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
