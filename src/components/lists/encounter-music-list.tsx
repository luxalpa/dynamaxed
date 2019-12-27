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
      render: (h, e) => <IDDisplay value={e} />,
      filter([id], input) {
        return ("#" + id.toUpperCase()).includes(input.toUpperCase());
      }
    }
  ]
);

export const ChooseEncounterMusicDialog = ChooseFromListDialog(
  EncounterMusicList
);
