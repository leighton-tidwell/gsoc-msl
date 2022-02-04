<template>
  <n-h4><n-text type="primary">Add Entry</n-text></n-h4>
  <n-form :label-width="80" :model="formValue" size="medium" ref="formRef">
    <n-form-item label="Date" path="formValue.date">
      <n-date-picker
        v-model:value="formValue.date"
        type="date"
        format="MM-dd-yyyy"
        :on-blur="$emit('dateChange', formValue.date)"
      />
    </n-form-item>
    <n-form-item label="Time" path="formValue.time">
      <n-time-picker
        v-model:formatted-value="formValue.time"
        value-format="HH:mm"
        format="HH:mm"
      />
    </n-form-item>
    <n-form-item label="Operator" path="formValue.operator">
      <n-select
        v-model:value="formValue.operator"
        placeholder="Select Operator"
        :options="operatorOptions"
        filterable
      />
    </n-form-item>
    <n-form-item label="Entry" path="formValue.entry">
      <n-input v-model:value="formValue.entry" type="textarea" />
    </n-form-item>
    <n-form-item>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <n-button icon-placement="right" type="primary">
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
import { defineComponent, ref } from "vue";
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
} from "naive-ui";
import { Add } from "@vicons/ionicons5";

const operatorOptions = [
  {
    label: "SrA Tidwell",
    value: "SrA Tidwell",
    key: "sra-tidwell",
  },
  {
    label: "SrA Test",
    value: "SrA Test",
    key: "sra-test",
  },
  {
    label: "SrA 2",
    value: "SrA 2",
    key: "sra-2",
  },
  {
    label: "SrA 3",
    value: "SrA 3",
    key: "sra-3",
  },
];

export default defineComponent({
  props: {
    selectedDate: Number,
  },
  emits: ["dateChange"],
  setup(props) {
    const formRef = ref(null);
    return {
      formRef,
      formValue: ref({
        date: props.selectedDate,
        time: "00:00",
        operator: null,
        entry: null,
      }),
      operatorOptions,
    };
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
