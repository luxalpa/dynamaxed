import { Component, Vue } from "vue-property-decorator";
import { ViewManager, Views } from "@/modules/view-manager";

@Component({
  name: "Navbar"
})
export default class Navbar extends Vue {
  render() {
    return (
      <v-navigation-drawer permanent clipped={true} app stateless width={200}>
        <v-list dense>
          {Object.keys(Views).map(view => {
            if (ViewManager._activeView === view) {
            }
            return (
              <v-list-item
                key={view}
                input-value={ViewManager._activeView === view}
                onclick={() => ViewManager.setActiveView(view as any)}
              >
                <v-list-item-content>
                  <v-list-item-title>{view}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            );
          })}
        </v-list>
      </v-navigation-drawer>
    );
  }
}
