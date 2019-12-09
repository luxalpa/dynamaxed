import Vue from "vue";
import App from "@/app";

import "./styles/_styles.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleLeft,
  faSave
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faArrowRight,
  faCaretLeft,
  faCheck,
  faTimes,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import "typeface-fira-sans";
import "@fortawesome/fontawesome-free/css/all.css";
import { enableTheme } from "@/theming";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;
//Vue.config.devtools = true;

library.add(
  faSave,
  faTimes,
  faArrowAltCircleLeft,
  faCaretLeft,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTrashAlt
);

enableTheme();

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  render: h => h(App)
}).$mount("#app");
