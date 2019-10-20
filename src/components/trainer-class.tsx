import { Component, Prop, Vue } from "vue-property-decorator";
import { GameModel } from "@/model/model";

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
        {trainerClass.name} (${money * 4})
      </div>
    );
  }
}
