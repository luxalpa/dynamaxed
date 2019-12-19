import { Dialog } from "@/modules/dialog-manager";
import { stylesheet } from "typestyle";
import { Component } from "vue-property-decorator";
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
  const c = class extends Dialog<string, string> {
    createNew() {
      const id = createModelObj(opts!.model(), opts!.defaultObj);
      ViewManager.push(opts!.targetView, id);
      this.accept(id);
    }

    render() {
      return (
        <div class={styles.dialog}>
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
  };

  return Component(c);
}

const styles = stylesheet({
  tableWrapper: {
    overflow: "auto",
    maxHeight: "100%",
    margin: Constants.margin
  },
  dialog: {
    maxHeight: "calc(100% - 62px)",
    boxSizing: "border-box",
    flexDirection: "column"
  },
  btn: {
    justifyContent: "center"
  }
});
