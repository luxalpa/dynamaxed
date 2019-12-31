import { Component, Ref } from "vue-property-decorator";
import { Dialog } from "@/modules/dialog-manager";
import { TextInput } from "@/components/text-input";
import { FlexRow } from "@/components/layout";
import { Spacer } from "@/components/spacer";
import { Button } from "@/components/button";
import { modifiers } from "vue-tsx-support";
import { Label } from "@/components/label";
import { stylesheet } from "typestyle";

export interface InputNumberDialogProps {
  value: number;
  min: number;
  max: number;
}

@Component
export class InputNumberDialog extends Dialog<InputNumberDialogProps, number> {
  text: string = "";
  @Ref("input") input!: TextInput;

  created() {
    this.text = this.args.value.toString();
  }

  mounted() {
    this.input.focus();
  }

  get currentError(): string | false {
    const num = parseInt(this.text);
    if (num.toString() !== this.text) {
      return "Invalid characters";
    }
    if (num < this.args.min) {
      return "Too small";
    }
    if (num > this.args.max) {
      return "Too big";
    }
    return false;
  }

  get isValidInput() {
    return this.currentError === false;
  }

  tryAccept() {
    if (this.isValidInput) this.accept(parseInt(this.text));
  }

  render() {
    return (
      <div onkeyup={modifiers.enter(() => this.tryAccept())}>
        <div>
          <FlexRow>
            <Label width={8} height={2}>
              Enter a value between {this.args.min} and {this.args.max}
            </Label>
          </FlexRow>
          <FlexRow>
            <TextInput vModel={this.text} width={8} ref="input" />
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
