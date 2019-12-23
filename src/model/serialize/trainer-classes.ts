import { GameModel } from "@/model/model";
import {
  ArrayValue,
  DictionaryEntry,
  DictionaryValue,
  ListValue,
  makeDefineList,
  declareConst,
  makeText,
  writeToDataFile,
  writeToIncludeFile
} from "@/model/serialize/common";

export function compileTrainerClasses() {
  buildIDFile();
  buildMoneyFile();
  buildNamesFile();
}

function buildIDFile() {
  const list = Object.keys(GameModel.model.trainerClasses).map((e, i) => ({
    key: `TRAINER_CLASS_${e}`,
    value: i.toString()
  }));

  writeToIncludeFile("trainer_classes.h", makeDefineList(list));
}

function buildMoneyFile() {
  let list = Object.entries(GameModel.model.trainerClasses)
    .filter(([, tc]) => tc.money !== undefined)
    .map<ArrayValue>(
      ([k, tc]) => new ArrayValue([`TRAINER_CLASS_${k}`, tc.money!.toString()])
    );
  list.push(new ArrayValue([`0xFF`, 5]));
  const data = declareConst(
    "struct TrainerMoney gTrainerMoneyTable[]",
    new ListValue(list)
  );
  writeToDataFile("trainer_classes_money.h", data);
}

function buildNamesFile() {
  const list = Object.entries(GameModel.model.trainerClasses).map<
    DictionaryEntry
  >(([k, tc]) => ({
    key: `TRAINER_CLASS_${k}`,
    value: makeText(tc.name)
  }));
  const data = declareConst(
    "u8 gTrainerClassNames[][13]",
    new DictionaryValue(list)
  );
  writeToDataFile("trainer_class_names.h", data);
}
