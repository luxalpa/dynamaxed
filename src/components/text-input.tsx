import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

@Component
export class TextInput extends Vue {
  @Prop() value!: string;
  @Prop() disabled!: boolean;
  @Prop({
    default: 4
  })
  width!: number;
  @Prop({
    default: 1
  })
  height!: number;

  get _value() {
    return this.value;
  }

  set _value(v: string) {
    this.$emit("input", v);
  }

  @Ref("input") refInput!: HTMLInputElement;

  focus() {
    this.refInput.select();
    this.refInput.focus();
  }

  render() {
    const style = {
      ...Constants.gridRect(this.width, this.height)
    };

    return (
      <div>
        <input
          type="text"
          style={style}
          class={styles.textInput}
          vModel={this._value}
          disabled={this.disabled}
          ref="input"
        />
      </div>
    );
  }
}

const styles = stylesheet({
  textInput: {
    height: Constants.grid(1),
    backgroundColor: Theme.foregroundBgColor,
    color: Theme.textColor,
    margin: Constants.margin,
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
