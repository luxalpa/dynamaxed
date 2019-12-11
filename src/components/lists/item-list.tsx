import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { CreateElement } from "vue";
import { EncounterMusic } from "@/model/constants";
import { GameModel, Item } from "@/model/model";

type ItemWithID = [string, Item];

@Component
export class ItemList extends Vue {
  onEntryClick(e: string) {
    this.$emit("entryclick", e);
  }

  get layout(): Column<ItemWithID>[] {
    return [
      {
        render(h: CreateElement, e: ItemWithID): any {
          return "#" + e[0];
        },
        text: "ID"
      },
      {
        render(h: CreateElement, e: ItemWithID): any {
          return e[1].name;
        },
        text: "Name"
      },
      {
        render(h: CreateElement, e: ItemWithID): any {
          return e[1].pocket;
        },
        text: "Pocket"
      }
    ];
  }

  get entries() {
    return Object.entries(GameModel.model.items);
  }

  render() {
    return (
      <Table
        entries={this.entries}
        layout={this.layout}
        onentryclick={([id]: ItemWithID) => this.onEntryClick(id)}
      />
    );
  }
}
