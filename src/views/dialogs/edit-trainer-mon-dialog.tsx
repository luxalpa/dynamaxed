import { Component, Prop, Vue } from "vue-property-decorator";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { NoTrainerPartyMon, TrainerPartyMon } from "@/model/model";
import cloneDeep from "lodash.clonedeep";
import { EditorProperty } from "@/components/editor-property";
import { PathManager } from "@/modules/path-manager";
import { modifiers } from "vue-tsx-support";
import { ChooseItemDialog } from "@/views/dialogs/choose-item-dialog";
import { Item } from "@/components/item";
import { ChoosePokemonDialog } from "@/views/dialogs/choose-pokemon-dialog";
import { TrainerMon } from "@/components/trainer-mon";

const maxLevel = 100;
const maxIV = 255;

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

  async changePokemon() {
    const mon = await DialogManager.openDialog(
      ChoosePokemonDialog,
      this.mon.species
    );
    if (mon !== undefined) {
      this.mon.species = mon;
    }
  }

  get level() {
    return this.mon.lvl.toString();
  }

  set level(lvlStr: string) {
    this.mon.lvl = +lvlStr;
  }

  get iv() {
    return this.mon.iv.toString();
  }

  set iv(iv: string) {
    this.mon.iv = +iv;
  }

  get allowSubmit() {
    return this.levelRule && this.ivRule;
  }

  get levelRule() {
    return this.mon.lvl >= 0 && this.mon.lvl <= maxLevel;
  }

  get ivRule() {
    return this.mon.iv >= 0 && this.mon.iv <= maxIV;
  }

  get heldItemEntry() {
    if (this.mon.heldItem === undefined) {
      return (
        <v-btn onclick={() => this.chooseItem()}>
          <v-icon small left>
            fas fa-plus
          </v-icon>
          Add
        </v-btn>
      );
    } else {
      return (
        <v-chip
          close
          label
          onclick={() => this.chooseItem()}
          {...{ on: { "click:close": () => this.removeHeldItem() } }}
          class="mt-1"
        >
          <Item itemID={this.mon.heldItem} />
        </v-chip>
      );
    }
  }

  render() {
    return (
      <v-card class="dialog">
        <v-container>
          <EditorProperty label="Pokemon">
            <v-btn height={90} width={90} onclick={() => this.changePokemon()}>
              <TrainerMon species={this.mon.species} />
            </v-btn>
          </EditorProperty>
          <EditorProperty label="Level">
            <v-text-field
              solo
              dense
              hide-details
              type="number"
              style={{ width: "90px" }}
              min={0}
              max={maxLevel}
              vModel={this.level}
              background-color={!this.levelRule ? "error lighten-2" : undefined}
            />
          </EditorProperty>
          <EditorProperty label="IV">
            <v-text-field
              solo
              dense
              hide-details
              type="number"
              style={{ width: "90px" }}
              min={0}
              max={maxIV}
              vModel={this.iv}
              background-color={!this.ivRule ? "error lighten-2" : undefined}
            />
          </EditorProperty>
          <EditorProperty label="Held Item">
            {this.heldItemEntry}
          </EditorProperty>
          <EditorProperty label="">
            <v-btn>Delete this Pokemon</v-btn>
          </EditorProperty>
        </v-container>
        <v-card-actions>
          <v-btn text large onclick={() => DialogManager.reject()}>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            text
            large
            onclick={() => this.accept()}
            disabled={!this.allowSubmit}
          >
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
  modal: false,
  maxWidth: 500
};
