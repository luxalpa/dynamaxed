import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import fs from "fs";
import { PathManager } from "@/modules/path-manager";
import { getTilesetPath } from "@/model/serialize/tilesets";
import { decode } from "upng-js";
import { Constants } from "@/constants";
import { renderTile } from "@/tiles";

@Component({
  name: "TilesetDisplay"
})
export class TilesetDisplay extends Vue {
  @Prop() tilesetID!: string;
  @Prop() palette!: string[];

  @Ref("canvas") canvas!: HTMLCanvasElement;
  imgBuffer?: Buffer;
  numTiles = 0;
  scaleFactor = 2;

  @Watch("tilesetID")
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
        renderTile(this.imgBuffer, i, this.palette, this.scaleFactor),
        (i % 16) * 8 * this.scaleFactor,
        Math.floor(i / 16) * 8 * this.scaleFactor
      );
    }
  }

  loadNewTileset() {
    const pngData = fs.readFileSync(
      PathManager.projectPath(getTilesetPath(this.tilesetID), "tiles.png")
    );

    const img = decode(pngData);
    this.canvas.width = img.width * this.scaleFactor;
    this.canvas.height = img.height * this.scaleFactor;
    this.numTiles = (img.width / 8) * (img.height / 8);
    this.imgBuffer = new Buffer(img.data);
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
    width: Constants.grid(9)
  }
});
