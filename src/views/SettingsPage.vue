<template>
  <n-layout position="absolute" style="top: 3em"
    ><n-grid x-gap="12" :cols="3" style="margin-top: 2em">
      <n-gi></n-gi>
      <n-gi>
        <div class="header">
          <n-h1>
            <n-text style="display: flex; align-items: center">
              <n-icon size="32"><cog /></n-icon>Settings
            </n-text>
          </n-h1>
        </div>
        <div class="content">
          <n-card>
            <n-collapse>
              <n-collapse-item title="Operators" name="1">
                <div>
                  <n-form
                    :label-width="80"
                    :model="formValue"
                    size="large"
                    ref="formRef"
                  >
                    <n-form-item label="Add Operator" path="formValue.name">
                      <n-input
                        v-model:value="formValue.name"
                        placeholder="Name"
                        class="input"
                      />
                      <n-button icon-placement="right" type="primary">
                        <template #icon>
                          <n-icon>
                            <add />
                          </n-icon>
                        </template>
                        Add
                      </n-button>
                    </n-form-item>
                  </n-form>
                  <n-data-table
                    size="small"
                    :columns="columns"
                    :data="data"
                    :pagination="pagination"
                  />
                </div>
              </n-collapse-item>
              <n-collapse-item title="Time" name="2">
                <div></div>
              </n-collapse-item>
            </n-collapse>
          </n-card>
        </div>
      </n-gi>
      <n-gi></n-gi>
    </n-grid>
  </n-layout>
</template>

<script>
import { onMounted, ref, h } from "vue";
import {
  NLayout,
  useLoadingBar,
  NGrid,
  NGi,
  NH1,
  NText,
  NCard,
  NIcon,
  NCollapse,
  NCollapseItem,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDataTable,
} from "naive-ui";
import { Cog, Trash, Add } from "@vicons/ionicons5";

const renderIcon = (icon) => {
  return () => h(NIcon, { size: "15" }, { default: () => h(icon) });
};

const createColumns = () => [
  {
    title: "Delete",
    key: "delete",
    render() {
      return h(renderIcon(Trash), {
        style: "cursor:pointer",
      });
    },
    width: 100,
  },
  {
    title: "Name",
    key: "name",
  },
];

export default {
  setup() {
    const formRef = ref(null);
    const loadingBar = useLoadingBar();
    const operatorList = ref([
      {
        key: 0,
        name: "John Doe",
      },
      {
        key: 1,
        name: "Jane Doe",
      },
    ]);
    loadingBar.start();

    onMounted(() => {
      setTimeout(() => loadingBar.finish(), 1000);
    });

    return {
      formRef,
      formValue: ref({
        name: "",
      }),
      columns: createColumns(),
      data: operatorList,
    };
  },
  components: {
    NLayout,
    NGi,
    NGrid,
    NH1,
    NText,
    NCard,
    Cog,
    NIcon,
    NCollapse,
    NCollapseItem,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NDataTable,
    Add,
  },
};
</script>

<style scoped>
.input {
  margin-right: 8px;
}
</style>
