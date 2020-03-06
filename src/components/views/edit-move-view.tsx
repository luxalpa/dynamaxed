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
import { Spacer } from "@/components/spacer";
import { List } from "@/constants";
import {
  chooseFromList,
  chooseNumber,
  chooseText,
  chooseTextArea
} from "@/components/views/utils";

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
    const move = this.move;

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
            <Button onclick={() => chooseText(move, "name", 12)}>
              {move.name}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Button
              height={2}
              width={8}
              style={{ whiteSpace: "pre-line" }}
              onclick={() => chooseTextArea(move, "description", 999)}
            >
              {move.description}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label width={3}>Effect</Label>
            <Button
              onclick={() => chooseFromList(move, "effect", List.MoveEffects)}
            >
              {move.effect}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Secondary Effect %</Label>
            <Button
              onclick={() => chooseNumber(move, "secondaryEffectChance", 255)}
              width={3}
            >
              {move.secondaryEffectChance}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Target</Label>
            <Button
              onclick={() => chooseFromList(move, "target", List.MoveTargets)}
            >
              {move.target}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Type</Label>
            <Button
              width={5}
              onclick={() => chooseFromList(move, "type", List.Types)}
            >
              {move.type}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Priority</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(move, "priority", 128, -127)}
            >
              {move.priority}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>PP</Label>
            <Button width={2} onclick={() => chooseNumber(move, "pp", 99)}>
              {move.pp}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Power</Label>
            <Button width={2} onclick={() => chooseNumber(move, "power", 255)}>
              {move.power}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Accuracy</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(move, "accuracy", 255)}
            >
              {move.accuracy}
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
            <Checkbox width={6} vModel={move.apprenticeUsable}>
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
