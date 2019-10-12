import { Component, Vue } from "vue-property-decorator";
import { GameModel, NoTrainerPartyMon, Trainer } from "@/model/model";
import { Dialog, ViewManager } from "@/modules/view-manager";
import { DialogManager } from "@/modules/dialog-manager";
import { EditTrainerDialog } from "@/views/dialogs/edit-trainer-dialog";
import { ProjectManager } from "@/modules/project-manager";
import path from "path";

@Component({
  name: "TrainersView"
})
export class TrainersView extends Vue {
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

          const pic = path.join(
            ProjectManager.currentProjectPath,
            "graphics/trainers/front_pics",
            trainer.trainerPic.toLowerCase() + "_front_pic.png"
          );

          return (
            <v-card
              // class="trainer-edit"
              onclick={() => {
                DialogManager.openDialog(EditTrainerDialog, {
                  trainerId: name
                }).catch(() => {});
              }}
              key={name}
              class="flex-row d-flex trainer-card"
            >
              <div class="trainer-main">
                <div class="trainer-id">{name}</div>
                <div class="trainer-pic">
                  <img src={pic} alt={"ERROR"} />
                </div>
                <div class="trainer-name">{trainer.trainerName}</div>
                <div class="trainer-class">{trainer.trainerClass}</div>
              </div>
              <div class="trainer-party d-flex flex-row">
                {party.map(mon => {
                  const pokepic = path.join(
                    ProjectManager.currentProjectPath,
                    "graphics/pokemon",
                    mon.species.toLowerCase(),
                    "front.png"
                  );
                  if (mon === NoTrainerPartyMon) {
                    return (
                      <div class="trainer-party-mon">
                        <div class="party-pic"></div>
                      </div>
                    );
                  }
                  return (
                    <div class="trainer-party-mon">
                      <div class="party-pic">
                        <img src={pokepic} />
                      </div>
                      <div class="party-name">{mon.species}</div>
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
