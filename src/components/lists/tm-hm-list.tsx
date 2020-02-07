import { GameModel, Item } from "@/model/model";
import { ListSettings } from "@/components/lists/list";
import { ItemList } from "@/components/lists/item-list";

export const TMHMList: ListSettings<Item> = {
  ...ItemList,
  model: () =>
    Object.fromEntries(
      Object.entries(GameModel.model.items).filter(
        ([k, v]) => v.fieldUseFunc === "ItemUseOutOfBattle_TMHM"
      )
    )
};
