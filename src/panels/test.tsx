import { Component, Vue } from "vue-property-decorator";
import { LayoutManager } from "@/modules/layout-manager";

@Component
export class Test1 extends Vue {
  render() {
    return <div style={{ "background-color": "red" }}>Test 1</div>;
  }
}

@Component
export class Test2 extends Vue {
  render() {
    return <div style={{ "background-color": "blue" }}>Test 2</div>;
  }
}
