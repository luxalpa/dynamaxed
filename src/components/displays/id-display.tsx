import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export class IDDisplay extends Vue {
  @Prop() value!: string;

  render() {
    return <span>#{this.value}</span>;
  }
}
