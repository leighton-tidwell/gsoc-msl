<template>
  <n-layout has-sider position="absolute" style="top: 3em">
    <n-layout-sider
      style="min-width: 350px"
      bordered
      content-style="padding: 24px;"
    >
      <entry-form @dateChange="handleDateChange" :selectedDate="selectedDate" />
    </n-layout-sider>
    <n-layout content-style="padding: 24px;">
      <n-h2 prefix="bar">MSL Entry for {{ formattedSelectedDate }}</n-h2>
      <entry-table @updateEntry="updateEntry" :entries="entries" />
    </n-layout>
  </n-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { NLayout, NLayoutSider, NH2, useLoadingBar } from "naive-ui";
import { EntryTable, EntryForm } from "../components";
import dayjs from "dayjs";

const selectedDate = ref(new Date().getTime());
const formattedDate = ref(dayjs(selectedDate.value).format("MMMM D, YYYY"));

const handleDateChange = (date) => {
  selectedDate.value = date;
  formattedDate.value = dayjs(date).format("MMMM D, YYYY");
};

const updateEntry = (formValue) => {
  console.log(formValue);
};

const entries = ref([
  {
    key: 0,
    date: selectedDate.value,
    time: "15:00",
    operator: "SrA Tidwell",
    entry: "Test entry test entry",
  },
  {
    key: 1,
    date: selectedDate.value,
    time: "15:00",
    operator: "SrA Test",
    entry: "Test entry test entry",
  },
]);

export default defineComponent({
  setup() {
    const loadingBar = useLoadingBar();
    loadingBar.start();

    onMounted(() => {
      setTimeout(() => loadingBar.finish(), 1000);
    });

    return {
      formattedSelectedDate: formattedDate,
      selectedDate: selectedDate.value,
      entries,
    };
  },
  methods: {
    handleDateChange,
    updateEntry,
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
