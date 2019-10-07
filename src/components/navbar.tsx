import { Component, Vue } from "vue-property-decorator";
import { ViewManager, Views } from "@/modules/view-manager";

@Component({
  name: "Navbar"
})
export default class Navbar extends Vue {
  render() {
    return (
      <div id="navbar">
        {Object.keys(Views).map(view => {
          let classes = ["navbar-btn"];
          if (ViewManager._activeView === view) {
            classes.push("active");
          }
          return (
            <div
              class={classes}
              onclick={() => ViewManager.setActiveView(view as any)}
            >
              {view}
            </div>
          );
        })}
      </div>
    );
  }
}
