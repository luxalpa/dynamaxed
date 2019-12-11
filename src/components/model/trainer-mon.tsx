import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";
import { PathManager } from "@/modules/path-manager";

@Component
export class TrainerMon extends Vue {
  @Prop() readonly species!: string;

  get mon() {
    const mon = GameModel.model.pokemon[this.species];
    if (mon) {
      return mon;
    } else {
      return GameModel.model.pokemon["NONE"];
    }
  }

  render() {
    return (
      <div>
        <div class="party-pic">
          <img src={PathManager.pokePic(this.species)} />
        </div>
        <div class="party-name">{this.mon.name}</div>
      </div>
    );
  }
}
