import { Component, Prop, Vue } from "vue-property-decorator";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { EncounterMusic } from "@/model/constants";

@Component
class ChooseEncounterMusicDialogCmp extends Vue {
  @Prop() readonly params!: string;
  render() {
    return (
      <v-card>
        <v-card-text>
          <v-list dense>
            {EncounterMusic.map(music => (
              <v-list-item onclick={() => DialogManager.accept(music)}>
                <v-list-item-content>
                  <v-list-item-title>{music}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            ))}
          </v-list>
        </v-card-text>
      </v-card>
    );
  }
}

export const ChooseEncounterMusicDialog: DialogOptions<string, string> = {
  component: ChooseEncounterMusicDialogCmp,
  maxWidth: 200
};
