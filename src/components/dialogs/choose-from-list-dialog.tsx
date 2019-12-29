import { Dialog } from "@/modules/dialog-manager";
import { stylesheet } from "typestyle";
import { Component, Vue } from "vue-property-decorator";
import { Button } from "@/components/button";
import { FlexRow } from "@/components/layout";
import { createModelObj } from "@/utils";
import { Constants } from "@/constants";
import { View, ViewManager } from "@/modules/view-manager";

interface CreateNewOpts<T> {
  model: () => Record<string, T>;
  defaultObj?: () => T;
  targetView: new () => View<string>;
}

export function ChooseFromListDialog<T>(
  List: any,
  opts?: CreateNewOpts<T>
): new () => Dialog<string, string> {
  @Component
  class ListDialog extends Dialog<string, string> {
    createNew() {
      const id = createModelObj(opts!.model(), opts!.defaultObj);
      ViewManager.push(opts!.targetView, id);
      this.accept(id);
    }

    render() {
      return (
        <div>
          <List
            onentryclick={(e: string) => this.accept(e)}
            class={styles.tableWrapper}
          />
          {opts && (
            <FlexRow class={styles.btn}>
              <Button onclick={() => this.createNew()}>Create new</Button>
            </FlexRow>
          )}
        </div>
      );
    }
  }

  return ListDialog;
}

const styles = stylesheet({
  tableWrapper: {
    overflow: "auto",
    maxHeight: "100%",
    margin: Constants.margin
  },
  btn: {
    justifyContent: "center"
  }
});
