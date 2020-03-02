import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

@Component
export class TextAreaInput extends Vue {
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

  get inputValue() {
    return this.value;
  }

  set inputValue(v: string) {
    this.$emit("input", v);
  }

  @Ref("input") refInput!: HTMLInputElement;

  focus() {
    this.refInput.focus();
  }

  render() {
    const style = {
      ...Constants.gridRect(this.width, this.height)
    };

    return (
      <div>
        <textarea
          style={style}
          class={styles.textInput}
          vModel={this.inputValue}
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
      },
      "&:hover": {
        color: Theme.textHColor
      },
      "&:focus": {
        outline: "none"
      }
    },
    padding: "6px 6px",
    lineHeight: "1.6",
    boxSizing: "border-box",
    overflow: "hidden"
  }
});
