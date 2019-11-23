import { Component, Prop, Vue } from "vue-property-decorator";
import { HTMLElementEvent } from "@/utils";

@Component
export class InspectorText extends Vue {
  @Prop() readonly value!: string;

  valueChange(event: HTMLElementEvent<HTMLInputElement>) {
    this.$emit("input", event.target.value);
  }

  render() {
    return (
      <div class="inspector-entry">
        <div class="inspector-label">{this.$slots.default}</div>
        <div class="inspector-value">
          <input
            type="text"
            value={this.value}
            class="text-input"
            oninput={this.valueChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}
