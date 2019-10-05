import { Component, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  emitBtnClick() {
    this.$emit("click");
  }

  render() {
    return (
      <div class="button" onclick={this.emitBtnClick}>
        {this.$slots.default}
      </div>
    );
  }
}
