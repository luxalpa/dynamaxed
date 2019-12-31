import { Component, Prop, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";

@Component
export class Label extends Vue {
  @Prop({
    default: 4
  })
  width!: number;

  @Prop({
    default: 1
  })
  height!: number;

  render() {
    return (
      <div
        class={styles.label}
        style={Constants.gridRect(this.width, this.height)}
      >
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
    cursor: "default",
    paddingLeft: "5px",
    boxSizing: "border-box"
  }
});
