import {
  DefineListEntry,
  headerGuard,
  makeDefineList,
  declareConst,
  writeToDataFile,
  writeToIncludeFile,
  declareStaticConst,
  DictionaryValue,
  makeBool,
  makeText,
  writeToASMDataFile,
  declareASM,
  ArrayValue,
  StructValue,
  ListValue,
  makeFlags
} from "@/model/serialize/common";
import { GameModel } from "@/model/model";

export function compileMoves() {
  buildMoveIDs();
  buildMoveApprentice();
  buildMoveNames();
  buildMoveMindRatings();
  buildMoveAnimIDs();
  buildMovePointsDome();
  buildMoveDescriptions();
  buildContestMoves();
  buildBattleMoves();
}

function buildBattleMoves() {
  const moves = new DictionaryValue(
    Object.entries(GameModel.model.moves).map(([id, move]) => ({
      key: `MOVE_${id}`,
      value: new StructValue({
        effect: `EFFECT_${move.effect}`,
        power: move.power,
        accuracy: move.accuracy,
        pp: move.pp,
        priority: move.priority,
        secondaryEffectChance: move.secondaryEffectChance,
        type: `TYPE_${move.type}`,
        target: `MOVE_TARGET_${move.target}`,
        flags: makeFlags(move.flags.map(flag => `FLAG_${flag}`))
      })
    }))
  );

  writeToDataFile(
    "battle_moves.h",
    declareConst("struct BattleMove gBattleMoves[MOVES_COUNT]", moves)
  );
}

function buildContestMoves() {
  const moves = new DictionaryValue(
    Object.entries(GameModel.model.moves).map(([id, move]) => ({
      key: `MOVE_${id}`,
      value: new StructValue({
        effect: `CONTEST_EFFECT_${move.contestEffect}`,
        contestCategory: `CONTEST_CATEGORY_${move.contestCategory}`,
        comboStarterId: move.contestComboStarterId
          ? `COMBO_STARTER_${move.contestComboStarterId}`
          : 0,
        comboMoves:
          move.contestComboMoves.length == 0
            ? "{0}"
            : new ListValue(
                move.contestComboMoves.map(cm => `COMBO_STARTER_${cm}`)
              )
      })
    }))
  );

  writeToDataFile(
    "contest_moves.h",
    declareConst("struct ContestMove gContestMoves[MOVES_COUNT]", moves)
  );
}

function buildMoveDescriptions() {
  let moves = { ...GameModel.model.moves };
  delete moves.NONE;

  const descriptions = new DictionaryValue(
    Object.entries(moves).map(([id, move]) => ({
      key: `MOVE_${id} - 1`,
      value: "(const u8[]) " + makeText(move.description)
    }))
  );

  writeToDataFile(
    "move_descriptions.h",
    declareConst(
      "u8 *const gMoveDescriptionPointers[MOVES_COUNT - 1]",
      descriptions
    )
  );
}

function buildMovePointsDome() {
  const ratings = new DictionaryValue(
    Object.entries(GameModel.model.moves).map(([id, move]) => ({
      key: `MOVE_${id}`,
      value: new ArrayValue(move.battleDomeRatings)
    }))
  );

  writeToDataFile(
    "move_dome_ratings.h",
    declareStaticConst(
      "u8 sMovePointsForDomeTrainers[MOVES_COUNT][DOME_TOURNAMENT_TRAINERS_COUNT]",
      ratings
    )
  );
}

function buildMoveAnimIDs() {
  let commands = Object.keys(GameModel.model.moves).map(
    id => `.4byte Move_${id}`
  );
  commands.push(".4byte Move_COUNT");
  writeToASMDataFile(
    "moves_battle_anim.inc",
    declareASM("gBattleAnims_Moves", commands)
  );
}

function buildMoveMindRatings() {
  const ratings = new DictionaryValue(
    Object.entries(GameModel.model.moves).map(([id, move]) => ({
      key: `MOVE_${id}`,
      value: move.battleArenaRating
    }))
  );

  writeToDataFile(
    "move_mind_ratings.h",
    declareStaticConst("s8 sMindRatings[]", ratings)
  );
}

function buildMoveNames() {
  const names = new DictionaryValue(
    Object.entries(GameModel.model.moves).map(([id, move]) => ({
      key: `MOVE_${id}`,
      value: makeText(move.name)
    }))
  );

  writeToDataFile(
    "move_names.h",
    declareConst("u8 gMoveNames[MOVES_COUNT][MOVE_NAME_LENGTH + 1]", names)
  );
}

function buildMoveApprentice() {
  const str = new DictionaryValue(
    Object.entries(GameModel.model.moves).map(([id, move]) => ({
      key: `MOVE_${id}`,
      value: makeBool(move.apprenticeUsable)
    }))
  );

  writeToDataFile(
    "moves_apprentice.h",
    declareStaticConst("bool8 sValidApprenticeMoves[MOVES_COUNT]", str)
  );
}

function buildMoveIDs() {
  const keys = Object.keys(GameModel.model.moves);
  let list = keys.map<DefineListEntry>((k, i) => ({
    key: `MOVE_${k}`,
    value: i.toString()
  }));
  list.push({
    key: "MOVES_COUNT",
    value: keys.length.toString()
  });
  writeToIncludeFile(
    "move_ids.h",
    headerGuard("GENERATED_MOVE_IDS_H", makeDefineList(list))
  );
}
