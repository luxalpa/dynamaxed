import { GameModel, TrainerClass } from "@/model/model";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { generateListComponents } from "@/components/lists/list";
import { style } from "typestyle";
import { IDDisplay } from "@/components/displays/id-display";

export const {
  view: TrainerClassesView,
  dialog: ChooseTrainerClassDialog
} = generateListComponents<TrainerClass>({
  viewTitle: "All Trainer Classes",
  targetView: EditTrainerClassView,
  model: () => GameModel.model.trainerClasses,
  defaultObj: () => ({
    name: "CUSTOM CLASS"
  }),
  layout: [
    {
      text: "ID",
      render: (h, [id, trainerClass]) => <IDDisplay value={id} />
    },
    {
      text: "Text",
      render: (h, [id, trainerClass]) => trainerClass.name
    },
    {
      text: "Money",
      render: (h, [id, trainerClass]) => (
        <div class={styleMoney}>{trainerClass.money || "-"}</div>
      ),
      align: "right"
    }
  ]
});

const styleMoney = style({
  textAlign: "right"
});
