import {Component, Vue} from "vue-property-decorator";
import {DialogManager, DialogOptions} from "@/modules/dialog-manager";
import {TrainerPics} from "@/model/constants";
import {PathManager} from "@/modules/path-manager";

@Component
class ChooseTrainerPicDialogCmp extends Vue {
  accept(id: string) {
    DialogManager.accept(id);
  }

  render() {
    return (
      <v-card><v-container><v-row>{
        TrainerPics.map(id => (
          <v-btn width={64} height={64} class="ma-1" onclick={() => this.accept(id)}><v-img src={PathManager.trainerPic(id)}/></v-btn>
        ))
      }</v-row></v-container></v-card>
    )
  }
}

export const ChooseTrainerPicDialog: DialogOptions<string, string> = {
  component: ChooseTrainerPicDialogCmp,
}
