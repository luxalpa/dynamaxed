import Vue from "vue";
import App from "@/app";

import "./styles/_styles.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "typeface-fira-sans";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.config.productionTip = false;
//Vue.config.devtools = true;

library.add(faSave, faTimes);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");
