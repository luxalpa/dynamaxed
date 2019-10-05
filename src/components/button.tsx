import { Component, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  render() {
    return <button>{this.$slots.default}</button>;
  }
}
