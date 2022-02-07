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
                    :rules="rules"
                    size="large"
                    ref="formRef"
                  >
                    <n-form-item label="Add Operator" path="name">
                      <n-input
                        v-model:value="formValue.name"
                        placeholder="Name"
                        class="input"
                      />
                      <n-button
                        :loading="loadingOperatorAdd"
                        icon-placement="right"
                        @click="addOperator"
                        type="primary"
                      >
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
                    :data="operatorOptions"
                    :pagination="pagination"
                    :loading="loadingOperators"
                  />
                </div>
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
  useNotification,
  NPopconfirm,
} from "naive-ui";
import { Cog, Trash, Add } from "@vicons/ionicons5";
import { getPersonnel, insertIntoList, removeFromList } from "../api/";

const renderIcon = (icon) => {
  return () => h(NIcon, { size: "15" }, { default: () => h(icon) });
};

const createColumns = (deleteOperator) => [
  {
    title: "Delete",
    key: "delete",
    render(row) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => {
            deleteOperator(row);
          },
        },
        {
          trigger: h(renderIcon(Trash), {
            style: "cursor: pointer;",
          }),
          default: () => "Are you sure you want to delete this operator?",
        }
      );
    },
    width: 100,
  },
  {
    title: "Name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortOrder: "ascend",
  },
];

export default {
  setup() {
    const formRef = ref(null);
    const loadingBar = useLoadingBar();
    const operatorOptions = ref([]);
    const loadingOperators = ref(false);
    const loadingOperatorAdd = ref(false);
    const notification = useNotification();
    loadingBar.start();

    onMounted(() => {
      loadingOperators.value = true;
      getPersonnel()
        .then((data) => {
          const formattedList = data
            .map((person) => ({
              name: person.name,
              key: person.Id,
            }))
            .sort((a, b) =>
              a.value < b.value ? -1 : a.value > b.value ? 1 : 0
            );
          operatorOptions.value = formattedList;
          loadingOperators.value = false;
          setTimeout(() => loadingBar.finish(), 500);
        })
        .catch((error) => {
          notification["error"]({
            content: "An error has occured.",
            meta: error.message,
            duration: 10000,
          });
          loadingOperators.value = false;
          setTimeout(() => loadingBar.error(), 500);
        });
    });

    const deleteOperator = (row) => {
      loadingOperatorAdd.value = true;
      removeFromList("personnel", row.key)
        .then(() => {
          operatorOptions.value = operatorOptions.value.filter(
            (operator) => operator.key !== row.key
          );
          loadingOperatorAdd.value = false;
        })
        .catch((error) => {
          notification["error"]({
            content: "An error has occured.",
            meta: error.message,
            duration: 10000,
          });
          loadingOperatorAdd.value = false;
        });
    };

    return {
      formRef,
      formValue: ref({
        name: "",
      }),
      rules: {
        name: [
          {
            required: true,
            message: "Please enter a name",
            trigger: "blur",
          },
        ],
      },
      columns: createColumns(deleteOperator),
      operatorOptions,
      loadingOperators,
      loadingOperatorAdd,
      notification,
    };
  },
  methods: {
    addOperator(e) {
      e.preventDefault();
      this.loadingOperatorAdd = true;
      this.formRef.validate((errors) => {
        if (!errors) {
          const entryObject = {
            name: this.formValue.name,
          };

          insertIntoList("personnel", entryObject)
            .then((Id) => {
              this.operatorOptions.push({
                name: this.formValue.name,
                key: Id,
              });

              this.formValue.name = "";
              this.loadingOperatorAdd = false;
            })
            .catch((error) => {
              console.log(error);
              this.notification["error"]({
                content: "An error has occured.",
                meta: error.message,
                duration: 10000,
              });
              this.loadingOperatorAdd = false;
            });
        } else {
          console.log("FOUND ERRORS");
          this.loadingOperatorAdd = false;
        }
      });
    },
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
