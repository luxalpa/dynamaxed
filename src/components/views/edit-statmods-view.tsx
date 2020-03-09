import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Portal } from "portal-vue";
import { View } from "@/modules/view-manager";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel } from "@/model/model";
import { chooseNumber } from "@/components/views/utils";

function statStageText(lvl: number): string {
  if (lvl > 0) {
    return "+" + lvl;
  }
  return lvl.toString();
}

function* range(min: number, max: number): IterableIterator<number> {
  for (let i = min; i <= max; i++) {
    yield i;
  }
}

function statModResult(stageIdx: number): string {
  return (
    GameModel.model.statMods[stageIdx][0] /
    GameModel.model.statMods[stageIdx][1]
  ).toFixed(3);
}

@Component
export class EditStatmodsView extends View<void> {
  render() {
    return (
      <WindowLayout>
        <Portal to="title">Edit Stat Modifiers</Portal>
        <Window>
          <FlexRow>
            <Label>Stat Stages</Label>
          </FlexRow>
          {[...range(-6, 6)].map((stage, i) => (
            <FlexRow>
              <Label width={1}>{statStageText(stage)}</Label>
              <Button
                width={2}
                onclick={() => chooseNumber(GameModel.model.statMods[i], 0)}
              >
                {GameModel.model.statMods[i][0]}
              </Button>
              <Label width={1}> / </Label>
              <Button
                width={2}
                onclick={() => chooseNumber(GameModel.model.statMods[i], 1)}
              >
                {GameModel.model.statMods[i][1]}
              </Button>
              <Label width={2}> = {statModResult(i)}</Label>
            </FlexRow>
          ))}
        </Window>
      </WindowLayout>
    );
  }
}
