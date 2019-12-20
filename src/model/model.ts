import trainerDefaults from "@/model/defaults/trainers.json";
import trainerClassDefaults from "@/model/defaults/trainer-classes.json";
import itemDefaults from "@/model/defaults/items.json";
import pokemonDefaults from "@/model/defaults/pokemon.json";
import moveDefaults from "@/model/defaults/moves.json";
import fs from "fs";
import path from "path";
import { compileTrainers } from "@/model/serialize/trainers";
import { PathManager } from "@/modules/path-manager";
import { Vue } from "vue-property-decorator";

export interface TrainerPartyMon {
  iv: number;
  lvl: number;
  species: string;
  moves: string[];
  heldItem: string;
}

export interface Trainer {
  trainerClass: string;
  encounterMusic: string;
  trainerPic: string;
  trainerName: string;
  items: string[];
  doubleBattle: boolean;
  aiFlags: string[];
  party: TrainerPartyMon[];
  isFemaleEncounter: boolean;
  customMoves: boolean;
}

export const NoTrainer: Trainer = {
  trainerClass: "",
  party: [],
  aiFlags: [],
  doubleBattle: false,
  items: [],
  trainerName: "",
  encounterMusic: "",
  isFemaleEncounter: false,
  trainerPic: "",
  customMoves: false
};

export interface TrainerClass {
  name: string;
  money?: number;
}

export const NoTrainerClass: TrainerClass = {
  name: ""
};

export const NoTrainerPartyMon: TrainerPartyMon = {
  species: "NONE",
  lvl: 0,
  iv: 0,
  moves: ["NONE", "NONE", "NONE", "NONE"],
  heldItem: "NONE"
};

export interface Item {
  name: string;
  price: number;
  holdEffect?: string;
  holdEffectParam?: number;
  description?: string;
  importance?: number;
  unk19?: number;
  pocket: string;
  type: number;
  fieldUseFunc?: string;
  battleUsage?: number;
  battleUseFunc?: string;
  secondaryId: number;
  icon?: {
    image: string;
    palette: string;
  };
}

export interface Pokemon {
  name: string;
  moves: {
    level: number;
    move: string;
  }[];
}

export interface Move {
  name: string;
  effect: string;
  power: number;
  type: string;
  accuracy: number;
  pp: number;
  secondaryEffectChance: number;
  target: string;
  priority: number;
  flags: string[];
}

export interface Model {
  trainers: Record<string, Trainer>;
  trainerClasses: Record<string, TrainerClass>;
  items: Record<string, Item>;
  pokemon: Record<string, Pokemon>;
  moves: Record<string, Move>;
}

type Files = {
  [P in keyof Model]: [string, Model[P]];
};

const files: Files = {
  trainers: ["trainers.json", trainerDefaults],
  trainerClasses: ["trainer-classes.json", trainerClassDefaults],
  items: ["items.json", itemDefaults],
  pokemon: ["pokemon.json", pokemonDefaults],
  moves: ["moves.json", moveDefaults]
};

export const GameModel = new (class {
  model: Model = {
    trainers: {},
    trainerClasses: {},
    items: {},
    pokemon: {},
    moves: {}
  };
  createFromDefaults() {
    this.model = (Object.fromEntries(
      Object.entries(files).map(([key, [filename, obj]]) => [key, { ...obj }])
    ) as unknown) as Model;
  }

  async Save() {
    await this.Serialize();
  }

  Deserialize() {
    for (const [key, [file, defaults]] of Object.entries(files)) {
      const filepath = PathManager.metaPath(file);
      if (fs.existsSync(filepath)) {
        this.model[key as keyof Model] = JSON.parse(
          fs.readFileSync(filepath).toString()
        );
      } else {
        this.model[key as keyof Model] = {
          ...defaults
        } as any;
      }
    }
  }

  // Creates the .json files in our own project folder.
  async Serialize() {
    const projectPath = PathManager.metaPath();

    if (!fs.existsSync(projectPath)) {
      await fs.promises.mkdir(path.join(projectPath));
    }

    for (const [key, [filename]] of Object.entries(files)) {
      fs.writeFileSync(
        PathManager.metaPath(filename),
        JSON.stringify(this.model[key as keyof typeof GameModel.model])
      );
    }
  }

  // Creates the .h and .inc files etc.
  Compile() {
    compileTrainers(this.model.trainers);
  }
})();

Vue.observable(GameModel);
