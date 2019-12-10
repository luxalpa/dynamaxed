import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { GameModel, TrainerPartyMon } from "@/model/model";
import { stylesheet } from "typestyle";
import { PathManager } from "@/modules/path-manager";
import { Theme } from "@/theming";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { TrainerClass } from "@/components/trainer-class";
import { Checkbox } from "@/components/checkbox";
import { Spacer } from "@/components/spacer";
import { AIFlags } from "@/model/constants";
import { Constants } from "@/constants";
import { Sprite } from "@/components/sprite";
import { DialogManager } from "@/modules/dialog-manager";
import { ChooseTrainerPicDialog } from "@/components/dialogs/choose-trainer-pic-dialog";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { FlexColumn, FlexRow } from "@/components/layout";
import { IDManager } from "@/modules/id-manager";
import { ChooseTrainerClassDialog } from "@/components/dialogs/choose-trainer-class-dialog";

function* monMoves(mon: TrainerPartyMon) {
  for (let i = 0; i < 4; i++) {
    if (!mon.moves || mon.moves.length <= i) {
      yield "NONE";
    } else {
      yield mon.moves[i];
    }
  }
}

@Component
class EditTrainerViewCmp extends Vue {
  get trainer() {
    return GameModel.model.trainers[this.trainerID];
  }

  get trainerID(): string {
    return ViewManager.activeParams as string;
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

  async changeTrainerName() {
    const text = await DialogManager.openDialog(
      InputTextDialog,
      this.trainer.trainerName
    );
    if (text != undefined) {
      this.trainer.trainerName = text;
    }
  }

  async changeTrainerID() {
    const text = await DialogManager.openDialog(
      InputTextDialog,
      this.trainerID
    );
    if (text != undefined) {
      IDManager.changeTrainerID(this.trainerID, text);
    }
  }

  async changeTrainerClass() {
    const trainerClass = await DialogManager.openDialog(
      ChooseTrainerClassDialog,
      this.trainer.trainerClass
    );
    if (trainerClass != undefined) {
      this.trainer.trainerClass = trainerClass;
    }
  }

  render() {
    return (
      <div class={styles.windowlayout}>
        <div class={styles.window}>
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
            <Button width={4}>{this.trainer.encounterMusic}</Button>
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
          {this.trainer.items.map(item => (
            <FlexRow>
              <Spacer width={1} />
              <Button width={5}>{item}</Button>
              <Button width={1}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Spacer width={1} />
            <Button width={6}>Add</Button>
          </FlexRow>
          <FlexRow />
          <Label>AI Flags</Label>
          {AIFlags.map(flag => (
            <FlexRow>
              <Spacer width={1} />
              <Checkbox value={false}>{flag}</Checkbox>
            </FlexRow>
          ))}
          <FlexRow />
          <Label>Pokemon</Label>
          <FlexRow>
            <Spacer width={1} />
            <Checkbox width={6}>Custom Held Items</Checkbox>
          </FlexRow>
          <FlexRow>
            <Spacer width={1} />
            <Checkbox width={6}>Custom Moves</Checkbox>
          </FlexRow>
        </div>
        <div class={styles.window}>
          {this.trainer.party.map(mon => [
            <FlexRow>
              <Button height={3} width={3}>
                <Sprite src={PathManager.pokePic(mon.species)} />
              </Button>
              <FlexColumn>
                <Button>{mon.heldItem || "NONE"}</Button>
                <FlexRow>
                  <Label width={1}>Lv.</Label>
                  <Button width={4}>{mon.lvl}</Button>
                </FlexRow>
                <FlexRow>
                  <Label width={1}>IV</Label>
                  <Button width={4}>{mon.iv}</Button>
                </FlexRow>
              </FlexColumn>
            </FlexRow>,
            [...monMoves(mon)].map(move => (
              <FlexRow>
                {/*<Spacer width={3} />*/}
                <Button width={8}>{move}</Button>
              </FlexRow>
            )),
            <FlexRow />
          ])}
        </div>
      </div>
    );
  }
}

export const EditTrainerView: ViewProps<string> = {
  component: EditTrainerViewCmp,
  title: trainerId => `Trainer #${trainerId}`
};

ViewManager.registerView(EditTrainerView, "edit-trainer");

const styles = stylesheet({
  trainerPic: {
    width: "64px",
    height: "64px"
  },
  windowlayout: {
    display: "flex",
    alignItems: "flex-start",
    height: "100%"
  },
  window: {
    backgroundColor: Theme.middlegroundBgColor,
    padding: "25px",
    margin: Constants.margin,
    maxHeight: "calc(100% - 4px)",
    boxSizing: "border-box",
    overflow: "auto"
  }
});
