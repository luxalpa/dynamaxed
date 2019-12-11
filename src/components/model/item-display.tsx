import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";

@Component
export class ItemDisplay extends Vue {
  @Prop() item!: string;

  render() {
    return <span>{GameModel.model.items[this.item].name}</span>;
  }
}
