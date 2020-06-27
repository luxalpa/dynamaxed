import { Component } from "vue-property-decorator";
import { Column, FilterFn, Table, TableState } from "@/components/table";
import { View, ViewManager } from "@/modules/view-manager";
import { Dialog } from "@/modules/dialog-manager";
import { createModelObj } from "@/utils";
import { FlexRow } from "@/components/layout";
import { Button } from "@/components/button";
import { stylesheet } from "typestyle";
import { Constants, List } from "@/constants";
import { Portal } from "portal-vue";

export interface ListSettings<T> {
  model: () => Record<string, T>;
  defaultObj?: () => T;
  layout: Column<[string, T]>[];
  targetView?: new () => View<string>;
  filter: FilterFn<[string, T]>;
  title?: string;
  allowCreation?: boolean;
}

export interface ListDialogOptions {
  list: List;
  key: string;
}

export interface ListViewOptions {
  list: List;
  tableState: TableState;
}

@Component
export class ListDialog extends Dialog<ListDialogOptions, string> {
  createNew() {
    const id = createModelObj(this.opts.model(), this.opts.defaultObj);
    ViewManager.push(this.opts.targetView!, id);
    this.accept(id);
  }

  get opts() {
    const l = stringToList.get(this.args.list);
    if (l === undefined) {
      throw new Error("List not registered!");
    }
    return l;
  }

  get entries() {
    return Object.entries(this.opts.model());
  }

  render() {
    return (
      <div>
        <Table
          entries={this.entries}
          layout={this.opts.layout}
          rowKey={([id]: [string, any]) => id}
          rowFilter={this.opts.filter}
          onentryclick={([id]: [string, any]) => this.accept(id)}
          class={styles.tableWrapper}
        />
        {this.opts.targetView && this.opts.allowCreation && (
          <FlexRow class={styles.btn}>
            <Button onclick={() => this.createNew()}>Create new</Button>
          </FlexRow>
        )}
      </div>
    );
  }
}

@Component
export class ListView extends View<ListViewOptions> {
  createNew() {
    const id = createModelObj(this.opts.model(), this.opts.defaultObj);
    ViewManager.push(this.opts.targetView!, id);
  }

  get opts() {
    const l = stringToList.get(this.args.list);
    if (l === undefined) {
      throw new Error("List not registered!");
    }
    return l;
  }

  get entries() {
    return Object.entries(this.opts.model());
  }

  render() {
    return (
      <div class={styles.view}>
        <Portal to="title">{this.opts.title}</Portal>
        <Table
          entries={this.entries}
          layout={this.opts.layout}
          rowKey={([id]: [string, any]) => id}
          rowFilter={this.opts.filter}
          onentryclick={([id]: [string]) => {
            this.opts.targetView && ViewManager.push(this.opts.targetView!, id);
          }}
          state={this.args.tableState}
          class={styles.list}
        />
        {this.opts.targetView && this.opts.allowCreation && (
          <FlexRow class={styles.btn}>
            <Button onclick={() => this.createNew()}>Create new</Button>
          </FlexRow>
        )}
      </div>
    );
  }
}

const styles = stylesheet({
  tableWrapper: {
    overflow: "auto",
    maxHeight: "100%",
    margin: Constants.margin
  },
  btn: {
    justifyContent: "center"
  },
  view: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  list: {
    height: "100%",
    overflow: "auto",
    margin: Constants.margin
  }
});

const listToString = new Map<ListSettings<any>, string>();
const stringToList = new Map<string, ListSettings<any>>();

export function registerLists(entries: Record<string, ListSettings<any>>) {
  for (const [str, list] of Object.entries(entries)) {
    listToString.set(list, str);
    stringToList.set(str, list);
  }
}

export function createSimpleListDialog(array: string[]): ListSettings<void> {
  return {
    filter: ([id], input) => id.toUpperCase().includes(input.toUpperCase()),
    model: () => Object.fromEntries(array.map(e => [e, void 0])),
    layout: [
      {
        text: "ID",
        sort: ([id1], [id2]) => id1.localeCompare(id2),
        render: (h, e) => e
      }
    ]
  };
}
