import { Component, Ref } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { TextInput } from "@/components/text-input";
import { FlexRow } from "@/components/layout";
import { Spacer } from "@/components/spacer";
import { Button } from "@/components/button";
import { modifiers } from "vue-tsx-support";
import { Label } from "@/components/label";
import { stylesheet } from "typestyle";
import { TextAreaInput } from "@/components/text-area-input";

interface InputTextDialogProps {
  value: string;
  check?: (v: string) => string | false;
}

@Component
export class InputTextAreaDialog extends Dialog<InputTextDialogProps, string> {
  text: string = "";
  @Ref("input") input!: TextInput;

  created() {
    this.text = this.args.value;
  }

  mounted() {
    this.input.focus();
  }

  get currentError() {
    if (!this.args.check) {
      return false;
    }

    return this.args.check(this.text);
  }

  get isValidInput() {
    return this.currentError === false;
  }

  tryAccept() {
    if (this.isValidInput) this.accept(this.text);
  }

  render() {
    return (
      <div onkeyup={modifiers.enter(() => this.tryAccept())}>
        <div>
          <FlexRow>
            <TextAreaInput
              vModel={this.text}
              width={8}
              ref="input"
              height={4}
            />
          </FlexRow>
          <FlexRow>
            {this.currentError && (
              <Label width={8} class={styles.error}>
                {this.currentError}
              </Label>
            )}
          </FlexRow>
          <FlexRow>
            <Spacer width={2} />
            <Button width={3} onclick={() => this.reject()}>
              Cancel
            </Button>
            <Button
              disabled={!this.isValidInput}
              width={3}
              onclick={() => this.tryAccept()}
            >
              OK
            </Button>
          </FlexRow>
        </div>
      </div>
    );
  }
}

const styles = stylesheet({
  error: {
    color: "#f00000"
  }
});
