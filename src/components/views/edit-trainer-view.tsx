import { Component, Vue } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { GameModel, TrainerPartyMon } from "@/model/model";
import { stylesheet } from "typestyle";
import { PathManager } from "@/modules/path-manager";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { TrainerClass } from "@/components/model/trainer-class";
import { Checkbox } from "@/components/checkbox";
import { Spacer } from "@/components/spacer";
import { AIFlags } from "@/model/constants";
import { Sprite } from "@/components/sprite";
import { DialogManager } from "@/modules/dialog-manager";
import { ChooseTrainerPicDialog } from "@/components/dialogs/choose-trainer-pic-dialog";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { FlexColumn, FlexRow, Window, WindowLayout } from "@/components/layout";
import { IDManager } from "@/modules/id-manager";
import { ItemDisplay } from "@/components/model/item-display";
import { MoveDisplay } from "@/components/model/move-display";
import { extendArray, getDefaultMovesForMon } from "@/utils";
import { ChooseTrainerClassDialog } from "@/components/lists/trainer-class-list";
import { ChooseItemDialog } from "@/components/lists/item-list";
import { ChoosePokemonDialog } from "@/components/lists/pokemon-list";
import { ChooseEncounterMusicDialog } from "@/components/lists/encounter-music-list";
import { ChooseMoveDialog } from "@/components/lists/move-list";
import { Portal } from "portal-vue";

@Component
export class EditTrainerView extends View<string> {
  get title() {
    return `Trainer #${this.trainerID}`;
  }

  get trainer() {
    return GameModel.model.trainers[this.trainerID];
  }

  get trainerID(): string {
    return this.args;
  }

  monMoves(mon: TrainerPartyMon): string[] {
    if (this.trainer.customMoves) {
      return mon.moves;
    } else {
      return getDefaultMovesForMon(mon.species, mon.lvl);
    }
  }

  async changeTrainerIcon() {
    const pic = await DialogManager.openDialog(
      `Select Picture for ${this.trainerID}`,
      ChooseTrainerPicDialog,
      this.trainer.trainerPic
    );
    if (pic) {
      this.trainer.trainerPic = pic;
    }
  }

  async changeTrainerName() {
    const text = await DialogManager.openDialog(
      `Enter new name for ${this.trainerID}`,
      InputTextDialog,
      this.trainer.trainerName
    );
    if (text !== undefined) {
      this.trainer.trainerName = text;
    }
  }

  async changeTrainerID() {
    const text = await DialogManager.openDialog(
      `Enter new ID for ${this.trainerID}`,
      InputTextDialog,
      this.trainerID
    );
    if (text !== undefined) {
      IDManager.changeTrainerID(this.trainerID, text);
    }
  }

  async changeTrainerClass() {
    const trainerClass = await DialogManager.openDialog(
      `Select trainer class for ${this.trainerID}`,
      ChooseTrainerClassDialog,
      this.trainer.trainerClass
    );
    if (trainerClass !== undefined) {
      this.trainer.trainerClass = trainerClass;
    }
  }

  async changeEncounterMusic() {
    const encounterMusic = await DialogManager.openDialog(
      `Select encounter music for ${this.trainerID}`,
      ChooseEncounterMusicDialog,
      this.trainer.encounterMusic
    );
    if (encounterMusic !== undefined) {
      this.trainer.encounterMusic = encounterMusic;
    }
  }

  async changeItem(pos: number) {
    const item = await DialogManager.openDialog(
      `Select battle use item for ${this.trainerID}`,
      ChooseItemDialog,
      this.trainer.items[pos]
    );
    if (item !== undefined) {
      Vue.set(this.trainer.items, pos, item);
    }
  }

  removeItem(pos: number) {
    this.trainer.items.splice(pos, 1);
  }

  async addItem() {
    const item = await DialogManager.openDialog(
      `Select battle use item for ${this.trainerID}`,
      ChooseItemDialog,
      ""
    );
    if (item !== undefined) {
      this.trainer.items.push(item);
    }
  }

  getAIFlag(flag: string) {
    return this.trainer.aiFlags.some(v => v === flag);
  }

  setAIFlag(flag: string, value: boolean) {
    if (value) {
      this.trainer.aiFlags.push(flag);
    } else {
      const i = this.trainer.aiFlags.indexOf(flag);
      this.trainer.aiFlags.splice(i, 1);
    }
  }

  async changePokemon(pos: number) {
    const species = await DialogManager.openDialog(
      `Select Pokemon for Slot ${pos + 1} on ${this.trainerID}`,
      ChoosePokemonDialog,
      this.trainer.party[pos].species
    );
    if (species !== undefined) {
      this.trainer.party[pos].species = species;
    }
  }

  async addMon() {
    const species = await DialogManager.openDialog(
      `Select Pokemon for Slot ${this.trainer.party.length} on ${this.trainerID}`,
      ChoosePokemonDialog,
      ""
    );
    if (species !== undefined) {
      this.trainer.party.push({
        lvl: -1,
        species,
        iv: 0,
        heldItem: "NONE",
        moves: getDefaultMovesForMon(species, 1)
      });
    }
  }

  removeMon(pos: number) {
    this.trainer.party.splice(pos, 1);
  }

  async changeHeldItem(mon: TrainerPartyMon) {
    const item = await DialogManager.openDialog(
      `Select held Item`,
      ChooseItemDialog,
      mon.heldItem
    );
    if (item !== undefined) {
      mon.heldItem = item;
    }
  }

  swapMons(posA: number, posB: number) {
    const before = this.trainer.party[posA];
    Vue.set(this.trainer.party, posA, this.trainer.party[posB]);
    Vue.set(this.trainer.party, posB, before);
  }

  moveMonUp(pos: number) {
    if (pos == 0) {
      return;
    }
    this.swapMons(pos - 1, pos);
  }

  moveMonDown(pos: number) {
    if (pos == this.trainer.party.length - 1) {
      return;
    }
    this.swapMons(pos, pos + 1);
  }

  async changeMove(mon: TrainerPartyMon, pos: number) {
    const move = await DialogManager.openDialog(
      `Select a move`,
      ChooseMoveDialog,
      mon.moves?.[pos] || ""
    );
    if (move === undefined) {
      return;
    }

    if (!mon.moves) {
      Vue.set(mon, "moves", []);
    }
    if (pos >= mon.moves!.length) {
      extendArray(mon.moves!, pos + 1, "NONE");
    }
    Vue.set(mon.moves!, pos, move);
  }

  async changeLevel(mon: TrainerPartyMon) {
    const lvl = await DialogManager.openDialog(
      `Enter new level`,
      InputTextDialog,
      mon.lvl.toString()
    );
    if (lvl !== undefined) {
      mon.lvl = parseInt(lvl);
    }
  }

  async changeIV(mon: TrainerPartyMon) {
    const lvl = await DialogManager.openDialog(
      `Enter IV`,
      InputTextDialog,
      mon.iv.toString()
    );
    if (lvl !== undefined) {
      mon.iv = parseInt(lvl);
    }
  }

  removeTrainer() {
    IDManager.removeTrainer(this.trainerID);
  }

  render() {
    return (
      <WindowLayout>
        <Portal to="title">{this.title}</Portal>
        <Window>
          <FlexRow>
            <Button
              width={3}
              height={3}
              onclick={() => this.changeTrainerIcon()}
            >
              <img
                class={styles.trainerPic}
                src={PathManager.trainerPic(this.trainer.trainerPic)}
              />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Name</Label>
            <Button onclick={() => this.changeTrainerName()}>
              {this.trainer.trainerName}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button onclick={() => this.changeTrainerID()}>
              #{this.trainerID}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Trainer Class</Label>
            <Button height={2} onclick={() => this.changeTrainerClass()}>
              <TrainerClass classId={this.trainer.trainerClass} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={4}>Encounter Music</Label>
            <Button width={4} onclick={() => this.changeEncounterMusic()}>
              {this.trainer.encounterMusic}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Spacer width={1} />
            <Checkbox vModel={this.trainer.doubleBattle}>
              Double Battle
            </Checkbox>
          </FlexRow>
          <FlexRow>
            <Spacer width={1} />
            <Checkbox vModel={this.trainer.isFemaleEncounter}>
              Is Female
            </Checkbox>
          </FlexRow>
          <FlexRow />
          <Label width={4}>Items</Label>
          {this.trainer.items.map((item, i) => (
            <FlexRow>
              <Spacer width={1} />
              <Button width={5} onclick={() => this.changeItem(i)}>
                <ItemDisplay item={item} />
              </Button>
              <Button width={1} onclick={() => this.removeItem(i)}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Spacer width={1} />
            <Button
              width={6}
              onclick={() => this.addItem()}
              disabled={this.trainer.items.length >= 4}
            >
              Add
            </Button>
          </FlexRow>
          <FlexRow />
          <Label>AI Flags</Label>
          {AIFlags.map(flag => (
            <FlexRow>
              <Spacer width={1} />
              <Checkbox
                value={this.getAIFlag(flag)}
                oninput={(v: boolean) => this.setAIFlag(flag, v)}
              >
                {flag}
              </Checkbox>
            </FlexRow>
          ))}
          <FlexRow />
          <Label>Pokemon</Label>
          <FlexRow>
            <Spacer width={1} />
            <Checkbox width={6} vModel={this.trainer.customMoves}>
              Custom Moves
            </Checkbox>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Spacer width={2} />
            <Button width={4} onclick={() => this.removeTrainer()}>
              Delete Trainer
            </Button>
          </FlexRow>
        </Window>
        <Window>
          {this.trainer.party.map((mon, i) => [
            <FlexRow>
              <Spacer width={5} />
              <Button
                width={1}
                disabled={i == 0}
                onclick={() => this.moveMonUp(i)}
              >
                <font-awesome-icon icon={["fas", "arrow-up"]} />
              </Button>
              <Button
                width={1}
                disabled={i == this.trainer.party.length - 1}
                onclick={() => this.moveMonDown(i)}
              >
                <font-awesome-icon icon={["fas", "arrow-down"]} />
              </Button>
              <Button width={1} onclick={() => this.removeMon(i)}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>,
            <FlexRow>
              <Button
                height={3}
                width={3}
                onclick={() => this.changePokemon(i)}
              >
                <Sprite src={PathManager.pokePic(mon.species)} />
              </Button>
              <FlexColumn>
                <Button onclick={() => this.changeHeldItem(mon)}>
                  <ItemDisplay item={mon.heldItem} />
                </Button>
                <FlexRow>
                  <Label width={1}>Lv.</Label>
                  <Button width={4} onclick={() => this.changeLevel(mon)}>
                    {mon.lvl}
                  </Button>
                </FlexRow>
                <FlexRow>
                  <Label width={1}>IV</Label>
                  <Button width={4} onclick={() => this.changeIV(mon)}>
                    {mon.iv}
                  </Button>
                </FlexRow>
              </FlexColumn>
            </FlexRow>,
            [...this.monMoves(mon)].map((move, moveNum) => (
              <FlexRow>
                <Button
                  width={8}
                  disabled={!this.trainer.customMoves}
                  onclick={() => this.changeMove(mon, moveNum)}
                >
                  <MoveDisplay move={move} />
                </Button>
              </FlexRow>
            )),
            <FlexRow />
          ])}
          <FlexRow>
            <Button
              width={8}
              disabled={this.trainer.party.length >= 6}
              onclick={() => this.addMon()}
            >
              Add
            </Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}

const styles = stylesheet({
  trainerPic: {
    width: "64px",
    height: "64px"
  }
});
