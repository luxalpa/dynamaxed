import { GameModel, Trainer } from "@/model/model";
import {
  CValue,
  DictionaryValue,
  headerGuard,
  ListValue,
  makeBool,
  makeDefineList,
  declareConst,
  makeText,
  StructValue,
  TypeCast,
  writeToDataFile,
  writeToFile,
  writeToIncludeFile
} from "@/model/serialize/common";
import { extendArray } from "@/utils";

export function compileTrainers() {
  buildTrainerIDs();
  buildTrainers();
}

function buildTrainerIDs() {
  const keys = Object.keys(GameModel.model.trainers);

  let list = keys.map((id, i) => ({
    key: `TRAINER_${id}`,
    value: i.toString()
  }));
  list.push({
    key: "TRAINERS_COUNT",
    value: keys.length.toString()
  });
  writeToIncludeFile(
    "trainer_ids.h",
    headerGuard("GENERATED_TRAINER_IDS_H", makeDefineList(list))
  );
}

function getPartyFlags(trainer: Trainer): string {
  let flags = [];
  if (trainer.customMoves) {
    flags.push("F_TRAINER_PARTY_CUSTOM_MOVESET");
  }
  if (trainer.party.some(mon => mon.heldItem !== "NONE")) {
    flags.push("F_TRAINER_PARTY_HELD_ITEM");
  }
  if (flags.length === 0) {
    return "0";
  }
  return flags.join(" | ");
}

function encounterMusic(trainer: Trainer) {
  let music = `TRAINER_ENCOUNTER_MUSIC_${trainer.encounterMusic}`;
  if (trainer.isFemaleEncounter) {
    music = "F_TRAINER_FEMALE | " + music;
  }
  return music;
}

function trainerItems(trainer: Trainer) {
  if (trainer.items.length == 0) {
    return "{}";
  }
  const items = extendArray(trainer.items, 4, "NONE")
    .map(item => `ITEM_${item}`)
    .join(", ");
  return `{${items}}`;
}

function trainerAIFlags(trainer: Trainer): string {
  if (trainer.aiFlags.length == 0) {
    return "0";
  }
  return trainer.aiFlags.map(f => `AI_SCRIPT_${f}`).join(" | ");
}

enum TrainerPartyType {
  NoItemDefaultMoves,
  ItemDefaultMoves,
  NoItemCustomMoves,
  ItemCustomMoves
}

function getTrainerPartyType(t: Trainer) {
  const hasItems = t.party.some(mon => mon.heldItem !== "NONE");
  const p = t.party;
  if (t.customMoves) {
    if (hasItems) {
      return TrainerPartyType.ItemCustomMoves;
    } else {
      return TrainerPartyType.NoItemCustomMoves;
    }
  } else if (hasItems) {
    return TrainerPartyType.ItemDefaultMoves;
  } else {
    return TrainerPartyType.NoItemDefaultMoves;
  }
}

function makeParty(trainer: Trainer): CValue {
  const partyType = getTrainerPartyType(trainer);

  if (trainer.party.length === 0) {
    return new StructValue({
      [TrainerPartyType[partyType]]: "NULL"
    });
  }

  const customItems = trainer.party.some(mon => mon.heldItem !== "NONE");

  const partyObj = new ListValue(
    trainer.party.map(mon => {
      let struct: Record<string, CValue> = {
        iv: mon.iv,
        lvl: mon.lvl,
        species: `SPECIES_${mon.species}`
      };

      if (customItems) {
        struct["heldItem"] = `ITEM_${mon.heldItem}`;
      }

      if (trainer.customMoves) {
        struct["moves"] = mon.moves.map(m => `MOVE_${m}`).join(", ");
      }

      return new StructValue(struct);
    })
  );

  return new StructValue({
    [TrainerPartyType[partyType]]: new TypeCast(
      `struct TrainerMon${TrainerPartyType[partyType]}[]`,
      partyObj
    )
  });
}

function buildTrainers() {
  const entries = Object.entries(GameModel.model.trainers).map(
    ([id, trainer]) => ({
      key: `TRAINER_${id}`,
      value: new StructValue({
        partyFlags: getPartyFlags(trainer),
        trainerClass: `TRAINER_CLASS_${trainer.trainerClass}`,
        encounterMusic_gender: encounterMusic(trainer),
        trainerPic: `TRAINER_PIC_${trainer.trainerPic}`,
        trainerName: makeText(trainer.trainerName),
        items: trainerItems(trainer),
        doubleBattle: makeBool(trainer.doubleBattle),
        aiFlags: trainerAIFlags(trainer),
        partySize: trainer.party.length.toString(),
        party: makeParty(trainer)
      })
    })
  );

  writeToDataFile(
    "trainers.h",
    declareConst("struct Trainer gTrainers[]", new DictionaryValue(entries))
  );
}
