import { Component, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Theme } from "@/theming";

interface NavElement {
  isSubElement?: boolean;
  text: string;
  switchToView: string;
}

const navElements: NavElement[] = [
  {
    isSubElement: false,
    switchToView: "trainers",
    text: "Trainers"
  },
  {
    isSubElement: true,
    switchToView: "trainer-classes",
    text: "Trainer Classes"
  }
];

const styles = stylesheet({
  navbar: {
    width: "200px",
    backgroundColor: Theme.middlegroundBgColor
  },
  entry: {
    padding: "4px",
    marginLeft: "25px",
    cursor: "pointer",
    fontSize: "13px"
  },
  subnav: {
    marginLeft: "45px"
  }
});

@Component({
  name: "Navbar"
})
export class Navbar extends Vue {
  jumpToEntry(entry: NavElement) {}

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
