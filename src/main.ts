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
import { TrainersView } from "@/components/lists/trainer-list";
import { TrainerClassesView } from "@/components/lists/trainer-class-list";
import { ProjectManager } from "@/modules/project-manager";
import { restoreState } from "@/store";
import { EditMapView } from "@/components/views/edit-map-view";
import { MovesView } from "@/components/lists/move-list";
import { PokemonsView } from "@/components/lists/pokemon-list";
import { EditMoveView } from "@/components/views/edit-move-view";
import { TableStateInitial } from "@/components/table";
import { EditPokemonView } from "@/components/views/edit-pokemon-view";

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
  trainers: TrainersView,
  "trainer-classes": TrainerClassesView,
  "edit-trainer-class": EditTrainerClassView,
  "edit-map-view": EditMapView,
  moves: MovesView,
  "edit-move-view": EditMoveView,
  "edit-pokemon-view": EditPokemonView,
  pokemons: PokemonsView
});

ViewManager.push(TrainersView, TableStateInitial());

window.onbeforeunload = (e: Event) => {
  ProjectManager.Save();
};

if (process.env.NODE_ENV === "development") {
  const req = require.context("@/", false, /^\.\/dev\.ts$/);
  try {
    req("./dev.ts");
  } catch {
    console.log("You can run your own startup code by creating /src/dev.ts");
  }
} else {
  restoreState();
}

new Vue({
  render: h => h(App)
}).$mount("#app");
