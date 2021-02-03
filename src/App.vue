<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Charts</router-link> |
      <router-link to="/pdf">Pdf</router-link>
    </div>
    <router-view class="view" />
  </div>
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .view {
    flex: 1;
  }
}

body, html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
