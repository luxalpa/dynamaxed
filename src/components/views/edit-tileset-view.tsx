import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { stylesheet } from "typestyle";
import { GameModel } from "@/model/model";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { TilesDisplay } from "@/components/displays/tiles-display";
import { chooseFromList, chooseText } from "@/components/views/utils";
import { DialogManager } from "@/modules/dialog-manager";
import { PaletteSelectDialog } from "@/components/dialogs/palette-select-dialog";
import { Constants, List } from "@/constants";
import { px } from "csx";
import { MetatilesDisplay } from "@/components/displays/metatiles-display";
import { Portal } from "portal-vue";
import {
  getTilesetPalettes,
  getTilesInfo,
  NoTilesInfo,
  renderMetatileLayer,
  renderTile
} from "@/tiles";
import { Theme } from "@/theming";
import { InputNumberDialog } from "@/components/dialogs/input-number-dialog";

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
  selectedTileID: number;
  flipx: boolean;
  flipy: boolean;
  selectedMetatileID: number;
}

@Component({
  name: "EditTilesetView"
})
export class EditTilesetView extends View<string, State> {
  @Ref("tile-canvas") tileCanvas!: HTMLCanvasElement;
  @Ref("metatile-canvas") metatileCanvas!: HTMLCanvasElement;

  baseTilesInfo = NoTilesInfo;
  extensionTilesInfo = NoTilesInfo;

  created() {
    if (this.state === null) {
      this.state = {
        currentPaletteIdx: 0,
        selectedTileID: 0,
        flipx: false,
        flipy: false,
        selectedMetatileID: 0
      };
    }
  }

  mounted() {
    this.updateCurrentSelection();
    this.updateCurrentMetatile();
  }

  @Watch("tilesetName", {
    immediate: true
  })
  updateCurTiles() {
    if (this.tileset.extension) {
      this.extensionTilesInfo = getTilesInfo(this.tilesetName);
    } else {
      this.baseTilesInfo = getTilesInfo(this.tilesetName);
    }
  }

  @Watch("tileset.assoc", {
    immediate: true
  })
  updateAssocTiles() {
    if (this.tileset.extension) {
      this.baseTilesInfo = getTilesInfo(this.tileset.assoc);
    } else {
      this.extensionTilesInfo = getTilesInfo(this.tileset.assoc);
    }
  }

  @Watch("state", {
    deep: true
  })
  updateCurrentSelection() {
    if (!this.state) {
      return;
    }

    const context = this.tileCanvas.getContext("2d");
    if (!context) {
      throw new Error("No 2D Context!");
    }

    const isBaseTile = this.state.selectedTileID <= 0x200;
    const tileID = isBaseTile
      ? this.state.selectedTileID
      : this.state.selectedTileID - 0x200;
    const tile = renderTile(
      isBaseTile ? this.baseTilesInfo.buffer : this.extensionTilesInfo.buffer,
      tileID,
      this.palette,
      2,
      this.state.flipx,
      this.state.flipy,
      true
    );
    context.putImageData(tile, 0, 0);
  }

  @Watch("state.selectedMetatileID")
  @Watch("selectedMetatile", { deep: true })
  @Watch("palettes", { deep: true })
  @Watch("tileset.assoc")
  @Watch("tilesetName")
  updateCurrentMetatile() {
    const context = this.metatileCanvas.getContext("2d");
    if (!context) {
      throw new Error("No 2D Context");
    }
    const metatile = this.selectedMetatile;
    const scale = 2;

    const { base, extension } = this.palettes;

    let palettes = [...base];

    if (extension) {
      palettes.push(...extension);
    }

    const lower = renderMetatileLayer(
      metatile.slice(0, 4),
      this.baseTilesInfo.buffer,
      this.extensionTilesInfo.buffer,
      palettes,
      scale
    );
    const upper = renderMetatileLayer(
      metatile.slice(4, 8),
      this.baseTilesInfo.buffer,
      this.extensionTilesInfo.buffer,
      palettes,
      scale
    );

    context.clearRect(
      0,
      0,
      this.metatileCanvas.width,
      this.metatileCanvas.height
    );

    context.drawImage(lower, 0, 0);
    context.drawImage(upper, 32, 0);
  }

  async changeNumMetatiles() {
    const curLen = this.tileset.metatiles.length;

    const newNumTiles = await DialogManager.openDialogWithLabel(
      "New number of tiles",
      InputNumberDialog,
      {
        value: curLen,
        min: 1,
        max: 512
      }
    );
    if (newNumTiles === undefined || newNumTiles == curLen) {
      return;
    } else if (newNumTiles > curLen) {
      this.tileset.metatiles.push(
        ...[...Array(newNumTiles - curLen)].map(() => [0, 0, 0, 0, 0, 0, 0, 0])
      );
    } else {
      this.tileset.metatiles.splice(newNumTiles);
      if (this.state.selectedMetatileID >= newNumTiles) {
        this.state.selectedMetatileID = 0;
      }
    }
  }

  get selectedMetatile(): number[] {
    if (!this.state) {
      return [];
    }
    return this.tileset.metatiles[this.state.selectedMetatileID];
  }

  get tilesetName() {
    return this.args;
  }

  get tileset() {
    return GameModel.model.tilesets[this.tilesetName];
  }

  get palette() {
    if (!this.state) {
      return [];
    }

    const palettes = this.palettes;
    if (this.state.currentPaletteIdx >= 6) {
      return palettes.extension![this.state.currentPaletteIdx - 6];
    }
    return palettes.base[this.state.currentPaletteIdx];
  }

  get palettes() {
    return getTilesetPalettes(this.tilesetName);
  }

  selectPalette(idx: number) {
    this.state.currentPaletteIdx = idx;
  }

  async choosePalette() {
    const p = await DialogManager.openDialog(
      PaletteSelectDialog,
      this.tilesetName
    );
    if (p === undefined) {
      return;
    }
    this.state.currentPaletteIdx = p;
  }

  drawMetatile(event: MouseEvent) {
    const x = Math.floor(event.offsetX / 16);
    const y = Math.floor(event.offsetY / 16);

    let metatileNum = 0;

    if (x >= 2) {
      metatileNum = 4 + y * 2 + (x - 2);
    } else {
      metatileNum = y * 2 + x;
    }

    const id = this.state.selectedTileID;

    Vue.set(
      this.selectedMetatile,
      metatileNum,
      this.state.selectedTileID |
        (this.state.flipx ? 1 << 10 : 0) |
        (this.state.flipy ? 1 << 11 : 0) |
        (this.state.currentPaletteIdx << 12)
    );
  }

  render() {
    return (
      <WindowLayout>
        <Portal to="title">
          {this.tileset.extension ? "" : "Base "}Tileset #{this.tilesetName}
        </Portal>
        <Window>
          <FlexRow>
            <Label width={3}>Meta tiles</Label>
            <Button width={2} onclick={() => this.changeNumMetatiles()}>
              {this.tileset.metatiles.length}
            </Button>
          </FlexRow>

          <MetatilesDisplay
            tilesetID={this.tilesetName}
            baseTilesetInfo={this.baseTilesInfo}
            extTilesetInfo={this.extensionTilesInfo}
            onselect={(n: number) => (this.state.selectedMetatileID = n)}
            class={styles.metatileList}
          />
        </Window>
        <Window>
          <FlexRow>
            <Label width={3}>Current Tile</Label>
            <canvas
              ref="tile-canvas"
              width="16"
              height="16"
              class={styles.selectedTile}
            />
          </FlexRow>
          <FlexRow>
            <Label width={2}>Flip X</Label>
            <Button
              width={2}
              onclick={() => (this.state.flipx = !this.state.flipx)}
            >
              {this.state?.flipx ? "TRUE" : "FALSE"}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Flip Y</Label>
            <Button
              width={2}
              onclick={() => (this.state.flipy = !this.state.flipy)}
            >
              {this.state?.flipy ? "TRUE" : "FALSE"}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label>Edit Metatile:</Label>
          </FlexRow>
          <FlexRow>
            <canvas
              ref="metatile-canvas"
              width="64"
              height="32"
              class={styles.selectedMetatile}
              onclick={(event: MouseEvent) => this.drawMetatile(event)}
            />
          </FlexRow>
        </Window>
        <Window>
          <FlexRow>
            <Button width={3} onclick={() => this.choosePalette()}>
              Palette {this.state?.currentPaletteIdx}
            </Button>
            {this.palette.map((color, i) => (
              <Button
                class={styles.paletteIcon}
                style={{ backgroundColor: "#" + color }}
                width={1}
                onclick={() => chooseText(this.palette, i, 6)}
              >
                <font-awesome-icon
                  icon="tint"
                  style={{
                    color: colorBrightness(color) > 0.5 ? "black" : "white"
                  }}
                />
              </Button>
            ))}
          </FlexRow>
          <FlexRow>
            <div class={styles.tilesetContainer}>
              <Label>From this tileset</Label>
              {!this.tileset.extension ? (
                <div />
              ) : (
                <FlexRow style={{ marginLeft: "-2px" }}>
                  <Label width={2}>From</Label>
                  <Button
                    width={7}
                    onclick={() =>
                      chooseFromList(this.tileset, "assoc", List.Tilesets)
                    }
                  >
                    {this.tileset.assoc}
                  </Button>
                </FlexRow>
              )}
              <TilesDisplay
                tilesInfo={
                  this.tileset.extension
                    ? this.extensionTilesInfo
                    : this.baseTilesInfo
                }
                palette={this.palette}
                onselect={(n: number) =>
                  (this.state.selectedTileID = this.tileset.extension
                    ? 0x200 + n
                    : n)
                }
              />
              {this.tileset.assoc !== "" ? (
                <TilesDisplay
                  tilesInfo={
                    this.tileset.extension
                      ? this.baseTilesInfo
                      : this.extensionTilesInfo
                  }
                  palette={this.palette}
                  onselect={(n: number) =>
                    (this.state.selectedTileID = this.tileset.extension
                      ? n
                      : 0x200 + n)
                  }
                />
              ) : (
                <div />
              )}
            </div>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}

const styles = stylesheet({
  paletteIcon: {
    $nest: {
      "& .fa-tint": {
        display: "none"
      },
      "&:hover .fa-tint": {
        display: "unset"
      }
    }
  },
  selectedTile: {
    width: "16px",
    height: "16px",
    marginTop: "4px",
    boxShadow: "0px 0px 3px " + Theme.textColor
  },
  selectedMetatile: {
    width: "64px",
    height: "32px",
    marginTop: "4px",
    boxShadow: "0px 0px 3px " + Theme.textColor,
    marginLeft: "6px"
  },
  tilesetContainer: {
    display: "grid",
    gridTemplateRows: "auto auto",
    gridTemplateColumns: "auto auto",
    margin: Constants.margin,
    columnGap: px(25 + 8),
    rowGap: "4px"
  },
  metatileList: {
    boxShadow: "0px 0px 3px " + Theme.textColor,
    marginTop: "4px"
  }
});
