import { ViewManager } from "@/modules/view-manager";
import { Menubar } from "@/components/menubar";
import { Navbar } from "@/components/navbar";
import { stylesheet } from "typestyle";
import { Component, Vue } from "vue-property-decorator";

@Component
export class MainView extends Vue {
  render() {
    const Content = ViewManager.activeView;

    return [
      <div class={styles.menusplit}>
        <Menubar />
        <div class={styles.navsplit}>
          <Navbar />
          <div class={styles.content}>
            <Content
              args={ViewManager.currentView.params}
              syncedState={ViewManager.currentView.state}
              {...{
                on: {
                  "update:syncedState": (state: unknown) => {
                    ViewManager.currentView.state = state;
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    ];
  }
}

const styles = stylesheet({
  navsplit: {
    display: "flex",
    height: "100%"
  },
  menusplit: {
    display: "flex",
    height: "100%",
    flexDirection: "column"
  },
  content: {
    margin: "29px auto",
    height: "calc(100% - 58px)",
    overflow: "auto"
  }
});
