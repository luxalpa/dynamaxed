import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement } from "vue";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

export interface Column<T> {
  text: string;
  align?: string;
  render(h: CreateElement, e: T): any;
}

@Component
export class Table extends Vue {
  @Prop() layout!: Column<any>[];
  @Prop() entries!: any[];

  onRowClick(row: any) {
    this.$emit("entryclick", row);
  }

  render() {
    return (
      <div>
        <table class={styles.table}>
          <tr>
            {this.layout.map(c => (
              <th class={styles.tableHeader} style={{ textAlign: c.align }}>
                {c.text}
              </th>
            ))}
          </tr>
          {this.entries.map(row => (
            <tr onclick={() => this.onRowClick(row)}>
              {this.layout.map(c => (
                <td>{c.render(this.$createElement, row)}</td>
              ))}
            </tr>
          ))}
        </table>
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
