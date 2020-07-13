import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { renderTile, TilesInfo } from "@/tiles";
import { Theme } from "@/theming";

const numTilesX = 16;

@Component({
  name: "TilesDisplay"
})
export class TilesDisplay extends Vue {
  @Prop() tilesInfo!: TilesInfo;
  @Prop() palette!: string[];

  @Ref("canvas") canvas!: HTMLCanvasElement;
  imgBuffer?: Buffer;
  numTiles = 0;
  scaleFactor = 2;

  @Watch("tilesInfo")
  somethingChanged() {
    this.loadNewTileset();
  }

  @Watch("palette", {
    deep: true
  })
  updateCanvas() {
    if (!this.imgBuffer) {
      return;
    }

    const context = this.canvas.getContext("2d");
    if (context == null) {
      throw new Error("Context is null");
    }

    for (let i = 0; i < this.numTiles; i++) {
      context.putImageData(
        renderTile(
          this.imgBuffer,
          i,
          this.palette,
          this.scaleFactor,
          false,
          false,
          true
        ),
        (i % numTilesX) * 8 * this.scaleFactor,
        Math.floor(i / numTilesX) * 8 * this.scaleFactor
      );
    }
  }

  loadNewTileset() {
    const info = this.tilesInfo;

    this.canvas.width = numTilesX * 8 * this.scaleFactor;
    this.canvas.height =
      Math.ceil(info.numTiles / numTilesX) * 8 * this.scaleFactor;
    this.numTiles = info.numTiles;
    this.imgBuffer = info.buffer;
    this.updateCanvas();
  }

  async mounted() {
    await this.$nextTick();
    this.loadNewTileset();
  }

  selectTile(event: MouseEvent) {
    const x = Math.floor(event.offsetX / (8 * this.scaleFactor));
    const y = Math.floor(event.offsetY / (8 * this.scaleFactor));
    const i = y * numTilesX + x;
    if (i >= this.numTiles) {
      return;
    }
    this.$emit("select", i);
  }

  render() {
    return (
      <canvas
        ref="canvas"
        class={styles.canvas}
        onclick={(event: MouseEvent) => this.selectTile(event)}
      />
    );
  }
}

const styles = stylesheet({
  canvas: {
    boxShadow: "0 0 3px " + Theme.textColor
  }
});
