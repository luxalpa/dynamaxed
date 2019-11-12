import { Component, Vue } from "vue-property-decorator";

@Component
export class Panel extends Vue {
  render() {
    return <div class="panel">{this.$slots.default}</div>;
  }
}
