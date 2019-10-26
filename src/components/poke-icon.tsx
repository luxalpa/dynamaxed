import { Component, Prop, Vue } from "vue-property-decorator";
import { PathManager } from "@/modules/path-manager";

@Component
export class PokeIcon extends Vue {
  @Prop() readonly species!: string;

  render() {
    return (
      <div
        class="pokeIcon"
        style={{
          "background-image":
            "url('" +
            PathManager.pokeIcon(this.species).replace(/\\/g, "\\\\") +
            "')"
        }}
      />
    );
  }
}
