import { Component, Prop, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

@Component
export class TextInput extends Vue {
  @Prop() value!: string;
  @Prop() disabled!: boolean;
  @Prop({
    default: Constants.margin
  })
  margin!: string;
  @Prop({
    default: 4
  })
  width!: number;
  @Prop({
    default: false
  })
  right!: boolean;

  get _value() {
    return this.value;
  }

  set _value(v: string) {
    this.$emit("input", v);
  }

  render() {
    const style = {
      margin: this.margin,
      width: Constants.grid(this.width),
      textAlign: this.right ? "right" : "left"
    };

    return (
      <div>
        <input
          type="text"
          style={style}
          class={styles.textInput}
          vModel={this._value}
          disabled={this.disabled}
        />
      </div>
    );
  }
}

const styles = stylesheet({
  textInput: {
    height: Constants.grid(1),
    backgroundColor: "transparent",
    color: Theme.textColor,
    border: "0",
    $nest: {
      "&[disabled]": {
        color: Theme.textDisabledColor
      },
      "&[disabled]:hover": {
        color: Theme.textDisabledColor
        // backgroundColor: Theme.middlegroundBgColor
      },
      "&:hover": {
        color: Theme.textHColor
        // backgroundColor: Theme.middlegroundBgColor
      },
      "&:focus": {
        outline: "none"
      }
    },
    padding: "0 6px",
    boxSizing: "border-box",
    overflow: "hidden"
  }
});
