import { Dialog } from "@/modules/dialog-manager";
import { stylesheet } from "typestyle";
import { EncounterMusicList } from "@/components/lists/encounter-music-list";
import { TrainerClassList } from "@/components/lists/trainer-class-list";
import { Component, Vue } from "vue-property-decorator";
import { ItemList } from "@/components/lists/item-list";
import { PokemonList } from "@/components/lists/pokemon-list";
import { MoveList } from "@/components/lists/move-list";
import { Button } from "@/components/button";
import { FlexRow } from "@/components/layout";
import { createModelObj } from "@/utils";
import { Constants } from "@/constants";
import { View, ViewManager } from "@/modules/view-manager";
import { GameModel } from "@/model/model";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";

interface CreateNewOpts<T> {
  model: () => Record<string, T>;
  defaultObj?: () => T;
  targetView: new () => View<string>;
}

export function ChooseFromListDialog<T>(
  List: any,
  opts?: CreateNewOpts<T>
): new () => Dialog<string, string> {
  const c = class extends Dialog<string, string> {
    createNew() {
      const id = createModelObj(opts!.model(), opts!.defaultObj);
      ViewManager.push(opts!.targetView, id);
      this.accept(id);
    }

    render() {
      return (
        <div class={styles.dialog}>
          <List
            onentryclick={(e: string) => this.accept(e)}
            class={styles.tableWrapper}
          />
          {opts && (
            <FlexRow class={styles.btn}>
              <Button onclick={() => this.createNew()}>Create new</Button>
            </FlexRow>
          )}
        </div>
      );
    }
  };

  return Component(c);
}

export const ChooseEncounterMusicDialog = ChooseFromListDialog(
  EncounterMusicList
);
export const ChooseTrainerClassDialog = ChooseFromListDialog(TrainerClassList, {
  model: () => GameModel.model.trainerClasses,
  defaultObj: () => ({ name: "CUSTOM CLASS" }),
  targetView: EditTrainerClassView
});
export const ChooseItemDialog = ChooseFromListDialog(ItemList);
export const ChoosePokemonDialog = ChooseFromListDialog(PokemonList);
export const ChooseMoveDialog = ChooseFromListDialog(MoveList);

const styles = stylesheet({
  tableWrapper: {
    overflow: "auto",
    maxHeight: "100%",
    margin: Constants.margin
  },
  dialog: {
    maxHeight: "calc(100% - 62px)",
    boxSizing: "border-box",
    flexDirection: "column"
  },
  btn: {
    justifyContent: "center"
  }
});
