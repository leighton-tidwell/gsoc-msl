<template>
  <n-data-table
    :max-height="500"
    :columns="columns"
    :data="data"
    :pagination="pagination"
  />
  <edit-entry
    v-bind="selectedEntry"
    :showModal="showModal"
    @closeModal="toggleEditModal"
    @updateEntry="testCall"
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
  },
  {
    title: "Time",
    key: "time",
  },
  {
    title: "Operator",
    key: "operator",
  },
  {
    title: "Entry",
    key: "entry",
  },
];

const editEntry = (entry) => {
  toggleEditModal();
  selectedEntry.value = entry;
};

const toggleEditModal = () => {
  showModal.value = !showModal.value;
};

export default defineComponent({
  props: {
    entries: Object,
  },
  setup(props) {
    console.log(props.entries);
    return {
      data: props.entries,
      columns: createColumns({
        editEntry,
      }),
      pagination: {
        pageSize: 10,
      },
      showModal,
      selectedEntry,
      toggleEditModal,
    };
  },
  methods: {
    testCall(formValue) {
      console.log(formValue);
    },
  },
  emits: ["updateEntry"],
  components: {
    NDataTable,
    EditEntry,
  },
});
</script>
