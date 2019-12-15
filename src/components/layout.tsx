import { component } from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";

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

export const Window = component({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    return <div class={styles.window}>{context.children}</div>;
  }
});

export const WindowLayout = component({
  functional: true,
  render(
    createElement: CreateElement,
    context: RenderContext<any>
  ): VNode | VNode[] {
    return <div class={styles.windowlayout}>{context.children}</div>;
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
  },
  windowlayout: {
    display: "flex",
    alignItems: "flex-start",
    height: "100%"
  },
  window: {
    backgroundColor: Theme.middlegroundBgColor,
    padding: "25px",
    margin: Constants.margin,
    maxHeight: "calc(100% - 4px)",
    boxSizing: "border-box",
    overflow: "auto"
  }
});
