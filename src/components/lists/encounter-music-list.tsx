import { EncounterMusic } from "@/model/constants";
import { createList } from "@/components/lists/list";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";
import { IDDisplay } from "@/components/displays/id-display";

const EncounterMusicList = createList(
  () =>
    EncounterMusic.reduce<Record<string, void>>(
      (previousValue, currentValue) => {
        previousValue[currentValue] = void 0;
        return previousValue;
      },
      {}
    ),
  [
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, e) => <IDDisplay value={e} />
    }
  ],
  ([id], input) => ("#" + id.toUpperCase()).includes(input.toUpperCase())
);

export const ChooseEncounterMusicDialog = ChooseFromListDialog(
  EncounterMusicList
);
