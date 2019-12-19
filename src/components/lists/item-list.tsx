import { GameModel } from "@/model/model";
import { createList } from "@/components/lists/list";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";

const ItemList = createList(() => GameModel.model.items, [
  {
    text: "ID",
    render: (h, [id, item]) => "#" + id
  },
  {
    text: "Name",
    render: (h, [id, item]) => item.name
  },
  {
    text: "Pocket",
    render: (h, [id, item]) => item.pocket
  }
]);

export const ChooseItemDialog = ChooseFromListDialog(ItemList);
