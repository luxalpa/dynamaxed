import { component } from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { Theme } from "@/theming";

interface Props {
  label: string;
}

export const EditorProperty = component<any, any>({
  functional: true,
  props: {
    label: ""
  },
  render(
    createElement: CreateElement,
    context: RenderContext<Props>
  ): VNode | VNode[] {
    return (
      <div class={styles.row}>
        <div class={styles.label}>
          {context.props.label}
          {context.props.label && ":"}
        </div>
        <div>{context.children}</div>
      </div>
    );
  }
});

const styles = stylesheet({
  row: {
    width: Constants.grid(9),
    display: "flex",
    justifyContent: "space-between"
  },
  label: {
    height: Constants.grid(1),
    margin: Constants.margin,
    display: "flex",
    alignItems: "center"
  }
});
