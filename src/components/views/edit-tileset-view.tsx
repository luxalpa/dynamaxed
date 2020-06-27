import { Component, Ref, Vue } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { Window, WindowLayout } from "@/components/layout";
import { stylesheet } from "typestyle";
import { GameModel } from "@/model/model";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { ProjectManager } from "@/modules/project-manager";
import { PathManager } from "@/modules/path-manager";
import { getTilesetPath } from "@/model/serialize/tilesets";

import { decode } from "upng-js";
import fs from "fs";
import { TilesetCanvas } from "@/components/tileset-canvas";

function colorBrightness(color: string) {
  if (color.length === 3) {
    color = color.replace(/(.)/g, "$1$1");
  }

  const r = parseInt(color.substr(0, 2), 16),
    g = parseInt(color.substr(2, 2), 16),
    b = parseInt(color.substr(4, 2), 16);

  return 0.21 * (r / 255) + 0.72 * (g / 255) + 0.07 * (b / 255);
}

interface State {
  currentPaletteIdx: number;
}

@Component({
  name: "EditTilesetView"
})
export class EditTilesetView extends View<string, State> {
  constructor() {
    super();
  }

  created() {
    if (this.state === null) {
      this.state = {
        currentPaletteIdx: 0
      };
    }
  }

  get tilesetName() {
    return this.args;
  }

  get tileset() {
    return GameModel.model.tilesets[this.tilesetName];
  }

  get palette() {
    if (this.state === null) {
      return [];
    }
    return this.tileset.palettes[this.state.currentPaletteIdx];
  }

  selectPalette(idx: number) {
    this.state.currentPaletteIdx = idx;
  }

  render() {
    return (
      <WindowLayout>
        <Window>
          <TilesetCanvas tilesetID={this.tilesetName} palette={this.palette} />
          {this.tileset.palettes.map((p, i) => (
            <div class={styles.palette}>
              {this.state?.currentPaletteIdx === i ? (
                <Label width={2}>Using</Label>
              ) : (
                <Button width={2} onclick={() => this.selectPalette(i)}>
                  Use
                </Button>
              )}

              {p.map(color => (
                <Button
                  class={styles.paletteIcon}
                  style={{ backgroundColor: "#" + color }}
                  width={1}
                >
                  <font-awesome-icon
                    icon="tint"
                    style={{
                      color: colorBrightness(color) > 0.5 ? "black" : "white"
                    }}
                  />
                </Button>
              ))}
            </div>
          ))}
        </Window>
      </WindowLayout>
    );
  }
}

const styles = stylesheet({
  palette: {
    display: "grid",
    gridAutoFlow: "column",
    columnGap: "3px",
    margin: "3px"
  },
  paletteIcon: {
    backgroundColor: "red",
    // border: "1px solid white",
    boxShadow: "1px 1px 3px black",
    $nest: {
      "& .fa-tint": {
        display: "none"
      },
      "&:hover .fa-tint": {
        display: "unset"
      }
    }
  }
});
