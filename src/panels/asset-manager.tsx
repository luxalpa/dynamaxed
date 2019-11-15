import { Component, Vue } from "vue-property-decorator";
import { ListBtn } from "@/components/list-btn";
import { AssetManagerState } from "@/modules/panels/asset-manager-state";
import { GameModel } from "@/model/model";
import { PathManager } from "@/modules/path-manager";
import trainerPic = PathManager.trainerPic;

interface ExplorerEntry {
  id: string;
  name: string;
  img: string;
}

@Component
export class AssetManager extends Vue {
  selectEntry(name: string) {
    AssetManagerState.currentEntry = name;
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
    if (AssetManagerState.currentEntry == "trainers") {
      return this.trainerEntries();
    }
    return [];
  }

  selectObject(id: string) {
    AssetManagerState.selectedObject = id;
  }

  render() {
    const entries = {
      trainers: "Trainers",
      trainerClasses: "Trainer Classes",
      pokemon: "Pokemon",
      moves: "Moves"
    };

    return (
      <div class="asset-manager">
        <div class="am--outliner">
          {Object.entries(entries).map(([name, text]) => {
            return [
              <ListBtn
                selected={AssetManagerState.currentEntry == name}
                onclick={() => this.selectEntry(name)}
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
            if (entry.id == AssetManagerState.selectedObject) {
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
