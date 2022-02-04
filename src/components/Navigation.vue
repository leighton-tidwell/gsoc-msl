<template>
  <div class="nav-menu">
    <n-menu mode="horizontal" :options="menuOptions" default-value="home" />
  </div>
</template>

<script>
import { defineComponent, h, resolveComponent } from "vue";
import { NIcon, NMenu } from "naive-ui";
import {
  HomeOutline,
  FileTrayFullOutline,
  CogOutline,
} from "@vicons/ionicons5";

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const menuOptions = [
  {
    label: () =>
      h(
        resolveComponent("router-link"),
        {
          to: "/",
        },
        { default: () => "Home" }
      ),
    key: "home",
    icon: renderIcon(HomeOutline),
  },
  {
    label: () =>
      h(
        resolveComponent("router-link"),
        {
          to: "/reports",
        },
        { default: () => "Reports" }
      ),
    key: "reports",
    icon: renderIcon(FileTrayFullOutline),
  },
  {
    label: () =>
      h(
        resolveComponent("router-link"),
        {
          to: "/settings",
        },
        { default: () => "Settings" }
      ),
    key: "settings",
    icon: renderIcon(CogOutline),
  },
];

export default defineComponent({
  setup() {
    return {
      menuOptions,
    };
  },
  components: {
    NMenu,
  },
});
</script>
