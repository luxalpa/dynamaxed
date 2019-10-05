import Vue from "vue";
import store from "./store";
import App from "@/app";

import "./styles/_styles.scss";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
