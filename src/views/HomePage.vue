<template>
  <n-layout has-sider position="absolute" style="top: 3em">
    <n-layout-sider
      style="min-width: 350px"
      bordered
      content-style="padding: 24px;"
    >
      <entry-form
        @addEntry="handleAddEntry"
        @dateChange="handleDateChange"
        :selectedDate="selectedDate"
      />
    </n-layout-sider>
    <n-layout content-style="padding: 24px;">
      <n-h2 prefix="bar">MSL Entry for {{ formattedSelectedDate }}</n-h2>
      <entry-table
        :editLoading="editLoading"
        :loading="loading"
        @updateEntry="handleUpdateEntry"
        @deleteEntry="handleDeleteEntry"
        :entries="entries"
      />
    </n-layout>
  </n-layout>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import {
  NLayout,
  NLayoutSider,
  NH2,
  useLoadingBar,
  useNotification,
} from "naive-ui";
import { EntryTable, EntryForm } from "../components";
import { getEntriesForDate } from "../api";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const entries = reactive([]);
    const loadingBar = useLoadingBar();
    const editLoading = ref(false);
    const loading = ref(false);
    const notification = useNotification();
    const selectedDate = ref(new Date().getTime());
    const formattedSelectedDate = ref("");
    loadingBar.start();

    onMounted(() => {
      loading.value = true;
      getEntriesForDate(selectedDate.value)
        .then((data) => {
          const formattedData = data.map((entry) => {
            return {
              ...entry,
              time: dayjs(entry.date).format("HH:mm"),
              key: entry.Id,
            };
          });
          entries.value = formattedData;
          loading.value = false;
          setTimeout(() => loadingBar.finish(), 500);
        })
        .catch((error) => {
          notification["error"]({
            content: "An error has occured.",
            meta: error.message,
            duration: 10000,
          });
          loading.value = false;
          setTimeout(() => loadingBar.error(), 500);
        });
    });

    return {
      formattedSelectedDate,
      selectedDate: selectedDate.value,
      entries,
      loading,
      editLoading,
    };
  },
  methods: {
    handleDateChange(date) {
      this.selectedDate = date;
      this.formattedSelectedDate = dayjs(date).format("MMMM D, YYYY");

      this.loading = true;
      getEntriesForDate(this.selectedDate)
        .then((data) => {
          const formattedData = data.map((entry) => {
            return {
              ...entry,
              key: entry.Id,
            };
          });

          this.entries.value = formattedData;
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
    },
    handleUpdateEntry(entry) {
      this.entries.value.map((e) => {
        if (e.key === entry.key) {
          e.date = entry.date;
          e.time = entry.time;
          e.operator = entry.operator;
          e.entry = entry.entry;
        }
      });
    },
    handleAddEntry(entry) {
      this.entries.value.push(entry);
    },
    handleDeleteEntry(entry) {
      this.entries.value = this.entries.value.filter(
        (e) => e.key !== entry.key
      );
    },
  },
  components: {
    NLayout,
    NLayoutSider,
    NH2,
    EntryTable,
    EntryForm,
  },
});
</script>
