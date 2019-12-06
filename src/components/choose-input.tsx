import { Component, Prop, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

@Component
export class ChooseInput extends Vue {
  @Prop() width!: number;
  @Prop() height!: number;

  render() {
    const style = {};

    return (
      <div>
        <button style={style} class={styles.button}>
          {this.$slots.default}
        </button>
      </div>
    );
  }
}

const styles = stylesheet({
  button: {
    backgroundColor: Theme.foregroundBgColor,
    border: "0",
    margin: Constants.margin
  }
});
