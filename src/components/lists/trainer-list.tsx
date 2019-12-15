import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { CreateElement } from "vue";
import { PathManager } from "@/modules/path-manager";
import { url } from "csx";
import { GameModel, Trainer } from "@/model/model";
import { ViewManager } from "@/modules/view-manager";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { stylesheet } from "typestyle";

type TrainerWithID = [string, Trainer];

@Component
export class TrainerList extends Vue {
  onEntryClick(entry: TrainerWithID) {
    this.$emit("entryclick", entry[0]);
  }

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
    ];
  }

  render() {
    const trainerList: TrainerWithID[] = Object.entries(
      GameModel.model.trainers
    );
    return (
      <Table
        layout={this.layout}
        entries={trainerList}
        onentryclick={(row: TrainerWithID) => this.onEntryClick(row)}
      />
    );
  }
}

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
