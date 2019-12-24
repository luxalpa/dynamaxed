import { Component, Vue } from "vue-property-decorator";
import { Column, Table } from "@/components/table";
import { View } from "@/modules/view-manager";
import { Dialog } from "@/modules/dialog-manager";
import { ChooseFromListDialog } from "@/components/dialogs/choose-from-list-dialog";
import { createListView } from "@/components/views/list-view";

export function createList<T>(
  model: () => Record<string, T>,
  layout: Column<[string, T]>[]
): new () => Vue {
  const c = class extends Vue {
    onEntryClick(id: string) {
      this.$emit("entryclick", id);
    }

    get entries() {
      return Object.entries(model());
    }

    render() {
      return (
        <Table
          entries={this.entries}
          layout={layout}
          rowKey={([id]: [string, T]) => id}
          onentryclick={([id]: [string, T]) => this.onEntryClick(id)}
        />
      );
    }
  };

  return Component({ name: "DynList" })(c);
}

export interface CreateOpts<T> {
  model: () => Record<string, T>;
  defaultObj?: () => T;
  layout: Column<[string, T]>[];
  viewTitle: string;
  targetView: new () => View<string>;
}

export function generateListComponents<T>(
  opts: CreateOpts<T>
): { view: new () => View<void>; dialog: new () => Dialog<string, string> } {
  // TODO: Find out what we want to do with duplication
  // const DuplicateCol: Column<[string, T]> = {
  //   text: "",
  //   render: (h, [id]) => (
  //     <Button width={1}>
  //       <font-awesome-icon icon={["far", "clone"]} size="sm" />
  //     </Button>
  //   )
  // };
  const ListComponent = createList(opts.model, opts.layout);

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
