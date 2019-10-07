import { Component, Vue } from "vue-property-decorator";
import Toolbar from "@/components/toolbar";
import Navbar from "@/components/navbar";
import { ViewManager } from "@/modules/view-manager";

@Component({
  name: "MainView"
})
export default class MainView extends Vue {
  render() {
    const Content = ViewManager.activeView;

    return (
      <div id="mainView">
        <Toolbar />
        <div id="main-wrapper">
          <Navbar />
          <div id="content">
            <Content />
          </div>
        </div>
      </div>
    );
  }
}
