<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { GetHeaders } from "@/utils/GetHeaders";
import EditCandidateModal from "./EditCandidateModal.vue";
import AddCandidateModal from "./AddCandidateModal.vue";

const apiHost = import.meta.env.VITE_host;
const headers = GetHeaders();

const data = ref([]);
const searchQuery = ref(""); // Keep searchQuery for backend query
const currentPage = ref(1);
const pageSize = ref(10);
const rowsPerPageOptions = [5, 10, 15, 20];
const sortColumn = ref(null);
const sortOrder = ref("asc");
const selectedId = ref();
const editCandidateModalOpen = ref(false);
const addCandidateModalOpen = ref(false);
const props = defineProps({
  title: String,
  url: String,
  columns: Array,
  search: Boolean,
});

const fetchData = async () => {
  try {
    const response = await axios.get(`${apiHost}api/${props.url}`, {
      headers,
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        filterBy: searchQuery.value, // Include search query here
      },
    });
    data.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 5000);
  return () => clearInterval(intervalId);
});

const sortedData = computed(() => {
  if (sortColumn.value) {
    return [...data.value].sort((a, b) => {
      const aValue = a[sortColumn.value];
      const bValue = b[sortColumn.value];
      if (aValue < bValue) return sortOrder.value === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }
  return data.value;
});

const sortData = (columnKey) => {
  if (sortColumn.value === columnKey) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = columnKey;
    sortOrder.value = "asc";
  }
};

const changePage = (page) => {
  if (page > 0) {
    currentPage.value = page;
    fetchData();
  }
};

const changePageSize = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // Reset to the first page
  fetchData();
};

const toggleEditCandidateModal = () => {
  editCandidateModalOpen.value = !editCandidateModalOpen.value;
};

const toggleAddCandidateModal = () => {
  addCandidateModalOpen.value = !addCandidateModalOpen.value;
};

const editCandidate = (item) => {
  selectedId.value = item;
  toggleEditCandidateModal();
};

const deleteItem = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await axios.delete(`${apiHost}api/${props.url}/${id}`, { headers });
      Swal.fire({
        icon: "success",
        title: "Candidate Deleted!",
        text: "Candidate has been deleted.",
        showConfirmButton: false,
        timer: 1500,
      });
      // Refresh data after deletion
      fetchData();
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error deleting the item.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
</script>

<template>
  <div class="data-table">
    <div class="header px-3">
      <h1 class="text-2xl font-bold text-primary">
        {{ title }} <span class="text-black">Table</span>
      </h1>
      <div class="flex gap-2">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="search-input"
          @input="fetchData"
        />
        <button
          v-if="props.url === 'candidates'"
          @click="toggleAddCandidateModal"
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded focus:outline-none text-sm hover:bg-green-700 gap-1"
        >
          <img className="w-3 h-3" src="/add.png" alt="" /> Add
        </button>
      </div>
    </div>
    <div class="tablewrapper">
      <table>
        <tr v-if="sortedData.length === 0">
          <!-- Display message if no data is available -->
          <td :colspan="columns.length" class="text-center h-20">
            There is no record to display
          </td>
        </tr>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sortData(column.key)"
            >
              {{ column.label }}
              <span v-if="sortColumn === column.key">
                {{ sortOrder === "asc" ? "↑" : "↓" }}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedData" :key="item.id">
            <td v-for="column in columns" :key="column.key">
              <!-- Check if the column is 'action' to add action buttons -->
              <div v-if="column.key === 'action' && props.url === 'candidates'">
                <div class="flex gap-1">
                  <button
                    class="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-indigo-600 gap-1"
                    @click="editCandidate(item.id)"
                  >
                    <img className="w-3 h-3" src="/edit.png" alt="" />
                    Edit
                  </button>
                  <button
                    class="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-red-600 gap-1"
                    @click="deleteItem(item.id)"
                  >
                    <img className="w-3 h-3" src="/delete.png" alt="" />
                    Delete
                  </button>
                </div>
              </div>
              <div v-else-if="column.key === 'action' && props.url === 'users'">
                <button
                  class="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-red-600 gap-1"
                  @click="deleteItem(item.id)"
                >
                  <img className="w-3 h-3" src="/delete.png" alt="" />
                  Delete
                </button>
              </div>
              <div v-else>
                {{ item[column.key] }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tablefooter flex justify-between px-5 py-2 text-xs">
      <div class="flex gap-2">
        <p>rows per page</p>
        <select
          v-model="pageSize"
          @change="changePageSize($event.target.value)"
        >
          <option
            name="option"
            v-for="option in rowsPerPageOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 1"
        >
          <<
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="data.length < pageSize"
        >
          >>
        </button>
        <span>Page {{ currentPage }}</span>
      </div>
    </div>
  </div>
  <EditCandidateModal
    v-if="editCandidateModalOpen"
    :selectedId="selectedId"
    :toggleEditCandidate="toggleEditCandidateModal"
  />
  <AddCandidateModal
    v-if="addCandidateModalOpen"
    :toggleAddCandidateModal="toggleAddCandidateModal"
  />
</template>

<style scoped>
.data-table {
  width: 100%;
  padding: 20px;
}

.tablewrapper {
  border-radius: 15px;
  overflow: auto;
  margin-top: 20px;
  box-shadow: rgba(0, 0, 0, 0.106) 0px 3px 8px 2px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-input {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
table {
  width: 100%;
  overflow: auto;
}
th,
td {
  padding: 1em;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th:first-child,
td:first-child {
  text-align: center;
  padding-left: 40px;
  padding-right: 40px;
}
th {
  @apply bg-[#c24f0c] text-white text-xs font-bold text-left;
}
td {
  @apply text-gray-700 text-xs;
}
</style>
