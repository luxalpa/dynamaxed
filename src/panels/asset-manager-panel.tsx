import { Component, Vue } from "vue-property-decorator";
import { ListBtn } from "@/components/list-btn";
import { AssetManagerState } from "@/modules/panels/asset-manager-state";
import { GameModel } from "@/model/model";
import { PathManager } from "@/modules/path-manager";
import trainerPic = PathManager.trainerPic;
import { SelectionManager, SelectionType } from "@/modules/selection-manager";

interface ExplorerEntry {
  id: string;
  name: string;
  img: string;
}

@Component
export class AssetManagerPanel extends Vue {
  selectType(type: SelectionType) {
    AssetManagerState.currentEntry = type;
  }

  trainerEntries(): ExplorerEntry[] {
    return Object.entries(GameModel.model.trainers).map(([id, trainer]) => {
      return {
        id,
        name: trainer.trainerName,
        img: trainerPic(trainer.trainerPic)
      };
    });
  }

  entries(): ExplorerEntry[] {
    if (AssetManagerState.currentEntry == "trainer") {
      return this.trainerEntries();
    }
    return [];
  }

  selectObject(id: string) {
    SelectionManager.setSelection(AssetManagerState.currentEntry, id);
  }

  render() {
    const entries = [
      [SelectionType.Trainer, "Trainers"],
      [SelectionType.TrainerClass, "Trainer Classes"],
      [SelectionType.Pokemon, "Pokemon"],
      [SelectionType.Move, "Move"]
    ] as const;

    return (
      <div class="asset-manager">
        <div class="am--outliner">
          {entries.map(([name, text]) => {
            return [
              <ListBtn
                selected={AssetManagerState.currentEntry == name}
                onclick={() => this.selectType(name)}
              >
                {text}
              </ListBtn>,
              <br />
            ];
          })}
        </div>
        <div class="am--explorer">
          {this.entries().map(entry => {
            let classes = ["am--bigentry"];
            if (
              SelectionManager.isSelected(
                AssetManagerState.currentEntry,
                entry.id
              )
            ) {
              classes.push("ame--selected");
            }
            return (
              <div
                class={classes}
                onmousedown={() => this.selectObject(entry.id)}
              >
                <img src={entry.img} class="ame--img" />
                <div class="ame--title">{entry.id}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
