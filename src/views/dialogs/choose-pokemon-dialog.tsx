import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { TrainerMon } from "@/components/trainer-mon";

@Component
class ChoosePokemonDialogCmp extends Vue {
  @Prop() readonly params!: string;

  render() {
    return (
      <v-card>
        <v-container>
          <div class="pokemon-grid">
            {Object.entries(GameModel.model.pokemon).map(([key, value]) => (
              <v-btn
                onclick={() => DialogManager.accept(key)}
                width={90}
                height={90}
                class="ma-1"
              >
                <TrainerMon species={key} />
              </v-btn>
            ))}
          </div>
        </v-container>
      </v-card>
    );
  }
}

export const ChoosePokemonDialog: DialogOptions<string, string> = {
  component: ChoosePokemonDialogCmp
};
