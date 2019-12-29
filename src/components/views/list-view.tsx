import { Component, Vue } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
import { FlexRow } from "@/components/layout";
import { Button } from "@/components/button";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { createModelObj } from "@/utils";
import { Portal } from "portal-vue";
import { TableState } from "@/components/table";

interface CreateListViewOpts<T> {
  model: () => Record<string, T>;
  defaultObj?: () => T;
  title: string;
  targetView: new () => View<string>;
  list: new () => Vue;
}

export function createListView<T>(
  opts: CreateListViewOpts<T>
): new () => View<TableState> {
  const List = opts.list;

  @Component
  class ListView extends View<TableState> {
    createNew() {
      const id = createModelObj(opts.model(), opts.defaultObj);
      ViewManager.push(opts.targetView, id);
    }

    get title(): string {
      return opts.title;
    }

    render() {
      return (
        <div class={styles.view}>
          <Portal to="title">{this.title}</Portal>
          <List
            onentryclick={(id: string) => ViewManager.push(opts.targetView, id)}
            tablestate={this.args}
            class={styles.list}
          />
          <FlexRow class={styles.btn}>
            <Button onclick={() => this.createNew()}>Create new</Button>
          </FlexRow>
        </div>
      );
    }
  }

  return ListView;
}

const styles = stylesheet({
  view: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  list: {
    height: "100%",
    overflow: "auto",
    margin: Constants.margin
  },
  btn: {
    justifyContent: "center"
  }
});
