import { Component, Ref, Vue } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { Window, WindowLayout } from "@/components/layout";
import { stylesheet } from "typestyle";
import { GameModel } from "@/model/model";
import { Button } from "@/components/button";

@Component({
  name: "EditTilesetView"
})
export class EditTilesetView extends View<string> {
  @Ref("canvas") canvas!: HTMLElement;

  get tileset() {
    return GameModel.model.tilesets[this.args];
  }

  mounted() {
    console.log(this.canvas);
  }

  render() {
    return (
      <WindowLayout>
        <Window>
          <canvas ref="canvas" />
          {this.tileset.palettes.map(p => (
            <div class={styles.palette}>
              <Button width={2}>Use</Button>
              {p.map(color => (
                <div
                  class={styles.paletteIcon}
                  style={{ backgroundColor: "#" + color }}
                />
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
    width: "20px",
    height: "20px"
  }
});
