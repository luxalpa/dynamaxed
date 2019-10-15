import {Component, Prop, Vue} from "vue-property-decorator";
import {DialogManager, DialogOptions} from "@/modules/dialog-manager";
import {modifiers} from "vue-tsx-support";
import {AIFlags} from "@/model/constants";

type Params = string[];

@Component({
  name: "EditFlagsDialog"
})
class EditFlagsDialogCmp extends Vue {
  @Prop() readonly params!: Params;
  flags: Record<string, boolean> = {};

  created() {
    this.flags = Object.fromEntries(AIFlags.map(str => [str, false]));
    this.params.forEach(flag => (this.flags[flag] = true));
  }

  accept() {
    let flags = Object.entries(this.flags)
      .filter(([, val]) => val)
      .map(([key]) => key);
    DialogManager.accept<Params>(flags);
  }

  render(h: any) {
    return (
      <v-card>
        <v-container>
          <v-row justify="center">
            <v-list dense>
              {AIFlags.map(flag => (
                <v-list-item
                  onclick={() => (this.flags[flag] = !this.flags[flag])}
                >
                  <v-list-item-action>
                    <v-checkbox
                      input-value={this.flags[flag]}
                      onclick={modifiers.stop(() => {
                        this.flags[flag] = !this.flags[flag];
                      })}
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{flag}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              ))}
            </v-list>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text onclick={() => DialogManager.reject()}>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn text onclick={() => this.accept()}>
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    );
  }
}

export const EditFlagsDialog: DialogOptions<Params, Params> = {
  modal: true,
  maxWidth: 350,
  component: EditFlagsDialogCmp
};
