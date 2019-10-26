import { Component, Prop, Vue } from "vue-property-decorator";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { NoTrainerPartyMon, TrainerPartyMon } from "@/model/model";
import cloneDeep from "lodash.clonedeep";
import { DialogEntry } from "@/components/dialog-entry";
import { PathManager } from "@/modules/path-manager";
import { VNode } from "vue";
import { modifiers } from "vue-tsx-support";
import { ChooseItemDialog } from "@/views/dialogs/choose-item-dialog";
import { Item } from "@/components/item";

@Component
class EditTrainerMonDialogCmp extends Vue {
  @Prop() readonly params!: TrainerPartyMon;
  mon: TrainerPartyMon = NoTrainerPartyMon;

  created() {
    this.mon = cloneDeep(this.params);
  }

  accept() {
    DialogManager.accept(this.mon);
  }

  removeHeldItem() {
    this.mon.heldItem = undefined;
  }

  async chooseItem() {
    const item = await DialogManager.openDialog(ChooseItemDialog, "");
    if (item !== undefined) {
      Vue.set(this.mon, "heldItem", item);
    }
  }

  get heldItemEntry() {
    if (this.mon.heldItem === undefined) {
      return <v-btn onclick={() => this.chooseItem()}>Add</v-btn>;
    } else {
      return (
        <v-list dense>
          <v-list-item onclick={() => this.chooseItem()}>
            <v-list-item-content>
              <v-list-item-title>
                <Item itemID={this.mon.heldItem} />
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                small
                onclick={modifiers.stop(() => {
                  this.removeHeldItem();
                })}
              >
                <v-icon small>fas fa-times</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      );
    }
  }

  render() {
    return (
      <v-card class="dialog">
        <v-container>
          <DialogEntry label="Pokemon">
            <v-btn height={80}>
              <div class="party-pic">
                <img src={PathManager.pokePic(this.mon.species)} />
              </div>
            </v-btn>
          </DialogEntry>
          <DialogEntry label="Level">
            <v-text-field
              solo
              dense
              hide-details
              type="number"
              vModel={this.mon.lvl}
            />
          </DialogEntry>
          <DialogEntry label="IV">
            <v-text-field
              solo
              dense
              hide-details
              type="number"
              vModel={this.mon.iv}
            />
          </DialogEntry>
          <DialogEntry label="Held Item">{this.heldItemEntry}</DialogEntry>
        </v-container>
        <v-card-actions>
          <v-btn text large onclick={() => DialogManager.reject()}>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn text large onclick={() => this.accept()}>
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    );
  }
}

export const EditTrainerMonDialog: DialogOptions<
  TrainerPartyMon,
  TrainerPartyMon
> = {
  component: EditTrainerMonDialogCmp,
  modal: true,
  maxWidth: 500
};
