<template>
  <n-h4><n-text type="primary">Add Entry</n-text></n-h4>
  <n-form
    :rules="rules"
    :label-width="80"
    :model="formValue"
    size="medium"
    ref="formRef"
  >
    <n-form-item label="Date" path="date">
      <n-date-picker
        v-model:value="formValue.date"
        type="date"
        format="MM-dd-yyyy"
        :on-change="$emit('dateChange', formValue.date)"
      />
    </n-form-item>
    <n-form-item label="Time" path="time">
      <n-time-picker
        v-model:formatted-value="formValue.time"
        value-format="HH:mm"
        format="HH:mm"
      />
    </n-form-item>
    <n-form-item label="Operator" path="operator">
      <n-select
        v-model:value="formValue.operator"
        placeholder="Select Operator"
        :options="operatorOptions"
        filterable
        :loading="loadingOperators"
      />
    </n-form-item>
    <n-form-item label="Entry" path="entry">
      <n-input v-model:value="formValue.entry" type="textarea" />
    </n-form-item>
    <n-form-item>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <n-button
          :loading="loading"
          @click="addEntry"
          icon-placement="right"
          type="primary"
        >
          <template #icon>
            <n-icon>
              <add />
            </n-icon>
          </template>
          Add
        </n-button>
      </div>
    </n-form-item>
  </n-form>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NH4,
  NTimePicker,
  NSelect,
  NDatePicker,
  NButton,
  NText,
  NIcon,
  useNotification,
} from "naive-ui";
import { Add } from "@vicons/ionicons5";
import { insertIntoList, getPersonnel } from "../api/";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default defineComponent({
  props: {
    selectedDate: Number,
  },
  emits: ["dateChange", "addEntry"],
  setup(props) {
    const formRef = ref(null);
    const loading = ref(false);
    const loadingOperators = ref(false);
    const operatorOptions = ref([]);
    const notification = useNotification();

    onMounted(() => {
      loadingOperators.value = true;
      getPersonnel()
        .then((data) => {
          const formattedList = data
            .map((person) => ({
              label: person.name,
              value: person.name,
              key: person.Id,
            }))
            .sort((a, b) =>
              a.value < b.value ? -1 : a.value > b.value ? 1 : 0
            );
          operatorOptions.value = formattedList;
          loadingOperators.value = false;
        })
        .catch((error) => {
          notification["error"]({
            content: "An error has occured.",
            meta: error.message,
            duration: 10000,
          });
          loadingOperators.value = false;
        });
    });

    return {
      formRef,
      formValue: ref({
        date: props.selectedDate,
        time: dayjs().format("HH:mm"),
        operator: null,
        entry: null,
      }),
      rules: {
        date: [
          {
            required: true,
            message: "Please select a date",
            validator: (rule, value) => {
              if (value) {
                const date = dayjs(value);
                if (date.isValid()) return true;
              }
              return new Error("Please select a valid date.");
            },
          },
        ],
        time: [
          {
            required: true,
            message: "Please select a time",
            validator: (rule, value) => {
              if (value) {
                const time = dayjs(value, "HH:mm");
                if (time.isValid()) return true;
              }
              return new Error("Please select a valid time.");
            },
          },
        ],
        operator: [
          {
            required: true,
            message: "Please select an operator",
          },
        ],
        entry: [
          {
            required: true,
            message: "Please enter an entry",
            trigger: "blur",
          },
        ],
      },
      operatorOptions,
      loadingOperators,
      loading,
      notification,
    };
  },
  methods: {
    addEntry(e) {
      e.preventDefault();
      this.loading = true;
      this.formRef.validate((errors) => {
        if (!errors) {
          const entryObject = {
            date: dayjs(
              `${dayjs(this.formValue.date).format("MM/DD/YYYY")} ${
                this.formValue.time
              }`,
              "MM/DD/YYYY HH:mm"
            ).toISOString(),
            time: this.formValue.time,
            operator: this.formValue.operator,
            entry: this.formValue.entry,
          };

          insertIntoList("mslLog", entryObject)
            .then((Id) => {
              this.$emit("addEntry", { ...entryObject, key: Id });
              this.formValue.entry = "";
              this.loading = false;
            })
            .catch((error) => {
              this.notification["error"]({
                content: "An error has occured.",
                meta: error.message,
                duration: 10000,
              });
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
  },
  components: {
    NForm,
    NFormItem,
    NInput,
    NTimePicker,
    NSelect,
    NH4,
    NDatePicker,
    NButton,
    NText,
    NIcon,
    Add,
  },
});
</script>
