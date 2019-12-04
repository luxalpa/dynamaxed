import { Component, Vue } from "vue-property-decorator";
import { GameModel, Trainer } from "@/model/model";
import { stylesheet } from "typestyle";
import { CreateElement } from "vue";
import { PathManager } from "@/modules/path-manager";
import { Theme } from "@/theming";
import { url } from "csx";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { EditTrainerView } from "@/views/edit-trainer-view";

interface Column<T> {
  text: string;
  align?: string;
  render(h: CreateElement, e: T): any;
}

type TrainerWithID = [string, Trainer];

@Component({
  name: "TrainersView"
})
class TrainersViewCmp extends Vue {
  get layout(): Column<TrainerWithID>[] {
    return [
      {
        text: "Picture",
        render(h: CreateElement, e: TrainerWithID): any {
          return (
            <img
              alt=""
              class={styles.trainerPic}
              src={PathManager.trainerPic(e[1].trainerPic)}
            />
          );
        }
      },
      {
        text: "ID",
        render(h: CreateElement, e: TrainerWithID): any {
          return "#" + e[0];
        }
      },
      {
        text: "Name",
        render(h: CreateElement, e: TrainerWithID): any {
          return e[1].trainerName;
        }
      },
      {
        text: "Party",
        render(h: CreateElement, e: TrainerWithID): any {
          const p = e[1].party;
          return (
            <div class={styles.party}>
              {p.map(mon => (
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
          );
        }
      },
      {
        text: "Prize",
        align: "right",
        render(h: CreateElement, [id, t]: TrainerWithID): any {
          const money =
            GameModel.model.trainerClasses[t.trainerClass].money ?? 5;
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
    ];
  }

  render() {
    const trainerList: TrainerWithID[] = Object.entries(
      GameModel.model.trainers
    );
    return (
      <div class={styles.trainerView}>
        <table class={styles.trainerTable}>
          <tr>
            {this.layout.map(c => (
              <th class={styles.tableHeader} style={{ textAlign: c.align }}>
                {c.text}
              </th>
            ))}
          </tr>
          {trainerList.map(tid => (
            <tr onclick={() => ViewManager.push(EditTrainerView, tid[0])}>
              {this.layout.map(c => (
                <td>{c.render(this.$createElement, tid)}</td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

export const TrainersView: ViewProps<void> = {
  component: TrainersViewCmp,
  title: () => "All Trainers"
};

ViewManager.registerView(TrainersView, "trainers");

const styles = stylesheet({
  trainerView: {
    margin: "15px auto 0",
    height: "calc(100% - 15px)",
    overflow: "auto"
  },
  trainerTable: {
    borderCollapse: "collapse",
    $nest: {
      "& tr": {
        cursor: "pointer",
        $nest: {
          "&:hover": {
            backgroundColor: Theme.backgroundHBgColor
          }
        }
      },
      "& td": {
        padding: "5px 10px"
      }
    }
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    padding: "10px 10px 8px",
    backgroundColor: Theme.backgroundBgColor,
    textAlign: "left",
    fontWeight: 500,
    cursor: "default",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.backgroundHBgColor
      }
    }
  },
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
