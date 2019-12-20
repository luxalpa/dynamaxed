import { Component, Prop, Vue } from "vue-property-decorator";
import { classes, stylesheet } from "typestyle";
import { Constants } from "@/constants";
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

  @Prop({
    default: false
  })
  disabled!: boolean;

  emitBtnClick() {
    if (!this.disabled) {
      this.$emit("click");
    }
  }

  render() {
    return (
      <div
        style={Constants.gridRect(this.width, this.height)}
        class={classes(
          styles.button,
          this.isActive && styles.active,
          this.disabled && styles.disabled
        )}
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
    backgroundColor: Theme.foregroundBgColor,
    justifyContent: "center",
    cursor: "pointer",
    boxSizing: "border-box",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.foregroundHBgColor
      }
    }
  },
  disabled: {
    backgroundColor: Theme.middlegroundBgColor,
    color: Theme.textDisabledColor,
    border: "1px solid " + Theme.middlegroundHBgColor,
    cursor: "default",
    $nest: {
      "&:hover": {
        backgroundColor: "unset"
      }
    }
  },

  active: {}
});
