import { Component, Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import RecentProjectsView from "@/components/views/recent-projects-view";
import { MainView } from "@/components/views/main-view";
import { DialogManager } from "@/modules/dialog-manager";
import { cssRule, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { rgba } from "csx";
import { modifiers } from "vue-tsx-support";
import { FlexRow } from "@/components/layout";

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

cssRule("::selection", {
  backgroundColor: Theme.accentHColor,
  color: "black",
  outline: "solid"
});

const styles = stylesheet({
  app: {
    fontFamily: ["sans-serif", "Arial", "Helvetica", "Roboto", "Fira Sans"],
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    fontSize: "13px",
    lineHeight: "1.6",
    backgroundColor: Theme.backgroundBgColor,
    height: "100%",
    color: Theme.textColor,
    $nest: {
      "html, body": {
        height: "100%"
      }
    }
  },
  dialogWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: rgba(0, 0, 0, 0.5).toString(),
    position: "absolute",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  dialog: {
    backgroundColor: Theme.middlegroundBgColor,
    padding: "29px",
    display: "flex",
    maxHeight: "calc(100% - 62px)",
    boxSizing: "border-box",
    flexDirection: "column"
  },
  dialogContent: {
    display: "contents"
  }
});

@Component({
  name: "App"
})
export default class App extends Vue {
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
          const Dialog: any = d.component;
          return (
            <div
              key={d.id}
              onclick={modifiers.self(() => DialogManager.reject(d.id))}
              class={styles.dialogWrapper}
            >
              <div class={styles.dialog}>
                <FlexRow>{d.label}:</FlexRow>
                <Dialog
                  args={d.params}
                  dialogID={d.id}
                  class={styles.dialogContent}
                />
              </div>
            </div>
          );
        })}
        <CurView />
      </div>
    );
  }
}
