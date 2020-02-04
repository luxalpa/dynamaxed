import { GameModel, Move } from "@/model/model";
import { ListSettings } from "@/components/lists/list";
import { IDDisplay } from "@/components/displays/id-display";
import { EditMoveView } from "@/components/views/edit-move-view";

export const MoveList: ListSettings<Move> = {
  model: () => GameModel.model.moves,
  targetView: EditMoveView,
  title: "All Moves",
  filter: ([id, move], input) =>
    ("#" + id.toUpperCase()).includes(input.toUpperCase()) ||
    move.name.toUpperCase().includes(input.toUpperCase()) ||
    move.type.toUpperCase().includes(input.toUpperCase()),
  layout: [
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id]) => <IDDisplay value={id} />
    },
    {
      text: "Name",
      sort: ([, move1], [, move2]) => move1.name.localeCompare(move2.name),
      render: (h, [, move]) => move.name
    },
    {
      text: "Type",
      sort: ([, move1], [, move2]) => move1.type.localeCompare(move2.type),
      render: (h, [, move]) => move.type
    },
    {
      text: "Power",
      sort: ([, move1], [, move2]) => move1.power - move2.power,
      render: (h, [, move]) => move.power
    },
    {
      text: "Accuracy",
      sort: ([, move1], [, move2]) => move1.accuracy - move2.accuracy,
      render: (h, [, move]) => move.accuracy
    },
    {
      text: "PP",
      sort: ([, move1], [, move2]) => move1.pp - move2.pp,
      render: (h, [, move]) => move.pp
    }
  ]
};
