import { Component, Prop, Vue } from "vue-property-decorator";
import { NestedCSSProperties } from "typestyle/lib/types";
import { px, url } from "csx";

@Component
export class Sprite extends Vue {
  @Prop() src!: string;
  @Prop({
    default: 64
  })
  size!: number;

  render() {
    const style: NestedCSSProperties = {
      backgroundImage: url(this.src.replace(/\\/g, "\\\\")),
      width: px(this.size),
      height: px(this.size)
    };

    return <div style={style} />;
  }
}
