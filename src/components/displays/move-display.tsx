import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";

@Component
export class MoveDisplay extends Vue {
  @Prop() move!: string;

  get moveObj() {
    return GameModel.model.moves[this.move];
  }

  render() {
    return <span>{this.moveObj.name}</span>;
  }
}
