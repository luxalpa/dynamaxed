import { Component, Prop, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { NestedCSSProperties } from "typestyle/lib/types";
import { Theme } from "@/theming";

@Component
export class Button extends Vue {
  isActive = false;
  @Prop({
    default: 5
  })
  width!: number;

  @Prop({
    default: 1
  })
  height!: number;

  emitBtnClick() {
    this.$emit("click");
  }

  render() {
    return (
      <div
        style={Constants.gridRect(this.width, this.height)}
        class={classes(styles.button, this.isActive && styles.active)}
        onclick={this.emitBtnClick}
        onmousedown={() => (this.isActive = true)}
        onmouseup={() => (this.isActive = false)}
      >
        {this.$slots.default}
      </div>
    );
  }
}

const styles = stylesheet({
  button: {
    "-webkit-user-select": "none",
    margin: Constants.margin,
    display: "flex",
    alignItems: "center",
    backgroundColor: Theme.middlegroundBgColor,
    justifyContent: "center",
    cursor: "pointer",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.middlegroundHBgColor
      }
    }
  },
  active: {}
});
