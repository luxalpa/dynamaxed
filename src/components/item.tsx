import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";

@Component
export class Item extends Vue {
  @Prop() readonly itemID!: string;

  get item() {
    return GameModel.model.items[this.itemID];
  }

  render() {
    return <span>{this.item.name}</span>;
  }
}
