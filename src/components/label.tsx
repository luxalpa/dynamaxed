import { Component, Prop, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";

@Component
export class Label extends Vue {
  @Prop() width!: number;

  render() {
    return (
      <div class={styles.label} style={{ width: Constants.grid(this.width) }}>
        {this.$slots.default}
      </div>
    );
  }
}

const styles = stylesheet({
  label: {
    margin: Constants.margin,
    height: Constants.grid(1),
    display: "flex",
    alignItems: "center",
    cursor: "default"
  }
});
