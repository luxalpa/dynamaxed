import { Component, Prop, Vue } from "vue-property-decorator";
import { style, stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { Theme } from "@/theming";
import { px } from "csx";
import { NestedCSSProperties } from "typestyle/lib/types";

@Component
export class Checkbox extends Vue {
  @Prop({
    default: 5
  })
  width!: number;
  @Prop({
    default: 1
  })
  height!: number;

  @Prop() value!: boolean;

  onClick() {
    this.$emit("input", !this.value);
  }

  render() {
    return (
      <div
        style={Constants.gridRect(this.width, this.height)}
        class={styles.item}
        onclick={() => this.onClick()}
      >
        <div class={[styles.contentWrapper, styleBoxHover]}>
          <div class={styles.box} />
          {this.value && (
            <font-awesome-icon
              icon={["fas", "check"]}
              class={styles.checkIcon}
            />
          )}
          {this.$slots.default}
        </div>
      </div>
    );
  }
}

const checkSize = Constants.gridSize;

const styles = stylesheet({
  item: {
    margin: Constants.margin,
    display: "flex",
    alignItems: "center",
    position: "relative",
    "-webkit-user-select": "none"
  },

  contentWrapper: {
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center"
  },

  box: {
    width: px(checkSize),
    height: px(checkSize),
    backgroundColor: Theme.foregroundBgColor,
    marginRight: "10px"
  },

  checkIcon: {
    position: "absolute",
    marginLeft: px(6),
    marginTop: px(0)
  }
});

const styleBoxHover = style({
  $nest: {
    "&:hover": {
      color: Theme.textHColor
    },
    [`&:hover .${styles.box}`]: {
      backgroundColor: Theme.foregroundHBgColor
    }
  }
});
