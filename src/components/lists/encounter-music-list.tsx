import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { CreateElement } from "vue";
import { EncounterMusic } from "@/model/constants";

@Component
export class EncounterMusicList extends Vue {
  onEntryClick(e: string) {
    this.$emit("entryclick", e);
  }

  get layout(): Column<string>[] {
    return [
      {
        render(h: CreateElement, e: string): any {
          return e;
        },
        text: "ID"
      }
    ];
  }

  get entries() {
    return EncounterMusic;
  }

  render() {
    return (
      <Table
        entries={this.entries}
        layout={this.layout}
        onentryclick={(e: string) => this.onEntryClick(e)}
      />
    );
  }
}
