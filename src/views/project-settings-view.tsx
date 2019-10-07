import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ProjectSettingsView"
})
export default class ProjectSettingsView extends Vue {
  render() {
    return <div>Project Settings</div>;
  }
}
