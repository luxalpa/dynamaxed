import { GameModel, Move } from "@/model/model";
import { createList } from "@/components/lists/list";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";
import { IDDisplay } from "@/components/displays/id-display";

const MoveList = createList<Move>(
  () => GameModel.model.moves,
  [
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id, move]) => <IDDisplay value={id} />
    },
    {
      text: "Name",
      sort: ([, move1], [, move2]) => move1.name.localeCompare(move2.name),
      render: (h, [id, move]) => move.name
    },
    {
      text: "Type",
      sort: ([, move1], [, move2]) => move1.type.localeCompare(move2.type),
      render: (h, [id, move]) => move.type
    },
    {
      text: "Power",
      sort: ([, move1], [, move2]) => move1.power - move2.power,
      render: (h, [id, move]) => move.power
    },
    {
      text: "Accuracy",
      sort: ([, move1], [, move2]) => move1.accuracy - move2.accuracy,
      render: (h, [id, move]) => move.accuracy
    },
    {
      text: "PP",
      sort: ([, move1], [, move2]) => move1.pp - move2.pp,
      render: (h, [id, move]) => move.pp
    }
  ],
  ([id, move], input) =>
    ("#" + id.toUpperCase()).includes(input.toUpperCase()) ||
    move.name.toUpperCase().includes(input.toUpperCase()) ||
    move.type.toUpperCase().includes(input.toUpperCase())
);

export const ChooseMoveDialog = ChooseFromListDialog(MoveList);
