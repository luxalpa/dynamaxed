import { Vue } from "vue-property-decorator";

export const Preferences = Vue.observable(
  new (class {
    emulatorPath: string = "";
  })()
);
