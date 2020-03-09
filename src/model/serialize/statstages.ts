import {
  ArrayValue,
  declareConst,
  ListValue,
  StructValue,
  writeToDataFile
} from "@/model/serialize/common";
import { GameModel } from "@/model/model";

export function compileStatStages() {
  const v = new ListValue(
    GameModel.model.statMods.map(stage => new ArrayValue([stage[0], stage[1]]))
  );
  writeToDataFile("stat_stages.h", declareConst("u8 gStatStageRatios[][2]", v));
}
