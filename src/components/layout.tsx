import { component } from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";
import { stylesheet } from "typestyle";

export const FlexRow = component({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    return <div class={styles.row}>{context.children}</div>;
  }
});

export const FlexColumn = component({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    return <div class={styles.column}>{context.children}</div>;
  }
});

const styles = stylesheet({
  row: {
    display: "flex",
    minHeight: "29px"
  },
  column: {
    display: "flex",
    flexDirection: "column"
  }
});
