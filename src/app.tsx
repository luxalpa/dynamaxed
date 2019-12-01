import { Component, Vue, Watch } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import { persistStore, store } from "@/store";
import RecentProjectsView from "@/views/recent-projects-view";
import { MainView } from "@/views/main-view";
import { GameModel } from "@/model/model";
import { DialogManager } from "@/modules/dialog-manager";
import { cssRule, stylesheet } from "typestyle";
import { Theme } from "@/theming";

cssRule("html, body", {
  height: "100%"
});

cssRule("body", {
  overflowY: "hidden"
});

cssRule("::-webkit-scrollbar", {
  backgroundColor: "transparent",
  width: "9px",
  opacity: 0,
  $nest: {
    "&:hover": {
      opacity: 0
    }
  }
});

cssRule("::-webkit-scrollbar-thumb", {
  backgroundColor: Theme.foregroundBgColor,
  $nest: {
    "&:hover": {
      backgroundColor: Theme.foregroundHBgColor
    }
  }
});

const styles = stylesheet({
  app: {
    fontFamily: ["sans-serif", "Arial", "Helvetica", "Roboto", "Fira Sans"],
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    fontSize: "13px",
    backgroundColor: Theme.backgroundBgColor,
    height: "100%",
    color: Theme.textColor,
    $nest: {
      "html, body": {
        height: "100%"
      }
    }
  }
});

@Component({
  name: "App"
})
export default class App extends Vue {
  // Everything in the store is automatically persisted
  store = store;

  // These are not automatically persisted!
  model = GameModel;
  dm = DialogManager;

  @Watch("store", { deep: true })
  onStoreChanged() {
    persistStore();
  }

  render(h: any) {
    let CurView: any;

    if (ProjectManager.enableEditing) {
      CurView = MainView;
    } else {
      CurView = RecentProjectsView;
    }

    return (
      <div id="app" class={styles.app}>
        {DialogManager.dialogs.map((d, index) => {
          const Dialog: any = d.dialogOpts.component;
          return (
            <v-dialog
              persistent={d.dialogOpts.modal}
              value={d.vmodel}
              key={d.id}
              oninput={() => DialogManager.reject()}
              max-width={d.dialogOpts.maxWidth}
            >
              <Dialog params={d.params} />
            </v-dialog>
          );
        })}
        <CurView />
      </div>
    );
  }
}
