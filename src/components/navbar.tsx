import { Component, Vue } from "vue-property-decorator";
import { ViewManager, Views } from "@/modules/view-manager";

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

@Component({
  name: "Navbar"
})
export class Navbar extends Vue {
  jumpToEntry(entry: NavElement) {}

  render() {
    return (
      <div class="navbar">
        {navElements.map(e => (
          <div
            class={"navbar-entry" + (e.isSubElement ? " subnav" : "")}
            onmousedown={() => this.jumpToEntry(e)}
          >
            {e.text}
          </div>
        ))}
      </div>
    );
  }
}
