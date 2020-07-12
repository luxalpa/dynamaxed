import fs from "fs";
import path from "path";
import { compileTrainers } from "@/model/serialize/trainers";
import { PathManager } from "@/modules/path-manager";
import { Vue } from "vue-property-decorator";
import { compileTrainerClasses } from "@/model/serialize/trainer-classes";
import { compileMoves } from "@/model/serialize/moves";
import { compilePokemon } from "@/model/serialize/pokemon";
import { compileItems } from "@/model/serialize/items";
import { compileStatStages } from "@/model/serialize/statstages";
import { compileTilesets } from "@/model/serialize/tilesets";

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
  money: number;
}

export const NoTrainerClass: TrainerClass = {
  name: "",
  money: 5
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
  holdEffect: string;
  holdEffectParam: number;
  description: string;
  importance: number;
  unk19: number;
  pocket: string;
  type: number;
  fieldUseFunc: string;
  battleUsage: number;
  battleUseFunc: string;
  secondaryId: number;
  icon?: {
    image: string;
    palette: string;
  };
}

export interface PokemonEvolution {
  kind: string;
  param: string | number;
  evolvedForm: string;
}

export interface Pokemon {
  name: string;
  moves: {
    level: number;
    move: string;
  }[];
  baseHP: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  baseSpAttack: number;
  baseSpDefense: number;
  type1: string;
  type2: string;
  catchRate: number;
  expYield: number;
  evYield_HP: number;
  evYield_Attack: number;
  evYield_Defense: number;
  evYield_Speed: number;
  evYield_SpAttack: number;
  evYield_SpDefense: number;
  item1: string;
  item2: string;
  genderRatio: number;
  eggCycles: number;
  friendship: number;
  growthRate: string;
  eggGroup1: string;
  eggGroup2: string;
  safariZoneFleeRate: number;
  bodyColor: string;
  noFlip: boolean;
  tmhmLearnset: string[];
  nationalDexId: number;
  hoennDexId: number;
  tutorMoves: string[];
  eggMoves?: string[];
  ability1: string;
  ability2: string;

  // Pokedex
  categoryName: string;
  height: number;
  weight: number;
  description: string;
  pokemonScale: number;
  pokemonOffset: number;
  trainerScale: number;
  trainerOffset: number;

  evos?: PokemonEvolution[];

  frontAnimId: number;
  animationDelay: number;
  backAnimation: string;
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
  apprenticeUsable: boolean; // For Battle Frontier Apprentice
  battleArenaRating: number;
  battleDomeRatings: number[];
  description: string;
  contestEffect: string;
  contestCategory: string;
  contestComboStarterId?: string;
  contestComboMoves: string[];
}

export interface Tileset {
  compressed: boolean;
  extension: boolean;
  palettes: string[][];
  metatiles: number[][];
  metatileAttributes: number[];
  animated: boolean;
  assoc: string;
}

export interface Model {
  trainers: Record<string, Trainer>;
  trainerClasses: Record<string, TrainerClass>;
  items: Record<string, Item>;
  pokemon: Record<string, Pokemon>;
  moves: Record<string, Move>;
  statMods: number[][];
  tilesets: Record<string, Tileset>;
}

type Files = {
  [P in keyof Model]: string;
};

const files: Files = {
  trainers: "trainers.json",
  trainerClasses: "trainer-classes.json",
  items: "items.json",
  pokemon: "pokemon.json",
  moves: "moves.json",
  statMods: "statmods.json",
  tilesets: "tilesets.json"
};

export const GameModel = Vue.observable(
  new (class {
    model: Model = {
      trainers: {},
      trainerClasses: {},
      items: {},
      pokemon: {},
      moves: {},
      statMods: [],
      tilesets: {}
    };
    createFromDefaults() {
      this.model = (Object.fromEntries(
        Object.entries(files).map(([key, filename]) => {
          const obj = JSON.parse(
            fs
              .readFileSync(
                PathManager.projectPath("dynamaxed-defaults", filename)
              )
              .toString()
          );

          if (Array.isArray(obj)) {
            return [key, [...obj]];
          }
          return [key, { ...obj }];
        })
      ) as unknown) as Model;
    }

    Save() {
      this.Serialize();
    }

    Deserialize() {
      for (const [key, file] of Object.entries(files)) {
        const filepath = PathManager.metaPath(file);
        if (fs.existsSync(filepath)) {
          this.model[key as keyof Model] = JSON.parse(
            fs.readFileSync(filepath).toString()
          );
        } else {
          const defaults = JSON.parse(
            fs
              .readFileSync(PathManager.projectPath("dynamaxed-defaults", file))
              .toString()
          );
          this.model[key as keyof Model] = {
            ...defaults
          } as any;
        }
      }
    }

    // Creates the .json files in our own project folder.
    Serialize() {
      const projectPath = PathManager.metaPath();

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(path.join(projectPath));
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
      compileTrainers();
      compileTrainerClasses();
      compileMoves();
      compilePokemon();
      compileItems();
      compileStatStages();
      compileTilesets();
    }
  })()
);
