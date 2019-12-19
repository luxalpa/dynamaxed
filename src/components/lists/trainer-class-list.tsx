import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { GameModel, TrainerClass } from "@/model/model";
import { CreateElement } from "vue";
import { stylesheet } from "typestyle";
import { FlexRow } from "@/components/layout";
import { Button } from "@/components/button";

type TrainerClassWithID = [string, TrainerClass];

@Component
export class TrainerClassList extends Vue {
  onEntryClick(entry: TrainerClassWithID) {
    this.$emit("entryclick", entry[0]);
  }

  get layout(): Column<TrainerClassWithID>[] {
    return [
      {
        text: "ID",
        render(h: CreateElement, e: TrainerClassWithID): any {
          return "#" + e[0];
        }
      },
      {
        text: "Text",
        render(h: CreateElement, e: TrainerClassWithID): any {
          return e[1].name;
        }
      },
      {
        text: "Money",
        render(h: CreateElement, e: TrainerClassWithID): any {
          return e[1].money || "-";
        }
      }
    ];
  }

  get entries() {
    return Object.entries(GameModel.model.trainerClasses);
  }

  render() {
    return (
      <Table
        entries={this.entries}
        layout={this.layout}
        onentryclick={(entry: TrainerClassWithID) => this.onEntryClick(entry)}
      />
    );
  }
}
