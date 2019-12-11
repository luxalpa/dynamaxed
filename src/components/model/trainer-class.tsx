import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";
import { stylesheet } from "typestyle";

@Component
export class TrainerClass extends Vue {
  @Prop({
    required: true
  })
  readonly classId!: string;

  render() {
    const trainerClass = GameModel.model.trainerClasses[this.classId];
    let money = trainerClass.money;
    if (money === undefined) {
      money = 5;
    }

    return (
      <div>
        <div>{trainerClass.name}</div>
        <div class={styles.money}>${money * 4}</div>
      </div>
    );
  }
}

const styles = stylesheet({
  money: {
    textAlign: "center"
  }
});
