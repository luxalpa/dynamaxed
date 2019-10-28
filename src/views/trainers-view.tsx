import { Component, Vue } from "vue-property-decorator";
import { GameModel, NoTrainerPartyMon, Trainer } from "@/model/model";
import { DialogManager } from "@/modules/dialog-manager";
import { EditTrainerDialog } from "@/views/dialogs/edit-trainer-dialog";
import { PathManager } from "@/modules/path-manager";
import { CATCH_IGNORE } from "@/utils";
import { EditTrainerMonDialog } from "@/views/dialogs/edit-trainer-mon-dialog";
import { TrainerMon } from "@/components/trainer-mon";

@Component({
  name: "TrainersView"
})
export class TrainersView extends Vue {
  async editPartyMon(trainer: Trainer, partyIndex: number) {
    console.log(trainer.party[partyIndex] || NoTrainerPartyMon);
    let mon = await DialogManager.openDialog(
      EditTrainerMonDialog,
      trainer.party[partyIndex] || NoTrainerPartyMon
    );
    if (!mon) {
      return;
    }
    if (trainer.party.length <= partyIndex) {
      trainer.party.push(mon);
    } else {
      Vue.set(trainer.party, partyIndex, mon);
    }
  }

  render() {
    const trainerList: [string, Trainer][] = Object.keys(
      GameModel.model.trainers
    ).map(t => [t, GameModel.model.trainers[t]]);
    return (
      <div class="trainer-grid">
        {trainerList.map(([name, trainer]) => {
          let party = [...trainer.party];
          for (let i = trainer.party.length; i < 6; i++) {
            party.push(NoTrainerPartyMon);
          }

          const pic = PathManager.trainerPic(trainer.trainerPic);

          return (
            <v-card key={name} class="flex-row d-flex trainer-card">
              <div
                class="trainer-main"
                onclick={() => {
                  DialogManager.openDialog(EditTrainerDialog, {
                    trainerId: name
                  }).catch(CATCH_IGNORE);
                }}
              >
                <div class="trainer-id">{name}</div>
                <div class="trainer-pic">
                  <img src={pic} alt={"ERROR"} />
                </div>
                <div class="trainer-name">{trainer.trainerName}</div>
                <div class="trainer-class">
                  {GameModel.model.trainerClasses[trainer.trainerClass].name}
                </div>
              </div>
              <div class="trainer-party d-flex flex-row">
                {party.map((mon, idx) => {
                  if (mon === NoTrainerPartyMon) {
                    return (
                      <div
                        class="trainer-party-mon"
                        onclick={() => this.editPartyMon(trainer, idx)}
                      >
                        <div class="party-pic" />
                      </div>
                    );
                  }
                  return (
                    <div
                      class="trainer-party-mon"
                      onclick={() => this.editPartyMon(trainer, idx)}
                    >
                      <TrainerMon species={mon.species} />
                      <div class="party-lvl">Lv. {mon.lvl}</div>
                    </div>
                  );
                })}
              </div>
            </v-card>
          );
        })}
      </div>
    );
  }
}
