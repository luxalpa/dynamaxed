import { Component, Vue } from "vue-property-decorator";

@Component
export class Button extends Vue {
  isActive = false;

  emitBtnClick() {
    this.$emit("click");
  }

  render() {
    return (
      <div
        class={["button", this.isActive && "active"]}
        onclick={this.emitBtnClick}
        onmousedown={() => (this.isActive = true)}
        onmouseup={() => (this.isActive = false)}
      >
        {this.$slots.default}
      </div>
    );
  }
}
