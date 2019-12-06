import { px } from "csx";

const gridSize = 15;
const margin = 2;

export const Constants = {
  margin: px(margin),
  gridSize,
  grid(cells: number) {
    return px(cells * gridSize + (cells - 1) * (margin * 2));
  }
};
