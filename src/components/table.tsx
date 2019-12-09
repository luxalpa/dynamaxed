import { Component, Vue } from "vue-property-decorator";
import { CreateElement } from "vue";

interface Column<T> {
  text: string;
  align?: string;
  render(h: CreateElement, e: T): any;
}

@Component
export class Table extends Vue {
  render() {
    return <div></div>;
  }
}
