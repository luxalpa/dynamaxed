import { Component, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { ViewManager } from "@/modules/view-manager";
import { px } from "csx";
import { TableStateInitial } from "@/components/table";
import { List } from "@/constants";
import { ListView } from "@/components/lists/list";

interface NavElement {
  isSubElement?: boolean;
  text: string;
  switchToList: List;
}

const navElements: NavElement[] = [
  {
    text: "Trainers",
    isSubElement: false,
    switchToList: List.Trainer
  },
  {
    text: "Trainer Classes",
    isSubElement: true,
    switchToList: List.TrainerClass
  },
  {
    text: "Moves",
    isSubElement: false,
    switchToList: List.Move
  },
  {
    text: "Pokemon",
    isSubElement: false,
    switchToList: List.Pokemon
  }
];

@Component({
  name: "Navbar"
})
export class Navbar extends Vue {
  jumpToEntry(entry: NavElement) {
    ViewManager.push(ListView, {
      tableState: TableStateInitial(),
      list: entry.switchToList
    });
  }

  render() {
    return (
      <div class={styles.navbar}>
        {navElements.map(e => (
          <div
            class={classes(styles.entry, e.isSubElement && styles.subnav)}
            onmousedown={() => this.jumpToEntry(e)}
          >
            {e.text}
          </div>
        ))}
      </div>
    );
  }
}

export const navbarWidth = 180;

const styles = stylesheet({
  navbar: {
    width: px(navbarWidth),
    height: "100%",
    paddingTop: "15px",
    backgroundColor: Theme.middlegroundBgColor
  },
  entry: {
    padding: "4px 4px 4px 25px",
    cursor: "pointer",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.middlegroundHBgColor
      }
    }
  },
  subnav: {
    paddingLeft: "45px"
  }
});
