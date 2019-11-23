import { Component, Prop, Vue } from "vue-property-decorator";
import { Button } from "@/components/button";
import { PathManager } from "@/modules/path-manager";

@Component
export class InspectorTrainerPic extends Vue {
  @Prop() readonly value!: string;
  render() {
    return (
      <div class="inspector-entry">
        <div class="inspector-label">{this.$slots.default}</div>
        <div class="inspector-value">
          <Button>
            <img src={PathManager.trainerPic(this.value)} />
          </Button>
        </div>
      </div>
    );
  }
}
