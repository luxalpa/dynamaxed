import { Component, Vue } from "vue-property-decorator";

@Component
export class TextInput extends Vue {
  render() {
    return <input type="text" class="text-input" />;
  }
}
