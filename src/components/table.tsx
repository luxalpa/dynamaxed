import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement } from "vue";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";
import { TextInput } from "@/components/text-input";
import { FlexRow } from "@/components/layout";
import { Label } from "@/components/label";

export interface Column<T> {
  text: string;
  align?: string;
  render(h: CreateElement, e: T): any;
  sort: (a: T, b: T) => number;
}

export type FilterFn<T> = (row: T, input: string) => boolean;

const NoColumn: Column<any> = {
  text: "",
  render(h: CreateElement, e: any): any {
    return "";
  },
  sort: (a, b) => 0
};

@Component
export class Table extends Vue {
  @Prop() layout!: Column<any>[];
  @Prop() entries!: any[];
  @Prop() rowKey!: (x: any) => string;
  @Prop({
    default: () => true
  })
  rowFilter!: FilterFn<any>;

  filter: string = "";
  sortCol = NoColumn;
  sortDir = false;

  onRowClick(row: any) {
    this.$emit("entryclick", row);
  }

  sortByColumn(c: Column<any>) {
    if (this.sortCol === c) {
      if (this.sortDir) {
        this.sortDir = false;
        this.sortCol = NoColumn;
      } else {
        this.sortDir = true;
      }
    } else {
      this.sortCol = c;
    }
  }

  render() {
    let entries = this.entries;
    entries = entries.filter(v => {
      return this.rowFilter(v, this.filter);
    });

    if (this.sortCol !== NoColumn) {
      // We need to make sure sort works on a new array so we can always
      // get our original back
      if (entries === this.entries) {
        entries = [...entries];
      }
      entries.sort(this.sortCol.sort);
      if (this.sortDir) {
        entries = entries.reverse();
      }
    }

    return (
      <div>
        <FlexRow>
          <Label width={2}>Filter:</Label>
          <TextInput vModel={this.filter} />
        </FlexRow>
        <div>
          <table class={styles.table}>
            <tr>
              {this.layout.map(c => (
                <th
                  class={styles.tableHeader}
                  style={{ textAlign: c.align }}
                  onclick={() => this.sortByColumn(c)}
                >
                  {c.text}
                </th>
              ))}
            </tr>
            {entries.map(row => (
              <tr onclick={() => this.onRowClick(row)} key={this.rowKey(row)}>
                {this.layout.map(c => (
                  <td>{c.render(this.$createElement, row)}</td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}

const styles = stylesheet({
  table: {
    borderCollapse: "collapse",
    $nest: {
      "& tr": {
        cursor: "pointer",
        $nest: {
          "&:hover": {
            backgroundColor: Theme.backgroundHBgColor
          }
        }
      },
      "& td": {
        padding: "0px 10px",
        boxSizing: "border-box",
        height: Constants.grid(1),
        margin: Constants.margin
      }
    }
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    padding: "0 8px",
    backgroundColor: Theme.backgroundBgColor,
    height: Constants.grid(1),
    margin: Constants.margin,
    textAlign: "left",
    fontWeight: 500,
    cursor: "default",
    boxSizing: "border-box",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.backgroundHBgColor
      }
    }
  }
});
