import { Component, Vue } from "vue-property-decorator";
import { HTMLElementEvent } from "@/utils";
import { modifiers } from "vue-tsx-support";

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

@Component
export class Menubar extends Vue {
  activeEntry: Menu = NoMenu;
  handleOutsideClick = (e: Event) => {
    if (!(e.target as Element)?.classList.contains("popup-entry")) {
      this.closeMenu();
    }
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
      <div class="menubar">
        {menu.map(m => (
          <div
            class={"menu" + (m === this.activeEntry ? " menu-active" : "")}
            onmousedown={modifiers.self((e: Event) => this.activateEntry(e, m))}
          >
            {this.activeEntry === m && (
              <div class="popupmenu">
                {m.entries.map(e => (
                  <div
                    class="popup-entry"
                    onmousedown={() => this.selectMenuEntry(e)}
                  >
                    <div class="me-label">{e.text}</div>
                    <div class="me-shortcut">{e.shortcut}</div>
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
