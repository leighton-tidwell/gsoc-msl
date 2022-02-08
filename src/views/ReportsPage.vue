<template>
  <n-layout position="absolute" style="top: 3em"
    ><n-grid x-gap="12" :cols="3" style="margin-top: 2em">
      <n-gi></n-gi>
      <n-gi>
        <div class="header">
          <n-h1>
            <n-text style="display: flex; align-items: center">
              <n-icon size="32"><file-tray /></n-icon>Reports
            </n-text>
          </n-h1>
        </div>
        <div class="content">
          <n-card title="Export Events">
            <n-form
              :label-width="80"
              :model="formValue"
              :rules="rules"
              size="large"
              ref="formRef"
            >
              <n-form-item label="Start Date" path="startDate">
                <n-date-picker
                  v-model:value="formValue.startDate"
                  type="date"
                  format="MM-dd-yyyy"
                  style="width: 100%"
                />
              </n-form-item>
              <n-form-item label="End Date" path="endDate">
                <n-date-picker
                  v-model:value="formValue.endDate"
                  type="date"
                  format="MM-dd-yyyy"
                  style="width: 100%"
                />
              </n-form-item>
              <n-form-item>
                <div
                  style="width: 100%; display: flex; justify-content: flex-end"
                >
                  <n-button
                    :loading="loading"
                    icon-placement="right"
                    type="primary"
                    @click="handleExport"
                  >
                    <template #icon>
                      <n-icon>
                        <download-outline />
                      </n-icon>
                    </template>
                    Export
                  </n-button>
                </div>
              </n-form-item>
            </n-form>
          </n-card>
        </div>
      </n-gi>
      <n-gi></n-gi>
    </n-grid>
  </n-layout>
</template>

<script>
import { onMounted, ref } from "vue";
import {
  NLayout,
  NGrid,
  NGi,
  NH1,
  NCard,
  NIcon,
  NForm,
  NFormItem,
  useLoadingBar,
  NDatePicker,
  NButton,
  NText,
  useNotification,
} from "naive-ui";
import { FileTray, DownloadOutline } from "@vicons/ionicons5";
import { getEntriesFromDateTo } from "../api/";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default {
  setup() {
    const formRef = ref(null);
    const loadingBar = useLoadingBar();
    const loading = ref(false);
    const notification = useNotification();
    loadingBar.start();

    onMounted(() => {
      setTimeout(() => loadingBar.finish(), 1000);
    });

    return {
      formRef,
      formValue: ref({
        startDate: dayjs().subtract(1, "day").valueOf(),
        endDate: dayjs().valueOf(),
      }),
      rules: {
        startDate: [
          {
            required: true,
            message: "Please enter a start date.",
            validator: (rule, value) => {
              if (value) {
                const date = dayjs(value);
                if (date.isValid()) return true;
              }
              return new Error("Please select a valid date.");
            },
          },
        ],
        endDate: [
          {
            required: true,
            message: "Please enter a end date.",
            validator: (rule, value) => {
              if (value) {
                const date = dayjs(value);
                if (date.isValid()) return true;
              }
              return new Error("Please select a valid date.");
            },
          },
        ],
      },
      loading,
      notification,
    };
  },
  methods: {
    handleExport(e) {
      e.preventDefault();
      this.loading = true;
      this.formRef.validate((errors) => {
        if (!errors) {
          getEntriesFromDateTo(this.formValue.startDate, this.formValue.endDate)
            .then(async (data) => {
              const wb = new ExcelJS.Workbook();
              const ws = wb.addWorksheet();

              ws.columns = [
                { key: "1", width: 150 },
                { key: "2", width: 15 },
                { key: "3", width: 10 },
                { key: "4", width: 50 },
                { key: "5", width: 20 },
              ];

              ws.addRow(["DATE", "TIME", "OPERATOR", "ENTRY"]);

              data.forEach((event) => {
                ws.addRow([
                  dayjs(event.date).format("MM-DD-YYYY"),
                  dayjs(event.date).format("HH:mm"),
                  event.operator,
                  event.entry,
                ]);
              });

              const buf = await wb.xlsx.writeBuffer();

              saveAs(
                new Blob([buf]),
                `${dayjs(this.formValue.startDate).format("DD")}-${dayjs(
                  this.formValue.endDate
                )
                  .format("DD MMM")
                  .toUpperCase()} MSL.xlsx`
              );

              this.loading = false;
            })
            .catch((error) => {
              console.log(error);
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
    NLayout,
    NGi,
    NGrid,
    NH1,
    FileTray,
    NCard,
    NIcon,
    NForm,
    NFormItem,
    NDatePicker,
    NButton,
    DownloadOutline,
    NText,
  },
};
</script>
