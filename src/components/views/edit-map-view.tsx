import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { Portal } from "portal-vue";

@Component
export class EditMapView extends View<void> {
  render() {
    return (
      <div>
        <Portal to="title">Map Editor</Portal>
        <canvas />
      </div>
    );
  }
}
