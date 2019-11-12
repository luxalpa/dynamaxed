import { ProjectManager } from "@/modules/project-manager";
import { GameModel } from "@/model/model";
import { Component, Vue } from "vue-property-decorator";

@Component
export class Toolbar extends Vue {
  isActive = false;

  render() {
    const classes = ["toolbar-btn", this.isActive && "active"];

    return (
      <div class="toolbar">
        <div
          class={classes}
          onmousedown={() => (this.isActive = true)}
          onmouseup={() => (this.isActive = false)}
        >
          Click me
        </div>
      </div>
    );
  }
}
