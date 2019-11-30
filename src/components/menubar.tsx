import { Component, Vue } from "vue-property-decorator";
import { modifiers } from "vue-tsx-support";
import { classes, stylesheet } from "typestyle";
import { Theme } from "@/theming";

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
        fn(): void {
          console.log("Saving!");
        }
      },
      {
        text: "Close",
        shortcut: "Ctrl+Shift+Q",
        fn(): void {
          console.log("Closing!");
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
    return (
      <div class={styles.menubar}>
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
    "-webkit-user-select": "none",
    fontSize: "13px"
  },
  menu: {
    padding: "9px",
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
  }
});
