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
          />
        </n-form-item>
        <n-form-item label="Entry" path="entry">
          <n-input v-model:value="formValue.entry" type="textarea" />
        </n-form-item>
      </n-form>
      <n-alert v-if="successText" title="Success!" type="success">{{
        successText
      }}</n-alert>
      <n-alert v-if="errorText" title="Error!" type="error" closable>{{
        errorText
      }}</n-alert>
      <template #footer>
        <div style="width: 100%; display: flex; justify-content: flex-end">
          <n-space>
            <n-button :loading="loading" @click="updateEntry" type="primary">
              Update
            </n-button>
            <n-popconfirm
              title="Are you sure you want to delete this entry?"
              @positiveClick="handleDeleteEntry"
            >
              <template #trigger>
                <n-button :loading="deleteLoading" type="error">
                  Delete
                </n-button>
              </template>
              Are you sure you want to delete this?
            </n-popconfirm>
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
  NAlert,
  NPopconfirm,
  useNotification,
} from "naive-ui";
import { updateListItem, removeFromList } from "../api/";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default defineComponent({
  props: {
    id: Number,
    date: [String, Number],
    time: String,
    operator: String,
    entry: String,
    showModal: Boolean,
  },
  emits: ["closeModal", "deleteEntry", "updateEntry"],
  setup(props) {
    const notification = useNotification();
    const formRef = ref(null);
    const loading = ref(false);
    const deleteLoading = ref(false);
    const successText = ref("");
    const errorText = ref("");
    return {
      formRef,
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
        key: props.id,
        date: dayjs(props.date).valueOf(),
        time: props.time,
        operator: props.operator,
        entry: props.entry,
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
      loading,
      deleteLoading,
      successText,
      errorText,
      notification,
    };
  },
  methods: {
    updateEntry(e) {
      e.preventDefault();

      this.loading = true;
      this.formRef.validate((errors) => {
        if (!errors) {
          const updateObject = {
            Id: this.formValue.key,
            date: dayjs(this.formValue.date).toISOString(),
            time: this.formValue.time,
            operator: this.formValue.operator,
            entry: this.formValue.entry,
          };

          updateListItem("mslLog", updateObject)
            .then(() => {
              this.$emit("updateEntry", this.formValue);
              this.loading = false;
              this.successText = "Entry updated successfully!";
              setTimeout(() => {
                this.successText = "";
              }, 3000);
            })
            .catch((error) => {
              this.errorText = error.message;
            });
        } else {
          this.loading = false;
        }
      });
    },
    handleDeleteEntry() {
      this.deleteLoading = true;
      removeFromList("mslLog", this.formValue.key)
        .then(() => {
          this.$emit("deleteEntry", this.formValue);
          this.$emit("closeModal");
          this.deleteLoading = false;
          this.notification["success"]({
            content: "Entry deleted successfully!",
            duration: 10000,
          });
        })
        .catch((error) => {
          this.errorText = error.message;
        });
    },
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
    NAlert,
    NPopconfirm,
  },
});
</script>
