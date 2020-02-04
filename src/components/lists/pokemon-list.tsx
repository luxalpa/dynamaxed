import { GameModel, Pokemon } from "@/model/model";
import { Sprite } from "@/components/sprite";
import { PathManager } from "@/modules/path-manager";
import { stylesheet } from "typestyle";
import { ListSettings } from "@/components/lists/list";
import { IDDisplay } from "@/components/displays/id-display";
import { EditPokemonView } from "@/components/views/edit-pokemon-view";

export const PokemonList: ListSettings<Pokemon> = {
  model: () => GameModel.model.pokemon,
  title: "All Pokemon",
  targetView: EditPokemonView,
  layout: [
    {
      text: "N. Dex",
      sort: ([, pokemon1], [, pokemon2]) =>
        pokemon1.nationalDexId - pokemon2.nationalDexId,
      render: (h, [, pokemon]) => pokemon.nationalDexId
    },
    {
      text: "Icon",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id, pokemon]) => (
        <Sprite
          class={styles.pokeIcon}
          size={32}
          src={PathManager.pokeIcon(id)}
        />
      )
    },
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id]) => <IDDisplay value={id} />
    },
    {
      text: "Name",
      sort: ([, pokemon1], [, pokemon2]) =>
        pokemon1.name.localeCompare(pokemon2.name),
      render: (h, [, pokemon]) => pokemon.name
    },
    {
      text: "Primary Type",
      sort: ([, pokemon1], [, pokemon2]) =>
        pokemon1.type1.localeCompare(pokemon2.type1),
      render: (h, [, pokemon]) => pokemon.type1
    },
    {
      text: "Secondary Type",
      sort: ([, pokemon1], [, pokemon2]) =>
        pokemon1.type2.localeCompare(pokemon2.type2),
      render: (h, [, pokemon]) => pokemon.type2
    }
  ],
  filter: ([id, item], input) =>
    ("#" + id.toUpperCase()).includes(input.toUpperCase()) ||
    item.name.toUpperCase().includes(input.toUpperCase())
};

const styles = stylesheet({
  pokeIcon: {
    margin: "-8px 0 0 0"
  }
});
