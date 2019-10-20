import { Component, Prop, Vue } from "vue-property-decorator";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { GameModel } from "@/model/model";

@Component
class ChooseItemDialogCmp extends Vue {
  @Prop() readonly params!: string;

  render() {
    return (
      <v-card>
        <v-container>
          <div class="item-grid">
            {Object.entries(GameModel.model.items).map(([key, value]) => (
              <v-btn onclick={() => DialogManager.accept(key)}>
                {value.name}
              </v-btn>
            ))}
          </div>
        </v-container>
      </v-card>
    );
  }
}

export const ChooseItemDialog: DialogOptions<string, string> = {
  component: ChooseItemDialogCmp
};
