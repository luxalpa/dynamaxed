import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import fs from "fs";
import { PathManager } from "@/modules/path-manager";
import { getTilesetPath } from "@/model/serialize/tilesets";
import { decode } from "upng-js";

@Component({
  name: "TilesetCanvas"
})
export class TilesetCanvas extends Vue {
  @Prop() tilesetID!: string;
  @Prop() palette!: string[];

  @Ref("canvas") canvas!: HTMLCanvasElement;
  imgBuffer?: Buffer;
  imgWidth = 0;
  imgHeight = 0;
  scaleFactor = 2;

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

    const newImageDimensions = {
      width: this.imgWidth * this.scaleFactor,
      height: this.imgHeight * this.scaleFactor
    };

    const imgData = context.createImageData(
      newImageDimensions.width,
      newImageDimensions.height
    );

    for (let i = 0; i < this.imgWidth * this.imgHeight; i++) {
      let px = this.imgBuffer.readUInt8(Math.floor(i / 2));

      if (i % 2) {
        px = px & 0x0f;
      } else {
        px = px >> 4;
      }

      const color = this.palette[px];

      const bigint = parseInt(color, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      // Scale the image by *2
      const x = this.scaleFactor * (i % this.imgWidth);
      const y = this.scaleFactor * Math.floor(i / this.imgWidth);

      for (let pos of [
        y * newImageDimensions.width + x,
        y * newImageDimensions.width + x + 1,
        (y + 1) * newImageDimensions.width + x,
        (y + 1) * newImageDimensions.width + x + 1
      ]) {
        const npos = pos * 4;

        imgData.data[npos] = r;
        imgData.data[npos + 1] = g;
        imgData.data[npos + 2] = b;
        imgData.data[npos + 3] = 255;
      }
    }

    context.putImageData(imgData, 0, 0);
  }

  async mounted() {
    await this.$nextTick();
    const pngData = fs.readFileSync(
      PathManager.projectPath(getTilesetPath(this.tilesetID), "tiles.png")
    );

    const img = decode(pngData);
    this.canvas.width = img.width * this.scaleFactor;
    this.canvas.height = img.height * this.scaleFactor;
    this.imgWidth = img.width;
    this.imgHeight = img.height;
    this.imgBuffer = new Buffer(img.data);
    this.updateCanvas();
  }

  render() {
    return <canvas ref="canvas" class={styles.canvas} />;
  }
}

const styles = stylesheet({
  canvas: {}
});
