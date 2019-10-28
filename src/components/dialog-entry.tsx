import { component } from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";

interface Props {
  label: string;
}

export const DialogEntry = component<any, any>({
  functional: true,
  props: {
    label: ""
  },
  render(
    createElement: CreateElement,
    context: RenderContext<Props>
  ): VNode | VNode[] {
    return (
      <v-row>
        <v-col cols={4} class="dialog-label py-1">
          {context.props.label}
          {context.props.label && ":"}
        </v-col>
        <v-col cols={8} class="py-1">
          {context.children}
        </v-col>
      </v-row>
    );
  }
});
