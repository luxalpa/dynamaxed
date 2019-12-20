import { Component } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { TrainerPics } from "@/model/constants";
import { PathManager } from "@/modules/path-manager";
import { Button } from "@/components/button";
import { Sprite } from "@/components/sprite";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

@Component
export class ChooseTrainerPicDialog extends Dialog<string, string> {
  render() {
    return (
      <div>
        <div class={styles.scrollArea}>
          <div class={styles.elements}>
            {TrainerPics.map(id => (
              <Button width={3} height={3} onclick={() => this.accept(id)}>
                <Sprite src={PathManager.trainerPic(id)} />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const styles = stylesheet({
  scrollArea: {
    overflow: "auto",
    padding: "0 4px",
    margin: "4px 0"
  },
  elements: {
    margin: "-2px",
    display: "flex",
    flexWrap: "wrap",
    width: Constants.gridWrap(3 * 6),
    boxSizing: "border-box"
    // ...Constants.gridWrapRect(3 * 6, 3 * 8)
  }
});
