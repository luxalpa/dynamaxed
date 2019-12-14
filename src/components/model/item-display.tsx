import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";

@Component
export class ItemDisplay extends Vue {
  @Prop() item!: string;

  get itemName(): string {
    if (this.item == undefined) {
      return "NONE";
    }
    return GameModel.model.items[this.item].name;
  }

  render() {
    return <span>{this.itemName}</span>;
  }
}
