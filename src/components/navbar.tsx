import { Component, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { ViewManager, View } from "@/modules/view-manager";
import { px } from "csx";

interface NavElement {
  isSubElement?: boolean;
  text: string;
  switchToView: View;
}

const navElements: NavElement[] = [
  {
    isSubElement: false,
    switchToView: View.trainers,
    text: "Trainers"
  },
  {
    isSubElement: true,
    switchToView: View.trainerClasses,
    text: "Trainer Classes"
  }
];

@Component({
  name: "Navbar"
})
export class Navbar extends Vue {
  jumpToEntry(entry: NavElement) {
    ViewManager.setActiveView(entry.switchToView);
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
