import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export class ListBtn extends Vue {
  @Prop() readonly selected!: boolean;

  onClick() {
    this.$emit("click");
  }

  render() {
    let classes = ["list-btn"];
    if (this.selected) {
      classes.push("selected");
    }

    return (
      <span class={classes} onmousedown={() => this.onClick()}>
        {this.$slots.default}
      </span>
    );
  }
}
