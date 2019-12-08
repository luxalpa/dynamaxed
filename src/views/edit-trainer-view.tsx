import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { GameModel, Pokemon, TrainerPartyMon } from "@/model/model";
import { stylesheet } from "typestyle";
import { PathManager } from "@/modules/path-manager";
import { Theme } from "@/theming";
import { TextInput } from "@/components/text-input";
import { ChooseButton } from "@/components/choose-button";
import { EditorProperty } from "@/components/editor-property";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { TrainerClass } from "@/components/trainer-class";
import { Checkbox } from "@/components/checkbox";
import { Spacer } from "@/components/spacer";
import { component } from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";
import { AIFlags } from "@/model/constants";
import { Constants } from "@/constants";
import { Sprite } from "@/components/sprite";

const FlexRow = component({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    return <div class={styles.row}>{context.children}</div>;
  }
});

const FlexColumn = component({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    return <div class={styles.column}>{context.children}</div>;
  }
});

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

  get trainerID() {
    return ViewManager.activeParams as string;
  }

  render() {
    return (
      <div class={styles.windowlayout}>
        <div class={styles.window}>
          <FlexRow>
            <ChooseButton width={3} height={3}>
              <img
                class={styles.trainerPic}
                src={PathManager.trainerPic(this.trainer.trainerPic)}
              />
            </ChooseButton>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Name</Label>
            <Button>{this.trainer.trainerName}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button>#{this.trainerID}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Trainer Class</Label>
            <Button height={2}>
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
  row: {
    display: "flex",
    minHeight: "29px"
  },
  column: {
    display: "flex",
    flexDirection: "column"
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
