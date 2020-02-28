import {
  CValue,
  declareConst,
  DictionaryValue,
  makeText,
  StructValue,
  TypeCast,
  writeToDataFile
} from "@/model/serialize/common";
import { GameModel, Item } from "@/model/model";

export function compileItems() {
  buildItems();
}

function buildItems() {
  const dic = new DictionaryValue(
    Object.entries(GameModel.model.items).map(([id, item]) => ({
      key: `ITEM_${id}`,
      // TODO: Only put in non-nullish values
      value: new StructValue({
        name: makeText(item.name),
        itemId: `ITEM_${id}`,
        price: item.price,
        holdEffect: `HOLD_EFFECT_${item.holdEffect}`,
        holdEffectParam: item.holdEffectParam,
        description: new TypeCast("const u8[]", makeText(item.description)),
        importance: item.importance,
        unk19: item.unk19,
        pocket: `POCKET_${item.pocket}`,
        type: item.type,
        ...(item.fieldUseFunc && { fieldUseFunc: item.fieldUseFunc }),
        battleUsage: item.battleUsage,
        ...(item.battleUseFunc && { battleUseFunc: item.battleUseFunc }),
        secondaryId: item.secondaryId
      })
    }))
  );

  writeToDataFile("items.h", declareConst("struct Item gItems[]", dic));
}
