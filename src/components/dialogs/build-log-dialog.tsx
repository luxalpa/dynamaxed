import { Component, Ref } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { BuildManager } from "@/modules/build-manager";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";

const styles = stylesheet({
  buildLog: {
    whiteSpace: "pre-wrap",
    overflowY: "auto",
    backgroundColor: Theme.backgroundBgColor,
    padding: "5px",
    width: "800px",
    fontFamily: "Lucida Console"
  }
});

@Component
export class BuildLogDialog extends Dialog<void, void> {
  @Ref("buildLogWindow") buildWindow!: HTMLDivElement;

  created() {
    this.$watch(
      () => BuildManager.BuildState.lines,
      n => {
        this.$nextTick(() => {
          this.buildWindow.scrollTop = this.buildWindow.scrollHeight;
        });
      }
    );
  }

  render() {
    const lines = BuildManager.BuildState.lines;

    return (
      <div>
        <div class={styles.buildLog} ref="buildLogWindow">
          {lines.length == 0 ? "Building ..." : lines.join("\n")}
        </div>
      </div>
    );
  }
}
