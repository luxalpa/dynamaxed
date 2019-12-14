import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { CreateElement } from "vue";
import { GameModel, Pokemon } from "@/model/model";
import { Sprite } from "@/components/sprite";
import { PathManager } from "@/modules/path-manager";
import { stylesheet } from "typestyle";

type PokemonWithID = [string, Pokemon];

@Component
export class PokemonList extends Vue {
  onEntryClick(e: string) {
    this.$emit("entryclick", e);
  }

  get layout(): Column<PokemonWithID>[] {
    return [
      {
        render(h: CreateElement, e: PokemonWithID): any {
          return (
            <Sprite
              class={styles.pokeIcon}
              size={32}
              src={PathManager.pokeIcon(e[0])}
            />
          );
        },
        text: "Icon"
      },
      {
        render(h: CreateElement, e: PokemonWithID): any {
          return "#" + e[0];
        },
        text: "ID"
      },
      {
        render(h: CreateElement, e: PokemonWithID): any {
          return e[1].name;
        },
        text: "Name"
      }
    ];
  }

  get entries() {
    return Object.entries(GameModel.model.pokemon);
  }

  render() {
    return (
      <Table
        entries={this.entries}
        layout={this.layout}
        onentryclick={([id]: PokemonWithID) => this.onEntryClick(id)}
      />
    );
  }
}

const styles = stylesheet({
  pokeIcon: {
    margin: "-8px 0 0 0"
  }
});
