<template>
  <n-modal :show="showModal">
    <n-card
      style="width: 600px"
      title="Edit Entry"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form :label-width="80" :model="formValue" size="medium" ref="formRef">
        <n-form-item label="Date" path="formValue.date">
          <n-date-picker
            v-model:value="formValue.date"
            type="date"
            format="MM-dd-yyyy"
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
      </n-form>
      <template #footer>
        <div style="width: 100%; display: flex; justify-content: flex-end">
          <n-space>
            <n-button @click="$emit('updateEntry', formValue)" type="primary"
              >Update</n-button
            >
            <n-button @click="$emit('deleteEntry', formValue)" type="error"
              >Delete</n-button
            >
            <n-button @click="$emit('closeModal')">Close</n-button>
          </n-space>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  NModal,
  NCard,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NTimePicker,
  NDatePicker,
  NSpace,
} from "naive-ui";

export default defineComponent({
  props: {
    date: Number,
    time: String,
    operator: String,
    entry: String,
    showModal: Boolean,
  },
  emits: ["closeModal", "deleteEntry", "updateEntry"],
  setup(props) {
    return {
      operatorOptions: [
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
      ],
      formValue: ref({
        date: props.date,
        time: props.time,
        operator: props.operator,
        entry: props.entry,
      }),
    };
  },
  components: {
    NModal,
    NCard,
    NButton,
    NFormItem,
    NForm,
    NInput,
    NSelect,
    NTimePicker,
    NDatePicker,
    NSpace,
  },
});
</script>
