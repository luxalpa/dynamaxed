import { Component, Watch } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { stylesheet } from "typestyle";
import { GameModel } from "@/model/model";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { TilesetDisplay } from "@/components/displays/tileset-display";
import { chooseFromList, chooseText } from "@/components/views/utils";
import { DialogManager } from "@/modules/dialog-manager";
import { PaletteSelectDialog } from "@/components/dialogs/palette-select-dialog";
import { Constants, List } from "@/constants";
import { px } from "csx";
import { MetatilesDisplay } from "@/components/displays/metatiles-display";
import { Portal } from "portal-vue";
import { getTilesetPalettes } from "@/tiles";

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

    const palettes = getTilesetPalettes(this.tilesetName);
    if (this.state.currentPaletteIdx >= 6) {
      return palettes.extension![this.state.currentPaletteIdx - 6];
    }
    return palettes.base[this.state.currentPaletteIdx];
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

  render() {
    return (
      <WindowLayout>
        <Portal to="title">
          {this.tileset.extension ? "" : "Base "}Tileset #{this.tilesetName}
        </Portal>
        <Window>
          <Label width={4}>Meta tiles</Label>
          <MetatilesDisplay tilesetID={this.tilesetName} />
        </Window>
        <Window>
          <Label width={8}>Current Selection</Label>
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
              <TilesetDisplay
                tilesetID={this.tilesetName}
                palette={this.palette}
              />
              {this.tileset.assoc !== "" ? (
                <TilesetDisplay
                  tilesetID={this.tileset.assoc}
                  palette={this.palette}
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
  tilesetContainer: {
    display: "grid",
    gridTemplateRows: "auto auto",
    gridTemplateColumns: "auto auto",
    margin: Constants.margin,
    columnGap: px(25 + 8),
    rowGap: "4px"
  }
});
