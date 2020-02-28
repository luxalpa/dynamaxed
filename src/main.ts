import Vue from "vue";
import { App } from "@/app";

import "normalize.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleLeft,
  faClone,
  faSave
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCaretLeft,
  faCheck,
  faTimes,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import "typeface-fira-sans";
import "@fortawesome/fontawesome-free/css/all.css";
import PortalVue from "portal-vue";

import { enableTheme } from "@/theming";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ViewManager } from "@/modules/view-manager";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { TrainerList } from "@/components/lists/trainer-list";
import { TrainerClassList } from "@/components/lists/trainer-class-list";
import { ProjectManager } from "@/modules/project-manager";
import { restoreState } from "@/store";
import { EditMapView } from "@/components/views/edit-map-view";
import { MoveList } from "@/components/lists/move-list";
import { PokemonList } from "@/components/lists/pokemon-list";
import { EditMoveView } from "@/components/views/edit-move-view";
import { EditPokemonView } from "@/components/views/edit-pokemon-view";
import {
  createSimpleListDialog,
  ListView,
  registerLists
} from "@/components/lists/list";
import { List } from "@/constants";
import {
  Abilities,
  EncounterMusic,
  EvoKinds,
  HoldEffects,
  MoveEffects,
  MoveTargets,
  Pockets,
  TutorMoves,
  Types
} from "@/model/constants";
import { ItemList } from "@/components/lists/item-list";
import { TMHMList } from "@/components/lists/tm-hm-list";
import { GrowthRatesList } from "@/components/lists/growth-rates-list";
import { TutorMoveList } from "@/components/lists/tutor-move-list";
import { EditItemView } from "@/components/views/edit-item-view";

Vue.use(PortalVue);

Vue.config.productionTip = false;
//Vue.config.devtools = true;

library.add(
  faSave,
  faTimes,
  faArrowAltCircleLeft,
  faCaretLeft,
  faArrowLeft,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faCheck,
  faTrashAlt,
  faClone
);

enableTheme();

Vue.component("font-awesome-icon", FontAwesomeIcon);

ViewManager.registerViews({
  "edit-trainer": EditTrainerView,
  "edit-trainer-class": EditTrainerClassView,
  "edit-map-view": EditMapView,
  "edit-move-view": EditMoveView,
  "edit-pokemon-view": EditPokemonView,
  "edit-item-view": EditItemView,
  "list-view": ListView
});

registerLists({
  [List.Pokemon]: PokemonList,
  [List.Move]: MoveList,
  [List.Trainer]: TrainerList,
  [List.TrainerClass]: TrainerClassList,
  [List.MoveTargets]: createSimpleListDialog(MoveTargets),
  [List.MoveEffects]: createSimpleListDialog(MoveEffects),
  [List.Types]: createSimpleListDialog(Types),
  [List.Abilities]: createSimpleListDialog(Abilities),
  [List.GrowthRates]: GrowthRatesList,
  [List.EvoKinds]: createSimpleListDialog(EvoKinds),
  [List.EncounterMusic]: createSimpleListDialog(EncounterMusic),
  [List.Pockets]: createSimpleListDialog(Pockets),
  [List.HoldEffects]: createSimpleListDialog(HoldEffects),
  [List.Items]: ItemList,
  [List.TMHMs]: TMHMList,
  [List.TutorMoves]: TutorMoveList
});

window.onbeforeunload = (e: Event) => {
  ProjectManager.Save();
};

if (process.env.NODE_ENV == "development") {
  const req = require.context("@/", false, /^\.\/dev\.ts$/);
  try {
    req("./dev.ts");
  } catch (e) {
    console.log("You can run your own startup code by creating /src/dev.ts", e);
  }
} else {
  restoreState();
}

new Vue({
  render: h => h(App)
}).$mount("#app");
