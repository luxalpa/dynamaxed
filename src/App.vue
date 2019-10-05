<template>
  <div id="app">
    <div id="recentProjects">
      <div v-for="project of recentProjects">Some project</div>
    </div>
    <button @click="importProject">Import Project</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class App extends Vue {
  recentProjects: Array<string> = []
  importProject() {

  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
