import { Component, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { View, ViewManager } from "@/modules/view-manager";
import { px } from "csx";
import { TrainersView } from "@/components/lists/trainer-list";
import { TrainerClassesView } from "@/components/lists/trainer-class-list";
import { EditMapView } from "@/components/views/edit-map-view";
import { MovesView } from "@/components/lists/move-list";
import { TableState, TableStateInitial } from "@/components/table";

interface NavElement {
  isSubElement?: boolean;
  text: string;
  switchToView: new () => View<TableState>;
}

const navElements: NavElement[] = [
  {
    text: "Trainers",
    isSubElement: false,
    switchToView: TrainersView
  },
  {
    text: "Trainer Classes",
    isSubElement: true,
    switchToView: TrainerClassesView
  },
  {
    text: "Moves",
    isSubElement: false,
    switchToView: MovesView
  }
];

@Component({
  name: "Navbar"
})
export class Navbar extends Vue {
  jumpToEntry(entry: NavElement) {
    ViewManager.push(entry.switchToView, TableStateInitial());
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
