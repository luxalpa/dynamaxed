import { GameModel } from "@/model/model";
import { createList } from "@/components/lists/list";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";
import { IDDisplay } from "@/components/displays/id-display";

const ItemList = createList({
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
});

export const ChooseItemDialog = ChooseFromListDialog(ItemList);
