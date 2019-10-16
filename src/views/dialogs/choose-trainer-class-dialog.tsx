import { Component, Prop, Vue } from "vue-property-decorator";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { GameModel } from "@/model/model";

@Component
class ChooseTrainerClassDialogCmp extends Vue {
  @Prop() params: string = "";

  render() {
    return (
      <v-card>
        <v-container>
          <div class="trainer-class-grid">
            {Object.entries(GameModel.model.trainerClasses).map(
              ([key, props]) => (
                <v-btn class="ma-1" onclick={() => DialogManager.accept(key)}>
                  {props.name}
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
