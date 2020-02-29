import { PathManager } from "@/modules/path-manager";
import { url } from "csx";
import { GameModel, Trainer } from "@/model/model";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { stylesheet } from "typestyle";
import { ListSettings } from "@/components/lists/list";
import { IDDisplay } from "@/components/displays/id-display";
import { TrainerClassDefaultMoney } from "@/model/constants";

function calculateTrainerMoney(t: Trainer): number | undefined {
  const money =
    GameModel.model.trainerClasses[t.trainerClass].money ??
    TrainerClassDefaultMoney;
  if (t.party.length == 0) {
    return undefined;
  }
  const lastLevel = t.party[t.party.length - 1].lvl;
  let v = 4 * money * lastLevel;
  if (t.doubleBattle) {
    v *= 2;
  }
  return v;
}

export const TrainerList: ListSettings<Trainer> = {
  title: "All Trainers",
  targetView: EditTrainerView,
  allowCreation: true,
  model: () => GameModel.model.trainers,
  filter: ([id, trainer], input) =>
    trainer.trainerName.toUpperCase().includes(input.toUpperCase()) ||
    ("#" + id).toUpperCase().includes(input.toUpperCase()),
  layout: [
    {
      text: "Picture",
      sort: ([id1, trainer1], [id2, trainer2]) =>
        trainer1.trainerPic.localeCompare(trainer2.trainerPic),
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
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id, trainer]) => <IDDisplay value={id} />
    },
    {
      text: "Name",
      sort: ([, trainer1], [, trainer2]) =>
        trainer1.trainerName.localeCompare(trainer2.trainerName),
      render: (h, [id, trainer]) => trainer.trainerName
    },
    {
      text: "Party",
      sort: ([, trainer1], [, trainer2]) =>
        trainer1.party.length - trainer2.party.length,
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
      sort: ([, trainer1], [, trainer2]) =>
        (calculateTrainerMoney(trainer1) || 0) -
        (calculateTrainerMoney(trainer2) || 0),
      render(h, [id, t]) {
        const money = calculateTrainerMoney(t);
        if (money === undefined) {
          return <div class={styles.money}>INVALID</div>;
        }

        return (
          <div class={styles.money}>
            <span class={styles.moneyValue}>{money}</span>$
          </div>
        );
      }
    }
  ]
};

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
