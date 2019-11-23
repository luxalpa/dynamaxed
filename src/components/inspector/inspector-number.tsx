import { Component, Prop, Vue } from "vue-property-decorator";
import { HTMLElementEvent } from "@/utils";

@Component
export class InspectorNumber extends Vue {
  @Prop() readonly value!: number;

  valueChange(event: HTMLElementEvent<HTMLInputElement>) {
    this.$emit("input", event.target.value);
  }

  render() {
    return (
      <div class="inspector-entry">
        <div class="inspector-label">{this.$slots.default}</div>
        <div class="inspector-value">
          <input
            type="number"
            value={this.value}
            oninput={this.valueChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}
