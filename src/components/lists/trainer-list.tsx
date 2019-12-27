import { PathManager } from "@/modules/path-manager";
import { url } from "csx";
import { GameModel, Trainer } from "@/model/model";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { stylesheet } from "typestyle";
import { generateListComponents } from "@/components/lists/list";
import { IDDisplay } from "@/components/displays/id-display";

export const {
  view: TrainersView,
  dialog: ChooseTrainerDialog
} = generateListComponents<Trainer>({
  viewTitle: "All Trainers",
  targetView: EditTrainerView,
  model: () => GameModel.model.trainers,
  filter: ([id, trainer], input) =>
    trainer.trainerName.toUpperCase().includes(input.toUpperCase()) ||
    ("#" + id).toUpperCase().includes(input.toUpperCase()),
  layout: [
    {
      text: "Picture",
      render: (h, [id, trainer]) => (
        <img
          alt=""
          class={styles.trainerPic}
          src={PathManager.trainerPic(trainer.trainerPic)}
        />
      )
    },
    {
      text: "ID",
      render: (h, [id, trainer]) => <IDDisplay value={id} />
    },
    {
      text: "Name",
      render: (h, [id, trainer]) => trainer.trainerName
    },
    {
      text: "Party",
      render: (h, [id, trainer]) => (
        <div class={styles.party}>
          {trainer.party.map(mon => (
            <div class={styles.partyEntry}>
              <div
                class={styles.pokeIcon}
                style={{
                  backgroundImage: url(
                    PathManager.pokeIcon(mon.species).replace(/\\/g, "\\\\")
                  )
                }}
              />
            </div>
          ))}
        </div>
      )
    },
    {
      text: "Prize",
      align: "right",
      render(h, [id, t]) {
        const money = GameModel.model.trainerClasses[t.trainerClass].money ?? 5;
        if (t.party.length == 0) {
          return <div class={styles.money}>INVALID</div>;
        }
        const lastLevel = t.party[t.party.length - 1].lvl;
        let v = 4 * money * lastLevel;
        if (t.doubleBattle) {
          v *= 2;
        }
        return (
          <div class={styles.money}>
            <span class={styles.moneyValue}>{v}</span>$
          </div>
        );
      }
    }
  ]
});

const styles = stylesheet({
  trainerPic: {
    display: "block",
    width: "24px"
  },
  pokeIcon: {
    width: "32px",
    height: "32px",
    margin: "-8px 0 0 0"
  },
  party: {
    display: "flex"
  },
  partyEntry: {
    display: "flex"
  },
  moneyValue: {
    fontFamily: "Consolas"
  },
  money: {
    textAlign: "right"
  }
});
