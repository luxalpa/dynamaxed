import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { CreateElement } from "vue";
import { GameModel, Move } from "@/model/model";

type MoveWithID = [string, Move];

@Component
export class MoveList extends Vue {
  onEntryClick(e: string) {
    this.$emit("entryclick", e);
  }

  get layout(): Column<MoveWithID>[] {
    return [
      {
        text: "ID",
        render(h: CreateElement, e: MoveWithID): any {
          return e[0];
        }
      },
      {
        text: "Name",
        render(h: CreateElement, [id, move]: MoveWithID): any {
          return move.name;
        }
      },
      {
        text: "Type",
        render(h: CreateElement, [id, move]: MoveWithID): any {
          return move.type;
        }
      },
      {
        text: "Power",
        render(h: CreateElement, [id, move]: MoveWithID): any {
          return move.power;
        }
      },
      {
        text: "Accuracy",
        render(h: CreateElement, [id, move]: MoveWithID): any {
          return move.accuracy;
        }
      },
      {
        text: "PP",
        render(h: CreateElement, [id, move]: MoveWithID): any {
          return move.pp;
        }
      }
    ];
  }

  get entries() {
    return Object.entries(GameModel.model.moves);
  }

  render() {
    return (
      <Table
        entries={this.entries}
        layout={this.layout}
        onentryclick={([e]: MoveWithID) => this.onEntryClick(e)}
      />
    );
  }
}
