import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { GameModel } from "@/model/model";
import { getTilesetPalettes, renderMetaTile, TilesInfo } from "@/tiles";

@Component({
  name: "MetatilesDisplay"
})
export class MetatilesDisplay extends Vue {
  @Prop() tilesetID!: string;
  @Prop() baseTilesetInfo!: TilesInfo;
  @Prop() extTilesetInfo!: TilesInfo;

  numTilesX = 8;

  @Ref("canvas") canvas!: HTMLCanvasElement;
  scaleFactor = 1;

  get tileset() {
    return GameModel.model.tilesets[this.tilesetID];
  }

  get palettes() {
    return getTilesetPalettes(this.tilesetID);
  }

  @Watch("tileset", {
    deep: true
  })
  @Watch("palettes")
  updateCanvas() {
    this.canvas.width = 16 * this.scaleFactor * this.numTilesX;
    this.canvas.height =
      16 *
      this.scaleFactor *
      Math.ceil(this.tileset.metatiles.length / this.numTilesX);

    const primaryTileset = this.baseTilesetInfo.buffer;
    const secondaryTileset = this.extTilesetInfo.buffer;

    const { base, extension } = this.palettes;

    let palettes = [...base];

    if (extension) {
      palettes.push(...extension);
    }

    const context = this.canvas.getContext("2d");
    if (context == null) {
      throw new Error("Context is null");
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

  clickMetatile(event: MouseEvent) {
    const x = Math.floor(event.offsetX / (16 * this.scaleFactor));
    const y = Math.floor(event.offsetY / (16 * this.scaleFactor));
    const i = y * this.numTilesX + x;
    if (i >= this.tileset.metatiles.length) {
      return;
    }
    this.$emit("select", i);
  }

  async mounted() {
    await this.$nextTick();
    this.updateCanvas();
  }

  render() {
    return (
      <canvas
        ref="canvas"
        onclick={(event: MouseEvent) => this.clickMetatile(event)}
      />
    );
  }
}
