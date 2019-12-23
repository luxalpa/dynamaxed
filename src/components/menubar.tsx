import { Component, Vue } from "vue-property-decorator";
import { modifiers } from "vue-tsx-support";
import { classes, style, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { navbarWidth } from "@/components/navbar";
import { px } from "csx";
import { ViewManager } from "@/modules/view-manager";
import { PortalTarget } from "portal-vue";
import { ProjectManager } from "@/modules/project-manager";
import { GameModel } from "@/model/model";

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
          GameModel.Compile();
          console.log("Compiled");
        }
      },
      {
        text: "Close",
        shortcut: "Ctrl+Shift+Q",
        fn(): void {
          ProjectManager.closeProject();
        }
      }
    ]
  },
  {
    text: "View",
    entries: [
      {
        text: "Some bar",
        fn(): void {
          console.log("Some bar!");
        }
      }
    ]
  }
];

const NoMenu: Menu = { text: "", entries: [] };

function* allParents(child: Element | null): IterableIterator<Element> {
  if (!child) {
    return;
  }
  yield child;
  yield* allParents(child.parentElement);
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

  mounted() {
    window.addEventListener("resize", () => this.updateTitlePosition());
    setTimeout(() => this.updateTitlePosition());
  }

  updateTitlePosition() {
    const el = this.$refs.title as HTMLElement;
    const { width } = el.getBoundingClientRect();
    const borderRef = this.$refs.border as HTMLElement;
    const offsetLeft = borderRef.offsetLeft;
    const leftMargin = Math.max(navbarWidth, offsetLeft);
    const { width: totalWidth } = (this.$refs
      .menubar as HTMLElement).getBoundingClientRect();
    this.titlePos = leftMargin + (totalWidth - leftMargin - width) / 2;
  }

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
        <div ref="border" />
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
          <PortalTarget
            name="title"
            tag="span"
            onchange={() => this.$nextTick(() => this.updateTitlePosition())}
          />
          <font-awesome-icon
            icon={["fas", "arrow-right"]}
            size="lg"
            pull="right"
            class={classes(styles.arrowRight, styles.arrowDisabled)}
          />
        </div>
      </div>
    );
  }
}

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
    position: "absolute",
    padding: "6px 9px",
    fontWeight: 500
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
