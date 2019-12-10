import { Component } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { stylesheet } from "typestyle";

@Component
export class ChooseTrainerClassDialog extends Dialog<string, string> {
  render() {
    return <div></div>;
  }
}

const styles = stylesheet({});
