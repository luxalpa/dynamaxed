import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel } from "@/model/model";
import { Checkbox } from "@/components/checkbox";
import { MoveFlags } from "@/model/constants";
import { Portal } from "portal-vue";
import { IDDisplay } from "@/components/displays/id-display";
import { DialogManager } from "@/modules/dialog-manager";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { IDManager } from "@/modules/id-manager";
import { InputTextAreaDialog } from "@/components/dialogs/input-text-area-dialog";
import { InputNumberDialog } from "@/components/dialogs/input-number-dialog";
import { Spacer } from "@/components/spacer";
import { List } from "@/constants";
import { chooseNumber } from "@/components/views/utils";

@Component
export class EditMoveView extends View<string> {
  get moveID() {
    return this.args;
  }

  get move() {
    return GameModel.model.moves[this.moveID];
  }

  async changeMoveID() {
    const text = await DialogManager.openDialog(InputTextDialog, {
      value: this.moveID,
      check: v => {
        if (v === this.moveID) {
          return false;
        }
        if (Object.keys(GameModel.model.moves).some(k => k === v)) {
          return "Move already exists!";
        }
        return false;
      }
    });
    if (text !== undefined) {
      IDManager.changeMoveID(this.moveID, text);
    }
  }

  async changeName() {
    const text = await DialogManager.openDialog(InputTextDialog, {
      value: this.move.name
    });
    if (text !== undefined) {
      this.move.name = text;
    }
  }

  async changeDescription() {
    const text = await DialogManager.openDialog(InputTextAreaDialog, {
      value: this.move.description
    });
    if (text !== undefined) {
      this.move.description = text;
    }
  }

  async changeEffect() {
    const effect = await DialogManager.openListDialog(
      List.MoveEffects,
      this.move.effect
    );
    if (effect !== undefined) {
      this.move.effect = effect;
    }
  }

  async changeMoveTarget() {
    const target = await DialogManager.openListDialog(
      List.MoveTargets,
      this.move.target
    );
    if (target !== undefined) {
      this.move.target = target;
    }
  }

  async changeType() {
    const target = await DialogManager.openListDialog(
      List.Types,
      this.move.type
    );
    if (target !== undefined) {
      this.move.type = target;
    }
  }

  async changePriority() {
    const prio = await DialogManager.openDialog(InputNumberDialog, {
      value: this.move.priority,
      min: -127,
      max: 128
    });
    if (prio !== undefined) {
      this.move.priority = prio;
    }
  }

  async changePP() {
    const pp = await DialogManager.openDialog(InputNumberDialog, {
      value: this.move.pp,
      min: 0,
      max: 99
    });
    if (pp !== undefined) {
      this.move.pp = pp;
    }
  }
  async changePower() {
    const power = await DialogManager.openDialog(InputNumberDialog, {
      value: this.move.power,
      min: 0,
      max: 255
    });
    if (power !== undefined) {
      this.move.power = power;
    }
  }
  async changeAccuracy() {
    const accuracy = await DialogManager.openDialog(InputNumberDialog, {
      value: this.move.accuracy,
      min: 0,
      max: 255
    });
    if (accuracy !== undefined) {
      this.move.accuracy = accuracy;
    }
  }

  async deleteMove() {
    IDManager.removeMove(this.moveID);
  }

  getFlag(flag: string) {
    return this.move.flags.some(v => v === flag);
  }

  setFlag(flag: string, value: boolean) {
    if (value) {
      this.move.flags.push(flag);
    } else {
      const i = this.move.flags.indexOf(flag);
      this.move.flags.splice(i, 1);
    }
  }

  render() {
    return (
      <WindowLayout>
        <Portal to="title">
          Move <IDDisplay value={this.moveID} />
        </Portal>
        <Window>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button onclick={() => this.changeMoveID()}>
              <IDDisplay value={this.moveID} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Name</Label>
            <Button onclick={() => this.changeName()}>{this.move.name}</Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Button
              height={2}
              width={8}
              style={{ whiteSpace: "pre-line" }}
              onclick={() => this.changeDescription()}
            >
              {this.move.description}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label width={3}>Effect</Label>
            <Button onclick={() => this.changeEffect()}>
              {this.move.effect}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Secondary Effect %</Label>
            <Button
              onclick={() =>
                chooseNumber(this.move, "secondaryEffectChance", 255)
              }
              width={3}
            >
              {this.move.secondaryEffectChance}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Target</Label>
            <Button onclick={() => this.changeMoveTarget()}>
              {this.move.target}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Type</Label>
            <Button width={5} onclick={() => this.changeType()}>
              {this.move.type}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Priority</Label>
            <Button width={2} onclick={() => this.changePriority()}>
              {this.move.priority}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>PP</Label>
            <Button width={2} onclick={() => this.changePP()}>
              {this.move.pp}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Power</Label>
            <Button width={2} onclick={() => this.changePower()}>
              {this.move.power}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Accuracy</Label>
            <Button width={2} onclick={() => this.changeAccuracy()}>
              {this.move.accuracy}
            </Button>
          </FlexRow>
          <FlexRow />
          {MoveFlags.map(flag => (
            <FlexRow>
              <Checkbox
                oninput={(v: boolean) => this.setFlag(flag, v)}
                value={this.getFlag(flag)}
              >
                {flag}
              </Checkbox>
            </FlexRow>
          ))}
          <FlexRow />
          <FlexRow>
            <Checkbox width={6} vModel={this.move.apprenticeUsable}>
              Usable by apprentice
            </Checkbox>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Spacer width={2} />
            <Button width={4} onclick={() => this.deleteMove()}>
              Delete
            </Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
