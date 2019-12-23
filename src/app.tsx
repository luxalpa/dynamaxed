import { Component, Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import RecentProjectsView from "@/components/views/recent-projects-view";
import { MainView } from "@/components/views/main-view";
import { cssRule, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { DialogContainer } from "@/components/dialog-container";

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
    fontFamily: ["sans-serif", "Arial", "Helvetica", "Fira Sans"],
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
  }
});

@Component({
  name: "App"
})
export class App extends Vue {
  render(h: any) {
    let CurView: any;

    if (ProjectManager.enableEditing) {
      CurView = MainView;
    } else {
      CurView = RecentProjectsView;
    }

    return (
      <div id="app" class={styles.app}>
        <DialogContainer />
        <CurView />
      </div>
    );
  }
}
