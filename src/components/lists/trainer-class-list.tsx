import { GameModel, TrainerClass } from "@/model/model";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { ListSettings } from "@/components/lists/list";
import { style } from "typestyle";
import { IDDisplay } from "@/components/displays/id-display";
import { TrainerClassDefaultMoney } from "@/model/constants";

export const TrainerClassList: ListSettings<TrainerClass> = {
  title: "All Trainer Classes",
  targetView: EditTrainerClassView,
  model: () => GameModel.model.trainerClasses,
  defaultObj: () => ({
    name: "CUSTOM CLASS",
    money: 5
  }),
  layout: [
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id, trainerClass]) => <IDDisplay value={id} />
    },
    {
      text: "Title",
      sort: ([, trainerClass1], [, trainerClass2]) =>
        trainerClass1.name.localeCompare(trainerClass2.name),
      render: (h, [, trainerClass]) => trainerClass.name
    },
    {
      text: "Money",
      sort: ([, trainerClass1], [, trainerClass2]) =>
        trainerClass1.money - trainerClass2.money,
      render: (h, [id, trainerClass]) => (
        <div class={styleMoney}>{trainerClass.money || "-"}</div>
      ),
      align: "right"
    }
  ],
  filter: ([id, trainerClass], input) =>
    ("#" + id.toUpperCase()).includes(input.toUpperCase()) ||
    trainerClass.name.toUpperCase().includes(input.toUpperCase())
};

const styleMoney = style({
  textAlign: "right"
});
