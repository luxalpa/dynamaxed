import { Component } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
import { TrainerClassList } from "@/components/lists/trainer-class-list";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Table } from "@/components/table";
import { Button } from "@/components/button";

@Component
export class TrainerClassesView extends View<void> {
  get title(): string {
    return "All Trainer Classes";
  }

  render() {
    return (
      <WindowLayout>
        <Window>
          <TrainerClassList
            onentryclick={(id: string) =>
              ViewManager.push(EditTrainerClassView, id)
            }
          />
          <FlexRow>
            <Button>Create</Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
