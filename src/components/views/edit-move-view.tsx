import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";

@Component
export class EditMoveView extends View<string> {
  render() {
    return <div>Moves View: {this.args}</div>;
  }
}
