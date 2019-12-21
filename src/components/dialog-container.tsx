import { Component, Vue } from "vue-property-decorator";
import { DialogManager } from "@/modules/dialog-manager";
import { modifiers } from "vue-tsx-support";
import { FlexRow } from "@/components/layout";
import { stylesheet } from "typestyle";
import { rgba } from "csx";
import { Theme } from "@/theming";

@Component
export class DialogContainer extends Vue {
  render() {
    return (
      <div>
        {DialogManager.dialogs.map((d, index) => {
          const Dialog: any = d.component;
          return (
            <div
              key={d.id}
              onclick={modifiers.self(() => DialogManager.reject(d.id))}
              class={styles.dialogWrapper}
            >
              <div class={styles.dialog}>
                {d.label !== "" && <FlexRow>{d.label}:</FlexRow>}
                <Dialog
                  args={d.params}
                  dialogID={d.id}
                  class={styles.dialogContent}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const styles = stylesheet({
  dialogWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: rgba(0, 0, 0, 0.5).toString(),
    position: "absolute",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  dialog: {
    backgroundColor: Theme.middlegroundBgColor,
    padding: "29px",
    display: "flex",
    maxHeight: "calc(100% - 62px)",
    boxSizing: "border-box",
    flexDirection: "column"
  },
  dialogContent: {
    display: "contents"
  }
});
