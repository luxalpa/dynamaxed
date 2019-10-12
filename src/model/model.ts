import trainerDefaults from "@/model/defaults/trainers.json";
import fs from "fs";
import path from "path";
import { META_DIR, ProjectManager } from "@/modules/project-manager";

export interface TrainerPartyMon {
  iv: number;
  lvl: number;
  species: string;
  moves?: string[];
  heldItem?: string;
}

export interface Trainer {
  trainerClass: string;
  encounterMusic_gender: string;
  trainerPic: string;
  trainerName: string;
  items: string[];
  doubleBattle: boolean;
  aiFlags: string[];
  party: TrainerPartyMon[];
  isFemaleEncounter: boolean;
}

export const NoTrainer: Trainer = {
  trainerClass: "",
  party: [],
  aiFlags: [],
  doubleBattle: false,
  items: [],
  trainerName: "",
  encounterMusic_gender: "",
  isFemaleEncounter: false,
  trainerPic: ""
};

export const NoTrainerPartyMon: TrainerPartyMon = {
  species: "None",
  lvl: 0,
  iv: 0
};

enum TrainerPartyType {
  NoItemDefaultMoves,
  ItemDefaultMoves,
  NoItemCustomMoves,
  ItemCustomMoves
}

export interface Model {
  trainers: Record<string, Trainer>;
}

function createModel(): Record<string, Trainer> {
  return { ...trainerDefaults };
}

function hasMoves(t: Trainer) {
  return t.party[0].moves !== undefined && t.party[0].moves.length == 4;
}
function hasItems(t: Trainer) {
  return t.party[0].heldItem !== undefined && t.party[0].heldItem !== "";
}

function getTrainerPartyType(t: Trainer) {
  const p = t.party;
  if (hasMoves(t)) {
    if (hasItems(t)) {
      return TrainerPartyType.ItemCustomMoves;
    } else {
      return TrainerPartyType.NoItemCustomMoves;
    }
  } else if (hasItems(t)) {
    return TrainerPartyType.ItemDefaultMoves;
  } else {
    return TrainerPartyType.NoItemDefaultMoves;
  }
}

function getPartyFlags(t: Trainer): string[] {
  const p = t.party;

  let flags: string[] = [];
  if (hasMoves(t)) {
    flags.push("F_TRAINER_PARTY_CUSTOM_MOVESET");
  }
  if (hasItems(t)) {
    flags.push("F_TRAINER_PARTY_HELD_ITEM");
  }

  return flags;
}

function compileParty(t: Trainer): string {
  const useMoves = hasMoves(t);
  const useItems = hasItems(t);

  const partyType = getTrainerPartyType(t);

  const party = t.party
    .map(mon => {
      let moves = "";

      let rows = [
        `                .iv = ${mon.iv}`,
        `                .lvl = ${mon.lvl}`,
        `                .species = SPECIES_${mon.species}`
      ];

      if (useItems) {
        rows.push("                .heldItem = ITEM_" + mon.heldItem!);
      }

      if (useMoves) {
        rows.push(
          "                .moves = " +
            mon.moves!.map(name => "MOVE_" + name).join(", ")
        );
      }

      return `\n            {\n` + rows.join(",\n") + `\n            }`;
    })
    .join(",\n");

  return (
    "{." +
    TrainerPartyType[partyType] +
    " = (struct TrainerMon" +
    TrainerPartyType[partyType] +
    "[]) {" +
    party +
    "\n        }}"
  );
}

export const GameModel = new (class {
  model: Model = {
    trainers: {}
  };

  createFromDefaults() {
    this.model = {
      trainers: { ...trainerDefaults }
    };
  }

  async Save() {
    this.Compile();
    await this.Serialize();

    // const trainers: any = this.model.trainers;
    // for (let id of Object.keys(trainers)) {
    //   let t = trainers[id];
    //   let { party } = t;
    //   t.party = (parties as any)[party];
    // }
    // fs.writeFileSync(
    //   "C:\\Users\\Smaug\\Desktop\\testfile.txt",
    //   JSON.stringify(trainers)
    // );
    console.log("Saved!");
  }

  Deserialize() {
    const trainerPath = path.join(
      ProjectManager.currentProjectPath,
      META_DIR,
      "trainers.json"
    );
    if (fs.existsSync(trainerPath)) {
      this.model.trainers = JSON.parse(fs.readFileSync(trainerPath).toString());
    } else {
      this.model.trainers = { ...trainerDefaults };
    }
  }

  // Creates the .json files in our own project folder.
  async Serialize() {
    const projectPath = path.join(ProjectManager.currentProjectPath, META_DIR);

    if (!fs.existsSync(projectPath)) {
      await fs.promises.mkdir(path.join(projectPath));
    }
    fs.writeFileSync(
      path.join(projectPath, "trainers.json"),
      JSON.stringify(this.model.trainers)
    );
  }

  // Creates the .h and .inc files etc.
  Compile() {
    this.createOpponentsFile();
    this.createTrainersFile();
  }

  private createTrainersFile() {
    let trainersFile =
      "const struct Trainer gTrainers[] = {\n" +
      "    [TRAINER_NONE] =\n" +
      "    {\n" +
      "        .partyFlags = 0,\n" +
      "        .trainerClass = TRAINER_CLASS_PKMN_TRAINER_1,\n" +
      "        .encounterMusic_gender = TRAINER_ENCOUNTER_MUSIC_MALE,\n" +
      "        .trainerPic = TRAINER_PIC_HIKER,\n" +
      '        .trainerName = _(""),\n' +
      "        .items = {},\n" +
      "        .doubleBattle = FALSE,\n" +
      "        .aiFlags = 0,\n" +
      "        .partySize = 0,\n" +
      "        .party = {.NoItemDefaultMoves = NULL},\n" +
      "    },\n\n";
    for (const id of Object.keys(this.model.trainers)) {
      const trainer = this.model.trainers[id];

      // Party Flags
      const partyFlagsV = getPartyFlags(trainer);
      const partyFlags =
        partyFlagsV.length == 0 ? "0" : partyFlagsV.join(" | ");

      // Encounter Music
      let encounterMusic =
        "TRAINER_ENCOUNTER_MUSIC_" + trainer.encounterMusic_gender;
      if (trainer.isFemaleEncounter) {
        encounterMusic += " | F_TRAINER_FEMALE";
      }

      // Items
      let items = trainer.items.map(name => "ITEM_" + name).join(", ");

      let doubleBattle = trainer.doubleBattle ? "TRUE" : "FALSE";

      let aiFlags =
        trainer.aiFlags.length == 0
          ? "0"
          : trainer.aiFlags.map(flag => "AI_SCRIPT_" + flag).join(" | ");

      trainersFile +=
        `    [TRAINER_${id}] =\n` +
        `    {\n` +
        `        .partyFlags = ${partyFlags},\n` +
        `        .trainerClass = TRAINER_CLASS_${trainer.trainerClass},\n` +
        `        .encounterMusic_gender = ${encounterMusic},\n` +
        `        .trainerPic = TRAINER_PIC_${trainer.trainerPic},\n` +
        `        .trainerName = _("${trainer.trainerName}"),\n` +
        `        .items = {${items}},\n` +
        `        .doubleBattle = ${doubleBattle},\n` +
        `        .aiFlags = ${aiFlags},\n` +
        `        .partySize = ${trainer.party.length},\n` +
        `        .party = ${compileParty(trainer)},\n` +
        `    },\n\n`;
    }

    trainersFile += "};";

    fs.writeFileSync(
      path.join(ProjectManager.currentProjectPath, "src/data/trainers.h"),
      trainersFile
    );

    // We can't delete this file easily because it's still required by something else (src/data.c)
    fs.writeFileSync(
      path.join(
        ProjectManager.currentProjectPath,
        "src/data/trainer_parties.h"
      ),
      "\n"
    );
  }

  private createOpponentsFile() {
    let opponentsFile = `#ifndef GUARD_CONSTANTS_OPPONENTS_H\n#define GUARD_CONSTANTS_OPPONENTS_H\n\n#define TRAINER_NONE\t\t0\n`;
    let num = 1;
    for (const id of Object.keys(this.model.trainers)) {
      opponentsFile += `#define TRAINER_${id}\t${num}\n`;
      num++;
    }
    opponentsFile += `\n#define TRAINERS_COUNT\t\t${num}\n\n#endif  // GUARD_CONSTANTS_OPPONENTS_H\n`;
    fs.writeFileSync(
      path.join(
        ProjectManager.currentProjectPath,
        "include/constants/opponents.h"
      ),
      opponentsFile
    );
  }
})();
