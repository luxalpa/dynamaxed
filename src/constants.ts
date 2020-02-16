import { px } from "csx";
import { NestedCSSProperties } from "typestyle/lib/types";

const gridSize = 25;
const margin = 2;

export const Constants = {
  margin: px(margin),
  gridSize,
  grid(cells: number) {
    return px(cells * gridSize + (cells - 1) * (margin * 2));
  },
  gridRect(x: number, y: number): NestedCSSProperties {
    return {
      width: Constants.grid(x),
      height: Constants.grid(y)
    };
  },

  gridWrap(cells: number) {
    return px(cells * gridSize + cells * (margin * 2));
  },

  gridWrapRect(x: number, y: number) {
    return {
      width: Constants.gridWrap(x),
      height: Constants.gridWrap(y)
    };
  }
};

export enum List {
  Pokemon = "pokemons",
  Trainer = "trainers",
  Move = "moves",
  TrainerClass = "trainer-classes",
  MoveTargets = "move-targets",
  MoveEffects = "move-effects",
  Types = "types",
  Abilities = "abilities",
  GrowthRates = "growth-rates",
  EvoKinds = "evo-kinds",
  EncounterMusic = "encounter-music",
  Items = "items",
  TMHMs = "tmhms"
}
