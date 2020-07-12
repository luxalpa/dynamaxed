import { ListSettings } from "@/components/lists/list";
import { GameModel, Tileset } from "@/model/model";
import { EditTilesetView } from "@/components/views/edit-tileset-view";

export const TilesetList: ListSettings<Tileset> = {
  filter([id, tileset], input) {
    return id.toUpperCase().includes(input.toUpperCase());
  },
  model: () => GameModel.model.tilesets,
  title: "All Tilesets",
  targetView: EditTilesetView,
  defaultObj: () => ({
    metatiles: [],
    extension: false,
    animated: false,
    compressed: false,
    palettes: [],
    metatileAttributes: [],
    assoc: ""
  }),
  layout: [
    {
      text: "Name",
      render: (h, [id]) => id,
      sort: ([id1], [id2]) => id1.localeCompare(id2)
    },
    {
      text: "Kind",
      render: (h, [, tileset]) => (tileset.extension ? "extension" : "base"),
      sort: ([, tileset1], [, tileset2]) =>
        (tileset1.extension ? 1 : 0) - (tileset2.extension ? 1 : 0)
    },
    {
      text: "Tiles",
      render: (h, [, tileset]) => tileset.metatiles.length,
      sort: ([, tileset1], [, tileset2]) =>
        tileset1.metatiles.length - tileset2.metatiles.length
    }
  ]
};
