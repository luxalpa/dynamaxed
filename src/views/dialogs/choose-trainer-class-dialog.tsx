import { Component, Prop, Vue } from "vue-property-decorator";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { GameModel } from "@/model/model";
import { TrainerClass } from "@/components/trainer-class";

@Component
class ChooseTrainerClassDialogCmp extends Vue {
  @Prop() readonly params!: string;

  render() {
    return (
      <v-card>
        <v-container>
          <div class="trainer-class-grid">
            {Object.entries(GameModel.model.trainerClasses).map(
              ([key, props]) => (
                <v-btn class="ma-1" onclick={() => DialogManager.accept(key)}>
                  <TrainerClass classId={key} />
                </v-btn>
              )
            )}
          </div>
        </v-container>
      </v-card>
    );
  }
}

export const ChooseTrainerClassDialog: DialogOptions<string, string> = {
  component: ChooseTrainerClassDialogCmp
};
