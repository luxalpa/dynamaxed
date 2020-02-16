import { GameModel, Move } from "@/model/model";
import { ListSettings } from "@/components/lists/list";
import { TutorMoves } from "@/model/constants";
import { MoveList } from "@/components/lists/move-list";

export const TutorMoveList: ListSettings<Move> = {
  ...MoveList,
  model: () =>
    Object.fromEntries(
      Object.entries(GameModel.model.moves).filter(([k, v]) =>
        TutorMoves.includes(k)
      )
    )
};
