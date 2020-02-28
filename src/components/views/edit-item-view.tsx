import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel } from "@/model/model";
import { IDDisplay } from "@/components/displays/id-display";
import { Portal } from "portal-vue";

@Component
export class EditItemView extends View<string> {
  render() {
    const itemID = this.args;
    const item = GameModel.model.items[itemID];

    return (
      <WindowLayout>
        <Portal to="title">
          Move <IDDisplay value={itemID} />
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
            <Button width={5}>{item.name}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Pocket</Label>
            <Button width={5}>{item.pocket}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Price</Label>
            <Button width={5}>{item.price}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Type</Label>
            <Button width={3}>{item.type}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Secondary ID</Label>
            <Button width={3}>{item.secondaryId}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Importance</Label>
            <Button width={3}>{item.importance}</Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
