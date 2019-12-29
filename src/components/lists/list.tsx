import { Component, Prop, Vue } from "vue-property-decorator";
import { Column, FilterFn, Table, TableState } from "@/components/table";
import { View } from "@/modules/view-manager";
import { Dialog } from "@/modules/dialog-manager";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";
import { createListView } from "@/components/views/list-view";

export interface GenListOpts<T> {
  model: () => Record<string, T>;
  layout: Column<[string, T]>[];
  filter?: FilterFn<[string, T]>;
}

export function createList<T>(opts: GenListOpts<T>): new () => Vue {
  const c = class extends Vue {
    tablestate!: TableState;

    onEntryClick(id: string) {
      this.$emit("entryclick", id);
    }

    get entries() {
      return Object.entries(opts.model());
    }

    render() {
      return (
        <Table
          entries={this.entries}
          layout={opts.layout}
          rowKey={([id]: [string, T]) => id}
          rowFilter={opts.filter}
          onentryclick={([id]: [string, T]) => this.onEntryClick(id)}
          state={this.tablestate}
        />
      );
    }
  };

  Prop()(c.prototype, "tablestate");
  return Component({ name: "DynList" })(c);
}

export interface GenListComponentsOpts<T> {
  model: () => Record<string, T>;
  defaultObj?: () => T;
  layout: Column<[string, T]>[];
  viewTitle: string;
  targetView: new () => View<string>;
  filter?: FilterFn<[string, T]>;
}

export function generateListComponents<T>(
  opts: GenListComponentsOpts<T>
): {
  view: new () => View<TableState>;
  dialog: new () => Dialog<string, string>;
} {
  const ListComponent = createList({
    filter: opts.filter,
    layout: opts.layout,
    model: opts.model
  });

  return {
    dialog: ChooseFromListDialog(ListComponent, {
      model: opts.model,
      targetView: opts.targetView,
      defaultObj: opts.defaultObj
    }),
    view: createListView({
      title: opts.viewTitle,
      list: ListComponent,
      defaultObj: opts.defaultObj,
      model: opts.model,
      targetView: opts.targetView
    })
  };
}
