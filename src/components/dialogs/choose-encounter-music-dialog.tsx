import { Component } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { EncounterMusicList } from "@/components/lists/encounter-music-list";
import { stylesheet } from "typestyle";

@Component
export class ChooseEncounterMusicDialog extends Dialog<string, string> {
  render() {
    return (
      <div class={styles.dialog}>
        <EncounterMusicList
          onentryclick={(e: string) => this.accept(e)}
          class={styles.tableWrapper}
        />
      </div>
    );
  }
}

const styles = stylesheet({
  tableWrapper: {
    overflow: "auto",
    height: "100%"
  },
  dialog: {
    maxHeight: "calc(100% - 62px)",
    boxSizing: "border-box"
  }
});
