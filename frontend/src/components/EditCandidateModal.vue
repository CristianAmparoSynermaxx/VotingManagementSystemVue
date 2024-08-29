<script setup>
import { ref, onMounted, inject } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { GetHeaders } from "@/utils/GetHeaders";

const apiHost = import.meta.env.VITE_host;

const props = defineProps({
  selectedId: Number,
  toggleEditCandidate: Function,
});

const headers = GetHeaders();

const formData = ref({
  name: "",
  image: "",
  position: "",
  partylist: "",
  credentials: "",
  platform: "",
});
const imagePreview = ref("");
const success = ref("");
const error = ref("");

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${apiHost}api/candidates/${props.selectedId}`,
      {
        headers,
      }
    );
    formData.value = response.data[0];
    imagePreview.value = `${apiHost}/uploads/${response.data[0].image}`;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

onMounted(() => {
  fetchData();
});

const handleImageChange = (e) => {
  console.log("click");
  const file = e.target.files[0];
  if (file) {
    formData.value.image = file; // Update formData with the selected file

    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.value = event.target.result; // Set the preview to the base64 image string
    };
    reader.readAsDataURL(file); // Convert the file to a base64 URL
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  Swal.fire({
    icon: "question",
    title: "UPDATE CANDIDATE",
    text: "Are you sure you want to update this candidate?",
    showCancelButton: true,
    confirmButtonText: "Yes, update",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.showLoading();
      const formDataToSend = new FormData();
      Object.keys(formData.value).forEach((key) => {
        formDataToSend.append(key, formData.value[key]);
      });

      axios
        .put(`${apiHost}api/candidates/${props.selectedId}`, formDataToSend, {
          headers,
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            showConfirmButton: false,
            timer: 1000,
          });
          setTimeout(() => {
            props.toggleEditCandidate();
          }, 1200);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response.data.error,
          });
          success.value = "";
        });
    }
  });
};
</script>

<template>
  <section>
    <div
      class="flex flex-col absolute inset-0 backdrop-blur-sm bg-backdrop items-center justify-center px-6 py-8 mx-auto lg:py-0"
    >
      <div
        class="relative w-full bg-white rounded-3xl shadow-xl md:mt-0 sm:max-w-md xl:p-0"
      >
        <div class="space-y-4 pt-14 p-8">
          <form class="space-y-2" @submit.prevent="handleSubmit">
            <!-- Position Dropdown -->
            <div class="absolute left-0 top-0 w-60 mx-auto">
              <select
                id="position"
                name="position"
                v-model="formData.position"
                class="bg-orange-600 rounded-none text-lg p-1 text-center text-white font-bold pl-5"
              >
                <option value="">Select Position</option>
                <option value="President">President</option>
                <option value="Vice_President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Auditor">Auditor</option>
                <option value="Peace_Officer">Peace Officer</option>
              </select>
            </div>

            <!-- Close Modal Button -->
            <a
              class="icon absolute top-5 right-10 cursor-pointer"
              @click="toggleEditCandidate"
            >
              <img src="/closeModal.png" alt="" />
            </a>

            <!-- Image Upload -->
            <div
              class="relative mx-auto bg-orange-600 w-[137px] h-[137px] flex items-center rounded-full"
            >
              <div
                class="w-32 h-32 bg-orange-100 rounded-full overflow-hidden border-4 border-white flex justify-center items-center mx-auto"
              >
                <div>
                  <img
                    id="imagePreview"
                    :src="imagePreview"
                    alt="Image Preview"
                  />
                </div>
              </div>
              <div>
                <label
                  for="imageInput"
                  class="absolute bottom-1 right-0 rounded-full w-10 h-10 bg-slate-600 hover:bg-slate-700 p-2 text-white cursor-pointer flex justify-center items-center"
                >
                  <img
                    class="w-5 h-5 object-center"
                    src="/editProfile.png"
                    alt="Edit Profile"
                  />
                  <span class="sr-only">Choose an image to upload</span>
                </label>
                <input
                  type="file"
                  name="image"
                  id="imageInput"
                  class="hidden h-full w-full cursor-pointer"
                  accept=".png, .jpg, .jpeg"
                  @change="handleImageChange"
                />
              </div>
            </div>

            <!-- Name Input -->
            <div class="w-80 mx-auto">
              <input
                type="text"
                id="name"
                name="name"
                v-model="formData.name"
                placeholder="Enter candidate name"
                class="textInput focus:ring-primary-600 focus:border-primary-600 text-xl text-center text-black font-bold"
              />
            </div>

            <!-- Partylist Input -->
            <div class="w-80 mx-auto">
              <input
                type="text"
                id="partylist"
                name="partylist"
                v-model="formData.partylist"
                placeholder="Enter partylist"
                class="textInput focus:ring-primary-600 focus:border-primary-600 text-lg p-0.5 text-center text-orange-600 font-medium"
              />
            </div>

            <!-- Divider -->
            <div class="pt-3">
              <div class="w-80 bg-gray-500 h-0.5 mx-auto"></div>
            </div>

            <!-- Credentials Input -->
            <div class="w-max mx-auto">
              <div class="text-lg p-0.5 text-center text-gray-500 font-bold">
                Achievements/Credentials
              </div>
              <textarea
                id="credentials"
                name="credentials"
                v-model="formData.credentials"
                class="w-72 p-2 text-center"
                placeholder="Enter Achievements/Credentials"
              />
            </div>

            <!-- Divider -->
            <div class="pt-3">
              <div class="w-80 bg-gray-500 h-0.5 mx-auto"></div>
            </div>

            <!-- Platform Input -->
            <div class="w-max mx-auto">
              <div class="text-lg p-0.5 text-center text-gray-500 font-bold">
                Platforms/Goals
              </div>
              <textarea
                id="platform"
                name="platform"
                v-model="formData.platform"
                class="w-72 p-2 text-center"
                placeholder="Enter Platforms/Goals"
              />
            </div>

            <!-- Success/Error Messages -->
            <div class="text-center w-full">
              <h1 v-if="success" class="text-green-700">{{ success }}</h1>
              <h1 v-if="error" class="text-red-700">{{ error }}</h1>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-1 font-medium rounded-lg text-lg px-5 py-2.5 text-center"
            >
              Update Candidate
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
