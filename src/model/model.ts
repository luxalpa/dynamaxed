import trainerDefaults from "@/model/defaults/trainers.json";
import trainerClassDefaults from "@/model/defaults/trainer-classes.json";
import itemDefaults from "@/model/defaults/items.json";
import fs from "fs";
import path from "path";
import { compileTrainers } from "@/model/serialize/trainers";
import { PathManager } from "@/modules/path-manager";

export interface TrainerPartyMon {
  iv: number;
  lvl: number;
  species: string;
  moves?: string[];
  heldItem?: string;
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
  trainerPic: ""
};

export interface TrainerClass {
  name: string;
  money?: number;
}

export const NoTrainerClass: TrainerClass = {
  name: ""
};

export const NoTrainerPartyMon: TrainerPartyMon = {
  species: "None",
  lvl: 0,
  iv: 0
};

export interface Item {
  name: string;
}

export interface Model {
  trainers: Record<string, Trainer>;
  trainerClasses: Record<string, TrainerClass>;
  items: Record<string, Item>;
}

const files = {
  trainers: ["trainers.json", trainerDefaults],
  trainerClasses: ["trainer-classes.json", trainerClassDefaults],
  items: ["items.json", itemDefaults]
} as const;

export const GameModel = new (class {
  model: Model = {
    trainers: {},
    trainerClasses: {},
    items: {}
  };

  createFromDefaults() {
    this.model = (Object.fromEntries(
      Object.entries(files).map(([key, value]) => [key, { ...value[1] }])
    ) as unknown) as Model;
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
    for (const [key, [file, defaults]] of Object.entries(files)) {
      const filepath = PathManager.metaPath(file);
      if (fs.existsSync(filepath)) {
        this.model[key as keyof typeof GameModel.model] = JSON.parse(
          fs.readFileSync(filepath).toString()
        );
      } else {
        this.model[key as keyof typeof GameModel.model] = {
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
