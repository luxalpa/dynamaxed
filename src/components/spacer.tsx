import { Component, Prop, Vue } from "vue-property-decorator";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";

@Component
export class Spacer extends Vue {
  @Prop({
    default: 1
  })
  width!: number;
  @Prop({
    default: 1
  })
  height!: number;

  render() {
    return (
      <div
        class={styles.spacer}
        style={Constants.gridRect(this.width, this.height)}
      />
    );
  }
}

const styles = stylesheet({
  spacer: {}
});
