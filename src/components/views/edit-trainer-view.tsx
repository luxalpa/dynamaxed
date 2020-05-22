import { Component, Vue } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
import { GameModel, TrainerPartyMon } from "@/model/model";
import { stylesheet } from "typestyle";
import { PathManager } from "@/modules/path-manager";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { TrainerClassDisplay } from "@/components/displays/trainer-class-display";
import { Checkbox } from "@/components/checkbox";
import { Spacer } from "@/components/spacer";
import { AIFlags } from "@/model/constants";
import { Sprite } from "@/components/sprite";
import { DialogManager } from "@/modules/dialog-manager";
import { ChooseTrainerPicDialog } from "@/components/dialogs/choose-trainer-pic-dialog";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { FlexColumn, FlexRow, Window, WindowLayout } from "@/components/layout";
import { IDManager } from "@/modules/id-manager";
import { ItemDisplay } from "@/components/displays/item-display";
import { MoveDisplay } from "@/components/displays/move-display";
import { getDefaultMovesForMon } from "@/utils";
import { Portal } from "portal-vue";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { IDDisplay } from "@/components/displays/id-display";
import { EditMoveView } from "@/components/views/edit-move-view";
import { ListDialog } from "@/components/lists/list";
import { List } from "@/constants";
import { EditItemView } from "@/components/views/edit-item-view";
import {
  chooseFromList,
  chooseNumber,
  chooseText
} from "@/components/views/utils";
import { EditPokemonView } from "@/components/views/edit-pokemon-view";

@Component
export class EditTrainerView extends View<string> {
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
      ChooseTrainerPicDialog,
      this.trainer.trainerPic
    );
    if (pic) {
      this.trainer.trainerPic = pic;
    }
  }

  async changeTrainerID() {
    const text = await DialogManager.openDialog(InputTextDialog, {
      value: this.trainerID,
      check: v => {
        if (v === this.trainerID) {
          return false;
        }
        if (Object.keys(GameModel.model.trainers).some(k => k === v)) {
          return "Trainer already exists!";
        }
        return false;
      }
    });
    if (text !== undefined) {
      IDManager.changeTrainerID(this.trainerID, text);
    }
  }

  removeItem(pos: number) {
    this.trainer.items.splice(pos, 1);
  }

  async addItem() {
    const item = await DialogManager.openListDialog(List.Items, "");
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

  async addMon() {
    const species = await DialogManager.openDialog(ListDialog, {
      list: List.Pokemon,
      key: ""
    });
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

  removeTrainer() {
    IDManager.removeTrainer(this.trainerID);
  }

  render() {
    const trainer = this.trainer;

    return (
      <WindowLayout>
        <Portal to="title">
          Trainer <IDDisplay value={this.trainerID} />
        </Portal>
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
            <Button onclick={() => chooseText(trainer, "trainerName", 12)}>
              {trainer.trainerName}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button onclick={() => this.changeTrainerID()}>
              <IDDisplay value={this.trainerID} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Trainer Class</Label>
            <Button
              height={2}
              onclick={() =>
                chooseFromList(trainer, "trainerClass", List.TrainerClass)
              }
              onnavigate={() =>
                ViewManager.push(EditTrainerClassView, trainer.trainerClass)
              }
            >
              <TrainerClassDisplay classId={trainer.trainerClass} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={4}>Encounter Music</Label>
            <Button
              width={4}
              onclick={() =>
                chooseFromList(trainer, "encounterMusic", List.EncounterMusic)
              }
            >
              {trainer.encounterMusic}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Spacer width={1} />
            <Checkbox vModel={trainer.doubleBattle}>Double Battle</Checkbox>
          </FlexRow>
          <FlexRow>
            <Spacer width={1} />
            <Checkbox vModel={trainer.isFemaleEncounter}>Is Female</Checkbox>
          </FlexRow>
          <FlexRow />
          <Label width={4}>Items</Label>
          {trainer.items.map((item, i) => (
            <FlexRow>
              <Spacer width={1} />
              <Button
                width={5}
                onclick={() => chooseFromList(trainer.items, i, List.Items)}
                onnavigate={() => ViewManager.push(EditItemView, item)}
              >
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
              disabled={trainer.items.length >= 4}
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
            <Checkbox width={6} vModel={trainer.customMoves}>
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
          {trainer.party.map((mon, i) => [
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
                disabled={i == trainer.party.length - 1}
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
                onclick={() => chooseFromList(mon, "species", List.Pokemon)}
                onnavigate={() =>
                  ViewManager.push(EditPokemonView, mon.species)
                }
              >
                <Sprite src={PathManager.pokePic(mon.species)} />
              </Button>
              <FlexColumn>
                <Button
                  onclick={() => chooseFromList(mon, "heldItem", List.Items)}
                  onnavigate={() =>
                    ViewManager.push(EditItemView, mon.heldItem)
                  }
                >
                  <ItemDisplay item={mon.heldItem} />
                </Button>
                <FlexRow>
                  <Label width={1}>Lv.</Label>
                  <Button
                    width={4}
                    onclick={() => chooseNumber(mon, "lvl", 100)}
                  >
                    {mon.lvl}
                  </Button>
                </FlexRow>
                <FlexRow>
                  <Label width={1}>IV</Label>
                  <Button
                    width={4}
                    onclick={() => chooseNumber(mon, "iv", 255)}
                  >
                    {mon.iv}
                  </Button>
                </FlexRow>
              </FlexColumn>
            </FlexRow>,
            [...this.monMoves(mon)].map((move, moveNum) => (
              <FlexRow>
                <Button
                  width={8}
                  disabled={!trainer.customMoves}
                  onclick={() => chooseFromList(mon.moves, moveNum, List.Move)}
                  onnavigate={() => ViewManager.push(EditMoveView, move)}
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
              disabled={trainer.party.length >= 6}
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
