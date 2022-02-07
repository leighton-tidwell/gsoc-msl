<template>
  <n-data-table
    :max-height="500"
    :columns="columns"
    :data="entries.value"
    :pagination="pagination"
    :loading="loading"
  />
  <edit-entry
    :loading="editLoading"
    v-bind="selectedEntry"
    :showModal="showModal"
    @closeModal="closeModal"
    @updateEntry="updateEntry"
    @deleteEntry="deleteEntry"
  />
</template>

<script>
import { defineComponent, h, ref } from "vue";
import { NDataTable, NIcon } from "naive-ui";
import { CreateOutline } from "@vicons/ionicons5";
import { EditEntry } from ".";

const showModal = ref(false);
const selectedEntry = ref({});

const renderIcon = (icon) => {
  return () => h(NIcon, { size: "20" }, { default: () => h(icon) });
};

const createColumns = ({ editEntry }) => [
  {
    title: "Edit",
    key: "edit",
    render(row) {
      return h(renderIcon(CreateOutline), {
        onClick: () => editEntry(row),
        style: "cursor:pointer",
      });
    },
    width: 100,
  },
  {
    title: "Time",
    key: "time",
    width: 100,
    sortOrder: "descend",
    sorter: (a, b) => {
      const cleanA = Number(a.time.split(":").join(""));
      const cleanB = Number(b.time.split(":").join(""));
      if (cleanA < cleanB) return -1;
      else if (cleanA > cleanB) return 1;
      else return 0;
    },
  },
  {
    title: "Operator",
    key: "operator",
    width: 200,
  },
  {
    title: "Entry",
    key: "entry",
  },
];

const editEntry = (entry) => {
  openModal();
  selectedEntry.value = { id: entry.key, ...entry };
};

const closeModal = () => {
  showModal.value = false;
};

const openModal = () => {
  showModal.value = true;
};

export default defineComponent({
  props: {
    entries: Array,
    loading: Boolean,
    editLoading: Boolean,
  },
  setup() {
    return {
      columns: createColumns({
        editEntry,
      }),
      pagination: {
        pageSize: 10,
      },
      showModal,
      selectedEntry,
      closeModal,
    };
  },
  methods: {
    updateEntry(formValue) {
      this.$emit("updateEntry", formValue);
    },
    deleteEntry(entry) {
      this.$emit("deleteEntry", entry);
    },
  },
  emits: ["updateEntry", "deleteEntry"],
  components: {
    NDataTable,
    EditEntry,
  },
});
</script>

<style scoped>
.hidden {
  padding: 100px;
}
</style>
