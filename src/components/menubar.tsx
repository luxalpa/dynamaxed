import { Component, Vue } from "vue-property-decorator";
import { modifiers } from "vue-tsx-support";
import { classes, style, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { calc, px } from "csx";
import { ViewManager } from "@/modules/view-manager";
import { PortalTarget } from "portal-vue";
import { ProjectManager } from "@/modules/project-manager";
import { GameModel } from "@/model/model";
import { BuildManager } from "@/modules/build-manager";
import { Constants } from "@/constants";
import { DialogManager } from "@/modules/dialog-manager";
import { BuildLogDialog } from "@/components/dialogs/build-log-dialog";

interface Menu {
  text: string;
  entries: MenuEntry[];
}

interface MenuEntry {
  text: string;
  shortcut?: string;

  fn(): void;
}

const menu: Menu[] = [
  {
    text: "Project",
    entries: [
      {
        text: "Save",
        shortcut: "Ctrl+S",
        async fn() {
          ProjectManager.Save();
          console.log("Saved");
        }
      },
      {
        text: "Compile",
        shortcut: "F7",
        async fn() {
          ProjectManager.Save();
          GameModel.Compile();
          console.log("Compiled");
        }
      },
      {
        text: "Close",
        shortcut: "Ctrl+Shift+Q",
        fn() {
          ProjectManager.closeProject();
        }
      }
    ]
  },
  {
    text: "Build",
    entries: [
      {
        text: "Build Project",
        async fn() {
          await BuildManager.build();
        }
      }
    ]
  }
];

const menuHoverCss = {
  backgroundColor: Theme.foregroundHBgColor,
  color: Theme.textHColor
};

const styles = stylesheet({
  menubar: {
    backgroundColor: Theme.foregroundBgColor,
    height: "32px",
    display: "flex",
    "-webkit-user-select": "none"
  },
  menu: {
    padding: "6px 9px",
    cursor: "pointer",
    position: "relative",
    $nest: {
      "&:hover": {
        ...menuHoverCss
      }
    }
  },
  menuActive: {
    ...menuHoverCss
  },
  popupmenu: {
    position: "absolute",
    top: "32px",
    left: 0,
    display: "block",
    width: "auto",
    whiteSpace: "nowrap",
    backgroundColor: Theme.middlegroundBgColor,
    boxShadow: "0 2px 4px black",
    zIndex: 1,
    paddingTop: "5px",
    paddingBottom: "5px",
    cursor: "default"
  },
  popupEntry: {
    padding: "5px 25px",
    color: Theme.textColor,
    marginBottom: "1px",
    cursor: "pointer",
    display: "flex",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.accentColor,
        color: Theme.textHColor
      }
    }
  },
  label: {
    display: "inline",
    marginRight: "2em",
    flex: "1 1 auto"
  },
  shortcut: {
    marginLeft: "2em",
    display: "inline"
  },
  title: {
    padding: "6px 9px",
    fontWeight: 500
  },
  titleBox: {
    width: calc(`100% - ${Constants.navWidth}`),
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    marginLeft: Constants.navWidth
  },
  arrowLeft: {
    marginTop: "1px",
    paddingRight: "10px",
    opacity: 0,
    transition: "opacity 150ms",
    cursor: "pointer"
  },
  arrowRight: {
    marginTop: "1px",
    paddingLeft: "10px",
    opacity: 0,
    transition: "opacity 150ms"
  },
  arrowDisabled: {
    color: Theme.textDisabledColor,
    cursor: "default"
  },
  buildStateBox: {
    position: "absolute",
    right: 0,
    marginTop: "4px",
    borderRadius: "6px",
    padding: "1px 8px",
    marginRight: "25px",
    border: "1px solid black",
    color: Theme.textHColor,
    cursor: "pointer"
  },
  buildPending: {
    borderColor: "#ded100",
    backgroundColor: "#6f6900",
    $nest: {
      "&:hover": {
        backgroundColor: "#978e00"
      }
    }
  },
  buildSuccess: {
    borderColor: "#00e043",
    backgroundColor: "#00611d",
    $nest: {
      "&:hover": {
        backgroundColor: "#00842b"
      }
    }
  },
  buildFail: {
    borderColor: "#e00000",
    backgroundColor: "#610000",
    $nest: {
      "&:hover": {
        backgroundColor: "#990000"
      }
    }
  }
});

const titleHover = style({
  $nest: {
    [`&:hover .${styles.arrowLeft}`]: {
      opacity: 1
    },

    [`&:hover .${styles.arrowRight}`]: {
      opacity: 1
    }
  }
});

const NoMenu: Menu = { text: "", entries: [] };

function* allParents(child: Element | null): IterableIterator<Element> {
  if (!child) {
    return;
  }
  yield child;
  yield* allParents(child.parentElement);
}

interface BuildBoxState {
  text: string;
  style: string;
  click: () => void;
}

const buildBoxStates = {
  pending: {
    text: "Building...",
    style: styles.buildPending,
    click() {
      DialogManager.openDialog(BuildLogDialog);
    }
  },
  success: {
    text: "Build Successful!",
    style: styles.buildSuccess,
    click() {}
  },
  failed: {
    text: "Build failed!",
    style: styles.buildFail,
    click() {
      DialogManager.openDialog(BuildLogDialog);
    }
  }
};

function getBuildBoxState(): BuildBoxState | null {
  if (BuildManager.BuildState.isBuilding) {
    return buildBoxStates.pending;
  }
  if (BuildManager.BuildState.result == BuildManager.BuildResult.Failed) {
    return buildBoxStates.failed;
  }
  if (BuildManager.BuildState.result == BuildManager.BuildResult.Success) {
    return buildBoxStates.success;
  }
  return null;
}

@Component
export class Menubar extends Vue {
  activeEntry: Menu = NoMenu;
  titlePos = 0;

  handleOutsideClick = (e: Event) => {
    for (const element of allParents(e.target as Element)) {
      if (element.classList.contains(styles.popupEntry)) {
        return;
      }
    }

    this.closeMenu();
  };

  closeMenu() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
    this.activeEntry = NoMenu;
  }

  activateEntry(e: Event, m: Menu) {
    e.stopPropagation();
    if (this.activeEntry === m) {
      this.closeMenu();
      return;
    }
    this.activeEntry = m;

    document.addEventListener("mousedown", this.handleOutsideClick);
  }

  selectMenuEntry(entry: MenuEntry) {
    this.closeMenu();
    entry.fn();
  }

  render() {
    let buildBoxState = getBuildBoxState();

    return (
      <div class={styles.menubar} ref="menubar">
        {menu.map(m => (
          <div
            class={classes(
              styles.menu,
              m === this.activeEntry && styles.menuActive
            )}
            onmousedown={modifiers.self((e: Event) => this.activateEntry(e, m))}
          >
            {this.activeEntry === m && (
              <div class={styles.popupmenu}>
                {m.entries.map(e => (
                  <div
                    class={styles.popupEntry}
                    onmousedown={() => {}}
                    onmouseup={() => this.selectMenuEntry(e)}
                  >
                    <div class={styles.label}>{e.text}</div>
                    <div class={styles.shortcut}>{e.shortcut}</div>
                  </div>
                ))}
              </div>
            )}
            {m.text}
          </div>
        ))}
        <div class={styles.titleBox}>
          <div
            class={classes(styles.title, titleHover)}
            ref="title"
            style={{ left: px(this.titlePos) }}
          >
            <font-awesome-icon
              icon={["fas", "arrow-left"]}
              size="lg"
              pull="left"
              class={classes(
                styles.arrowLeft,
                !ViewManager.hasUndo && styles.arrowDisabled
              )}
              onclick={() => ViewManager.pop()}
            />
            <PortalTarget name="title" tag="span" />
            <font-awesome-icon
              icon={["fas", "arrow-right"]}
              size="lg"
              pull="right"
              class={classes(styles.arrowRight, styles.arrowDisabled)}
            />
          </div>
        </div>
        {buildBoxState !== null && (
          <div
            class={[styles.buildStateBox, buildBoxState.style]}
            onclick={buildBoxState.click}
          >
            {buildBoxState.text}
          </div>
        )}
      </div>
    );
  }
}
