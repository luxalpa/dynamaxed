import { Component, Vue } from "vue-property-decorator";
import Button from "@/components/button";
import { ProjectManager } from "@/modules/project-manager";

@Component({
  name: "App"
})
export default class App extends Vue {
  render() {
    return (
      <div id="app">
        <div id="recentProjects">
          {ProjectManager.recentProjects.map(project => (
            <button onClick={() => console.log("Error")}>Some project</button>
          ))}
        </div>
        <Button>Import Project</Button>
      </div>
    );
  }
}
