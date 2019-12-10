import { Component, Ref } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { TextInput } from "@/components/text-input";
import { FlexRow } from "@/components/layout";
import { Spacer } from "@/components/spacer";
import { Button } from "@/components/button";
import { modifiers } from "vue-tsx-support";

@Component
export class InputTextDialog extends Dialog<string, string> {
  text!: string;
  @Ref("input") input!: TextInput;

  created() {
    this.text = this.args;
  }

  mounted() {
    this.input.focus();
  }

  render() {
    return (
      <div onkeyup={modifiers.enter(() => this.accept(this.text))}>
        <div>
          <FlexRow>
            <TextInput vModel={this.text} width={8} ref="input" />
          </FlexRow>
          <FlexRow>
            <Spacer width={2} />
            <Button width={3} onclick={() => this.reject()}>
              Cancel
            </Button>
            <Button width={3} onclick={() => this.accept(this.text)}>
              OK
            </Button>
          </FlexRow>
        </div>
      </div>
    );
  }
}
