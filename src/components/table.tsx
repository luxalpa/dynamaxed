import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement } from "vue";
import { ViewManager } from "@/modules/view-manager";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";

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
        padding: "5px 10px"
      }
    }
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    padding: "10px 10px 8px",
    backgroundColor: Theme.backgroundBgColor,
    textAlign: "left",
    fontWeight: 500,
    cursor: "default",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.backgroundHBgColor
      }
    }
  }
});
