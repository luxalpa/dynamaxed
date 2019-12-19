import Vue from "vue";
import App from "@/app";

import "normalize.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleLeft,
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
import { enableTheme } from "@/theming";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ViewManager } from "@/modules/view-manager";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { ViewID } from "@/constants";
import { TrainersView } from "@/components/lists/trainer-list";
import { TrainerClassesView } from "@/components/lists/trainer-class-list";
import PortalVue from "portal-vue";

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
  faTrashAlt
);

enableTheme();

Vue.component("font-awesome-icon", FontAwesomeIcon);

ViewManager.registerViews({
  [ViewID.EditTrainer]: EditTrainerView,
  trainers: TrainersView,
  "trainer-classes": TrainerClassesView,
  [ViewID.EditTrainerClass]: EditTrainerClassView
});

ViewManager.push(TrainersView);

if (process.env.NODE_ENV === "development") {
  ViewManager.push(EditTrainerView, "JUAN_5");
}

new Vue({
  render: h => h(App)
}).$mount("#app");
