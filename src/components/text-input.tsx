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

  get _value() {
    return this.value;
  }

  set _value(v: string) {
    this.$emit("input", v);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          style={{ margin: this.margin, width: Constants.grid(this.width) }}
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
    padding: "5px",
    height: Constants.grid(1),
    backgroundColor: Theme.middlegroundBgColor,
    color: Theme.textColor,
    border: "0",
    $nest: {
      "&[disabled]": {
        color: Theme.textDisabledColor
      }
    }
  }
});
