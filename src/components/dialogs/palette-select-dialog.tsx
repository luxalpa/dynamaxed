import { Component } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { Button } from "@/components/button";
import { GameModel } from "@/model/model";
import { stylesheet } from "typestyle";
import { getTilesetPalettes } from "@/tiles";
import { Label } from "@/components/label";

@Component({
  name: "PaletteSelectDialog"
})
export class PaletteSelectDialog extends Dialog<string, number> {
  get palettes() {
    return getTilesetPalettes(this.args);
  }

  render() {
    return (
      <div>
        <Label>From Base</Label>
        {this.palettes.base.map((p, i) => (
          <Button width={15} onclick={() => this.accept(i)}>
            <div class={styles.paletteName}>Palette {i}</div>
            <div class={styles.colorList}>
              {p.map(c => (
                <div
                  class={styles.color}
                  style={{ backgroundColor: "#" + c }}
                />
              ))}
            </div>
          </Button>
        ))}
        {this.palettes.extension && [
          <Label>From Extension</Label>,
          this.palettes.extension.map((p, i) => (
            <Button width={15} onclick={() => this.accept(i + 6)}>
              <div class={styles.paletteName}>Palette {i + 6}</div>
              <div class={styles.colorList}>
                {p.map(c => (
                  <div
                    class={styles.color}
                    style={{ backgroundColor: "#" + c }}
                  />
                ))}
              </div>
            </Button>
          ))
        ]}
      </div>
    );
  }
}

const styles = stylesheet({
  color: {
    height: "20px",
    width: "20px"
  },
  paletteName: {
    width: "70px"
  },
  colorList: {
    right: "0",
    display: "grid",
    gridAutoFlow: "column",
    marginLeft: "20px"
  }
});
