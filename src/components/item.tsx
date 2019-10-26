import { GameModel } from "@/model/model";
import { component } from "vue-tsx-support";
import { CreateElement, RenderContext, VNode } from "vue";

interface Props {
  itemID: string;
}

function item(itemID: string) {
  return GameModel.model.items[itemID];
}

export const Item = component({
  functional: true,
  props: {
    itemID: String
  },

  render(
    createElement: CreateElement,
    context: RenderContext
  ): VNode | VNode[] {
    return [<span>{item(context.props.itemID).name}</span>];
  }
});
