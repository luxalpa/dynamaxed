import Vue from "vue";
import App from "@/app";

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
import { enableTheme } from "@/theming";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ViewManager } from "@/modules/view-manager";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { TrainersView } from "@/components/lists/trainer-list";
import { TrainerClassesView } from "@/components/lists/trainer-class-list";
import PortalVue from "portal-vue";
import { ProjectManager } from "@/modules/project-manager";
import { initStore } from "@/store";
import { ipcRenderer } from "electron";

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
  "edit-trainer-class": EditTrainerClassView
});

ViewManager.push(TrainersView);

if (process.env.NODE_ENV === "development") {
  ProjectManager.openProject(
    "C:\\Users\\Smaug\\Desktop\\Pokemon\\pokeemerald\\"
  );
  // ViewManager.push(EditTrainerClassView, "HIKER");
} else {
  window.onbeforeunload = (e: Event) => {
    window.onbeforeunload = null;
    e.returnValue = false;

    ProjectManager.Save().finally(() => ipcRenderer.send("app_quit"));
  };

  initStore();
}

new Vue({
  render: h => h(App)
}).$mount("#app");
