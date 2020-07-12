import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import fs from "fs";
import { PathManager } from "@/modules/path-manager";
import { getTilesetPath } from "@/model/serialize/tilesets";
import { decode } from "upng-js";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { GameModel } from "@/model/model";
import { getTilesetExtInfo, getTilesetPalettes, renderMetaTile } from "@/tiles";

function getTilesBuffer(tilesetID: string): Buffer {
  const pngData = fs.readFileSync(
    PathManager.projectPath(getTilesetPath(tilesetID), "tiles.png")
  );
  return new Buffer(decode(pngData).data);
}

@Component({
  name: "MetatilesDisplay"
})
export class MetatilesDisplay extends Vue {
  @Prop() tilesetID!: string;
  numTilesX = 8;

  @Ref("canvas") canvas!: HTMLCanvasElement;
  scaleFactor = 1;

  get tileset() {
    return GameModel.model.tilesets[this.tilesetID];
  }

  @Watch("tileset", {
    deep: true
  })
  updateCanvas() {
    const info = getTilesetExtInfo(this.tilesetID);

    const primaryTileset = getTilesBuffer(info.base);
    const secondaryTileset = info.extension
      ? getTilesBuffer(info.extension)
      : undefined;

    const { base, extension } = getTilesetPalettes(this.tilesetID);

    let palettes = [...base];

    if (extension) {
      palettes.push(...extension);
    }

    const context = this.canvas.getContext("2d");
    if (context == null) {
      throw new Error("Context is null");
    }

    const metatiles = GameModel.model.tilesets[this.tilesetID].metatiles;

    for (let i = 0; i < metatiles.length; i++) {
      const metatile = renderMetaTile(
        metatiles[i],
        primaryTileset,
        secondaryTileset,
        palettes,
        this.scaleFactor
      );

      context.drawImage(
        metatile,
        (i % this.numTilesX) * 16 * this.scaleFactor,
        Math.floor(i / this.numTilesX) * 16 * this.scaleFactor
      );
    }
  }

  loadNewTileset() {
    this.canvas.width = 16 * this.scaleFactor * this.numTilesX;
    this.canvas.height =
      16 *
      this.scaleFactor *
      Math.ceil(
        GameModel.model.tilesets[this.tilesetID].metatiles.length /
          this.numTilesX
      );
    this.updateCanvas();
  }

  async mounted() {
    await this.$nextTick();
    this.loadNewTileset();
  }

  render() {
    return (
      <div class={styles.container}>
        <canvas ref="canvas" />
      </div>
    );
  }
}

const styles = stylesheet({
  container: {
    width: Constants.grid(5)
  }
});
