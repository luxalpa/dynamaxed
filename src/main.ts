import Vue from "vue";
import App from "@/app";

import "./styles/_styles.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

Vue.config.productionTip = false;
Vue.config.devtools = true;

library.add(faSave, faTimes);

new Vue({
  render: h => h(App)
}).$mount("#app");
