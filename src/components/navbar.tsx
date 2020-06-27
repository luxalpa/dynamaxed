import { Component, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { View, ViewManager } from "@/modules/view-manager";
import { px } from "csx";
import { TableStateInitial } from "@/components/table";
import { Constants, List } from "@/constants";
import { ListView } from "@/components/lists/list";
import { EditStatmodsView } from "@/components/views/edit-statmods-view";

interface NavElement {
  isSubElement?: boolean;
  text: string;
  switchToList?: List;
  targetView?: new () => View<void>;
}

const navElements: NavElement[] = [
  {
    text: "Tilesets",
    isSubElement: false,
    switchToList: List.Tilesets
  },
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
  },
  {
    text: "Items",
    isSubElement: false,
    switchToList: List.Items
  },
  {
    text: "Stat Modifiers",
    isSubElement: false,
    targetView: EditStatmodsView
  }
];

@Component({
  name: "Navbar"
})
export class Navbar extends Vue {
  jumpToEntry(entry: NavElement) {
    if (entry.switchToList) {
      ViewManager.push(ListView, {
        tableState: TableStateInitial(),
        list: entry.switchToList
      });
    } else if (entry.targetView) {
      ViewManager.push(entry.targetView);
    } else {
      throw new Error("Neither list nor view set!");
    }
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

const styles = stylesheet({
  navbar: {
    width: Constants.navWidth,
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
