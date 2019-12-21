import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";

@Component
export class ItemDisplay extends Vue {
  @Prop() item!: string;

  get itemName(): string {
    return GameModel.model.items[this.item].name;
  }

  render() {
    if (this.item == "NONE") {
      return <span>-</span>;
    }
    return <span>{this.itemName}</span>;
  }
}
