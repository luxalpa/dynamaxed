import { GameModel, Move } from "@/model/model";
import { createList } from "@/components/lists/list";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";
import { IDDisplay } from "@/components/displays/id-display";

const MoveList = createList<Move>(() => GameModel.model.moves, [
  {
    text: "ID",
    render: (h, [id, move]) => <IDDisplay value={id} />
  },
  {
    text: "Name",
    render: (h, [id, move]) => move.name
  },
  {
    text: "Type",
    render: (h, [id, move]) => move.type
  },
  {
    text: "Power",
    render: (h, [id, move]) => move.power
  },
  {
    text: "Accuracy",
    render: (h, [id, move]) => move.accuracy
  },
  {
    text: "PP",
    render: (h, [id, move]) => move.pp
  }
]);

export const ChooseMoveDialog = ChooseFromListDialog(MoveList);
