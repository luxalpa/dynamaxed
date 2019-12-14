import { Dialog } from "@/modules/dialog-manager";
import { stylesheet } from "typestyle";
import { EncounterMusicList } from "@/components/lists/encounter-music-list";
import { TrainerClassList } from "@/components/lists/trainer-class-list";
import { Component } from "vue-property-decorator";
import { ItemList } from "@/components/lists/item-list";
import { PokemonList } from "@/components/lists/pokemon-list";

export function ChooseFromListDialog(
  List: any
): new () => Dialog<string, string> {
  const c = class extends Dialog<string, string> {
    render() {
      return (
        <div class={styles.dialog}>
          <List
            onentryclick={(e: string) => this.accept(e)}
            class={styles.tableWrapper}
          />
        </div>
      );
    }
  };

  return Component(c);
}

export const ChooseEncounterMusicDialog = ChooseFromListDialog(
  EncounterMusicList
);
export const ChooseTrainerClassDialog = ChooseFromListDialog(TrainerClassList);
export const ChooseItemDialog = ChooseFromListDialog(ItemList);
export const ChoosePokemonDialog = ChooseFromListDialog(PokemonList);

const styles = stylesheet({
  tableWrapper: {
    overflow: "auto",
    maxHeight: "100%"
  },
  dialog: {
    maxHeight: "calc(100% - 62px)",
    boxSizing: "border-box"
  }
});
