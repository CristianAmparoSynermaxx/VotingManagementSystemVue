<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { GetHeaders } from "@/utils/GetHeaders";

const apiHost = import.meta.env.VITE_host;

const props = defineProps({
  toggleDurationModal: Function,
});
const startDate = ref("");
const endDate = ref("");
const headers = GetHeaders();

onMounted(() => {
  axios
    .get(`${apiHost}api/votes/voteEnd`, { headers })
    .then((response) => {
      const { electionStartDate, electionEndDate } = response.data;
      startDate.value = electionStartDate;
      endDate.value = electionEndDate;
    })
    .catch((error) => {
      console.error("Error fetching election settings:", error);
    });
});

const handleUpdateSettings = () => {
  Swal.fire({
    icon: "question",
    title: "UPDATE END DATE",
    text: "Are you sure you want to update the election end date?",
    showCancelButton: true,
    confirmButtonText: "Yes, update",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.showLoading();
      axios
        .put(
          `${apiHost}api/votes/voteEnd`,
          { startDate: startDate.value, endDate: endDate.value },
          { headers }
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          props.toggleDurationModal();
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response.data.error,
          });
          console.error("Error updating election settings:", error);
        });
    }
  });
};
</script>

<template>
  <section>
    <div
      class="absolute inset-0 flex justify-center backdrop-blur-sm pt-36 z-20"
    >
      <div class="px-4 py-10 bg-white h-max shadow-2xl rounded-3xl w-96">
        <div class="max-w-md mx-auto text-black px-2 space-y-5">
          <h1
            class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-center"
          >
            <span class="text-orange-600">Duration</span> Settings
          </h1>
          <div>
            <label>Start Date:</label>
            <input
              type="datetime-local"
              v-model="startDate"
              class="form-input py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-indigo-500"
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="datetime-local"
              v-model="endDate"
              class="form-input py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-indigo-500"
            />
          </div>
          <div class="w-full justify-center flex gap-2">
            <button
              class="bg-white text-orange-600 hover:text-orange-700 border border-orange-600 hover:border-orange-700 font-bold py-2 px-4 rounded"
              @click="toggleDurationModal"
            >
              Cancel
            </button>
            <button
              class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              @click="handleUpdateSettings"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
