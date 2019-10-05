<template>
  <div id="app">
    <div id="recentProjects">
      <div v-for="project of recentProjects">Some project</div>
    </div>
    <Button @click="importProject">Import Project</Button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";

@Component({
  components: {}
})
export default class App extends Vue {
  get recentProjects() {
    return ProjectManager.recentProjects;
  }
  created() {}
  importProject() {}
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
