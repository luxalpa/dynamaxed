import { Component, Vue } from "vue-property-decorator";
import { InspectorText } from "@/components/inspector/inspector-text";
import { SelectionManager } from "@/modules/selection-manager";
import { GameModel } from "@/model/model";
import { InspectorNumber } from "@/components/inspector/inspector-number";
import { InspectorTrainerPic } from "@/components/inspector/inspector-trainer-pic";

@Component
export class InspectorTrainer extends Vue {
  num: number = 0;

  get trainer() {
    const id = SelectionManager.selection.object;
    return GameModel.model.trainers[id];
  }

  render() {
    return (
      <div>
        <InspectorText vModel={this.trainer.trainerName}>Name</InspectorText>
        <InspectorTrainerPic vModel={this.trainer.trainerPic}>
          Image
        </InspectorTrainerPic>
        <InspectorNumber vModel={this.num}>Value</InspectorNumber>
        {this.num}
      </div>
    );
  }
}
