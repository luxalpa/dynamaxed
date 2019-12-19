import { GameModel, TrainerClass } from "@/model/model";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { generateListComponents } from "@/components/lists/list";

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
      render: (h, [id, trainerClass]) => `#${id}`
    },
    {
      text: "Text",
      render: (h, [id, trainerClass]) => trainerClass.name
    },
    {
      text: "Money",
      render: (h, [id, trainerClass]) => trainerClass.money || "-"
    }
  ]
});
