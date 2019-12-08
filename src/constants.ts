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
  }
};
