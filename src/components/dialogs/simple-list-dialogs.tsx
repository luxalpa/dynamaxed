import { createSimpleListDialog } from "@/components/lists/list";
import {
  Abilities,
  EncounterMusic,
  EvoKinds,
  GrowthRates,
  MoveEffects,
  MoveTargets,
  Types
} from "@/model/constants";

export const ChooseMoveTargetDialog = createSimpleListDialog(MoveTargets);
export const ChooseMoveEffectDialog = createSimpleListDialog(MoveEffects);
export const ChooseEncounterMusicDialog = createSimpleListDialog(
  EncounterMusic
);

export const ChooseTypeDialog = createSimpleListDialog(Types);
export const ChooseAbilityDialog = createSimpleListDialog(Abilities);
export const ChooseGrowthRateDialog = createSimpleListDialog(GrowthRates);
export const ChooseEvoKindDialog = createSimpleListDialog(EvoKinds);
