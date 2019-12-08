import { GameModel, NoTrainer, Trainer } from "@/model/model";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import cloneDeep from "lodash.clonedeep";
import { modifiers } from "vue-tsx-support";
import { PathManager } from "@/modules/path-manager";
import { EditorProperty } from "@/components/editor-property";
import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";
import { EditFlagsDialog } from "@/views/dialogs/edit-flags-dialog";
import { ChooseTrainerPicDialog } from "@/views/dialogs/choose-trainer-pic-dialog";
import { ChooseTrainerClassDialog } from "@/views/dialogs/choose-trainer-class-dialog";
import { ChooseEncounterMusicDialog } from "@/views/dialogs/choose-encounter-music-dialog";
import { ChooseItemDialog } from "@/views/dialogs/choose-item-dialog";
import { TrainerClass } from "@/components/trainer-class";
import { CATCH_IGNORE } from "@/utils";
import { Item } from "@/components/item";
import { PokeIcon } from "@/components/poke-icon";

interface EditTrainerOptions {
  trainerId: string;
}

type EditTrainerResult = {
  trainerId: string;
};

@Component({
  name: "EditTrainerDialog",
  props: ["params"]
})
class EditTrainerDialogCmp extends Vue {
  trainer: Trainer = NoTrainer;
  oldTrainerID: string = "";
  trainerID: string = "";

  accept() {
    if (this.oldTrainerID !== this.trainerID) {
      delete GameModel.model.trainers[this.oldTrainerID];
    }
    GameModel.model.trainers[this.trainerID] = this.trainer;
    DialogManager.accept();
  }

  async editFlags() {
    const flags = await DialogManager.openDialog(
      EditFlagsDialog,
      this.trainer.aiFlags
    ).catch(CATCH_IGNORE);
    if (flags) {
      this.trainer.aiFlags = flags;
    }
  }

  async editTrainerClass() {
    const trainerClass = await DialogManager.openDialog(
      ChooseTrainerClassDialog,
      this.trainer.trainerClass
    ).catch(CATCH_IGNORE);
    if (trainerClass) {
      this.trainer.trainerClass = trainerClass;
    }
  }

  async editEncounterMusic() {
    const encounterMusic = await DialogManager.openDialog(
      ChooseEncounterMusicDialog,
      this.trainer.encounterMusic
    ).catch(CATCH_IGNORE);
    if (encounterMusic) {
      this.trainer.encounterMusic = encounterMusic;
    }
  }

  async editPic() {
    const trainerPic = await DialogManager.openDialog(
      ChooseTrainerPicDialog,
      this.trainer.trainerPic
    ).catch(CATCH_IGNORE);
    if (trainerPic) {
      this.trainer.trainerPic = trainerPic;
    }
  }

  async addItem() {
    const item = await DialogManager.openDialog(ChooseItemDialog, "");
    if (item) {
      this.trainer.items.push(item);
    }
  }

  async changeItem(index: number) {
    const item = await DialogManager.openDialog(ChooseItemDialog, "");
    if (item) {
      Vue.set(this.trainer.items, index, item);
    }
  }

  removeItem(index: number) {
    this.trainer.items.splice(index, 1);
  }

  created() {
    const options: EditTrainerOptions = this.$props.params;
    this.trainer = cloneDeep(GameModel.model.trainers[options.trainerId]);
    this.trainerID = options.trainerId;
    this.oldTrainerID = options.trainerId;
  }

  render() {
    const trainerImgPath = PathManager.trainerPic(this.trainer.trainerPic);

    return (
      <v-card class="dialog">
        <v-container>
          <EditorProperty label="ID">
            <v-text-field solo dense hide-details vModel={this.trainerID} />
          </EditorProperty>
          <EditorProperty label="Picture">
            <v-btn
              height={80}
              onclick={() => {
                this.editPic();
              }}
            >
              <v-img src={trainerImgPath} />
            </v-btn>
          </EditorProperty>
          <EditorProperty label="Name">
            <v-text-field
              solo
              dense
              hide-details
              vModel={this.trainer.trainerName}
            />
          </EditorProperty>
          <EditorProperty label="Trainer Class">
            <v-btn onclick={() => this.editTrainerClass()}>
              <TrainerClass classId={this.trainer.trainerClass} />
            </v-btn>
          </EditorProperty>
          <EditorProperty label="Encounter Music">
            <v-btn onclick={() => this.editEncounterMusic()}>
              {this.trainer.encounterMusic}
            </v-btn>
          </EditorProperty>
          <v-row>
            <v-col cols={4} class="dialog-label py-1" />
            <v-col cols={4} class="py-1">
              <v-checkbox
                vModel={this.trainer.doubleBattle}
                label={"Double Battle"}
                dense
                hide-details
                class="my-3 mt-0"
              />
            </v-col>
            <v-col cols={4} class="py-1">
              <v-checkbox
                vModel={this.trainer.isFemaleEncounter}
                label={"Female"}
                dense
                hide-details
                class="my-3 mt-0"
              />
            </v-col>
          </v-row>
          <EditorProperty label="Items">
            <v-card class="mb-5">
              {this.trainer.items.map((item, index) => [
                <v-chip
                  close
                  label
                  onclick={() => this.changeItem(index)}
                  {...{ on: { "click:close": () => this.removeItem(index) } }}
                  class="mt-2 ml-2"
                >
                  <Item itemID={item} />
                </v-chip>,
                <br />
              ])}
              <v-btn
                onclick={() => this.addItem()}
                class="ma-2"
                disabled={this.trainer.items.length >= 4}
              >
                Add Item
              </v-btn>
            </v-card>
          </EditorProperty>
          <EditorProperty label="AI Flags">
            <v-btn onclick={() => this.editFlags()}>Edit Flags</v-btn>
          </EditorProperty>
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

export const EditTrainerDialog: DialogOptions<
  EditTrainerOptions,
  EditTrainerResult
> = {
  component: EditTrainerDialogCmp,
  maxWidth: 1000,
  modal: true
};
