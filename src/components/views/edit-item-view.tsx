import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel } from "@/model/model";
import { IDDisplay } from "@/components/displays/id-display";
import { Portal } from "portal-vue";
import {
  chooseFromList,
  chooseNumber,
  chooseText
} from "@/components/views/utils";
import { List } from "@/constants";

@Component
export class EditItemView extends View<string> {
  render() {
    const itemID = this.args;
    const item = GameModel.model.items[itemID];

    return (
      <WindowLayout>
        <Portal to="title">
          Item <IDDisplay value={itemID} />
        </Portal>
        <Window>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button width={5}>
              <IDDisplay value={itemID} />
            </Button>
          </FlexRow>

          <FlexRow>
            <Label width={3}>Name</Label>
            <Button width={5} onclick={() => chooseText(item, "name", 14)}>
              {item.name}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Pocket</Label>
            <Button
              width={5}
              onclick={() => chooseFromList(item, "pocket", List.Pockets)}
            >
              {item.pocket}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Price</Label>
            <Button
              width={3}
              onclick={() => chooseNumber(item, "price", 65535)}
            >
              {item.price}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Type</Label>
            <Button width={3} onclick={() => chooseNumber(item, "type")}>
              {item.type}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Secondary ID</Label>
            <Button width={3} onclick={() => chooseNumber(item, "secondaryId")}>
              {item.secondaryId}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Importance</Label>
            <Button width={3} onclick={() => chooseNumber(item, "importance")}>
              {item.importance}
            </Button>
          </FlexRow>

          <FlexRow />
          <FlexRow>
            <Label width={5}>Hold Effect Function:</Label>
          </FlexRow>
          <FlexRow>
            <Button width={8}>{item.holdEffect || "(none)"}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Parameter</Label>
            <Button
              width={3}
              onclick={() => chooseNumber(item, "holdEffectParam")}
            >
              {item.holdEffectParam}
            </Button>
          </FlexRow>

          <FlexRow />
          <FlexRow>
            <Label width={5}>Battle Usage Function:</Label>
          </FlexRow>
          <FlexRow>
            <Button width={8}>{item.battleUseFunc || "(none)"}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Parameter</Label>
            <Button width={3} onclick={() => chooseNumber(item, "battleUsage")}>
              {item.battleUsage}
            </Button>
          </FlexRow>

          <FlexRow />
          <FlexRow>
            <Label width={5}>Field Usage Function:</Label>
          </FlexRow>
          <FlexRow>
            <Button width={8}>{item.fieldUseFunc || "(none)"}</Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
