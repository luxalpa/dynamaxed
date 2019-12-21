import { Component, Prop, Vue } from "vue-property-decorator";
import { Button } from "@/components/button";

@Component
export class ChooseButton extends Vue {
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
      <div>
        <Button width={this.width} height={this.height}>
          {this.$slots.default}
        </Button>
      </div>
    );
  }
}
