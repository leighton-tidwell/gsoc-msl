<template>
  <n-config-provider :theme="darkTheme">
    <n-loading-bar-provider>
      <n-layout position="absolute">
        <n-layout-header class="nav" bordered>
          <n-text style="font-size: 18px; display: flex; align-items: center"
            ><n-icon size="30" style="margin-right: 8px"
              ><airplane-outline /></n-icon
            >GSOC MSL</n-text
          >
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <navigation />
          </div>
        </n-layout-header>
        <router-view />
      </n-layout>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import {
  NConfigProvider,
  darkTheme,
  NLayout,
  NLayoutHeader,
  NText,
  NIcon,
  NLoadingBarProvider,
} from "naive-ui";
import { AirplaneOutline } from "@vicons/ionicons5";

import { Navigation } from "./components";

export default defineComponent({
  name: "App",
  setup() {
    return {
      darkTheme,
    };
  },
  components: {
    NLayout,
    NLayoutHeader,
    NConfigProvider,
    NText,
    NIcon,
    AirplaneOutline,
    RouterView,
    Navigation,
    NLoadingBarProvider,
  },
});
</script>

<style scoped>
.nav {
  display: grid;
  height: 3em;
  grid-template-rows: calc(3em - 1px);
  grid-template-columns: 300px auto;
  padding: 0 1em;
  align-items: center;
}
</style>
