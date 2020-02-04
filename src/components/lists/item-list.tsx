import { GameModel, Item } from "@/model/model";
import { ListSettings } from "@/components/lists/list";
import { IDDisplay } from "@/components/displays/id-display";

export const ItemList: ListSettings<Item> = {
  model: () => GameModel.model.items,
  layout: [
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id, item]) => <IDDisplay value={id} />
    },
    {
      text: "Name",
      sort: ([, item1], [, item2]) => item1.name.localeCompare(item2.name),
      render: (h, [id, item]) => item.name
    },
    {
      text: "Pocket",
      sort: ([, item1], [, item2]) => item1.pocket.localeCompare(item2.pocket),
      render: (h, [id, item]) => item.pocket
    }
  ],
  filter: ([id, item], input) =>
    ("#" + id.toUpperCase()).includes(input.toUpperCase()) ||
    item.name.toUpperCase().includes(input.toUpperCase()) ||
    item.pocket.toUpperCase().includes(input.toUpperCase())
};
