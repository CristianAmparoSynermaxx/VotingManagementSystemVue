<script setup>
import { ref, inject } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { GetHeaders } from "@/utils/GetHeaders";

const apiHost = import.meta.env.VITE_host;
const headers = GetHeaders();

// Injecting context to get the closeAddCandidateModal function
const props = defineProps({
  toggleAddCandidateModal: Function,
});

const formData = ref({
  name: "",
  image: null,
  position: "",
  partylist: "",
  credentials: "",
  platform: "",
});

const imagePreview = ref(null);

const handleChange = (e) => {
  if (e.target.name === "image") {
    const file = e.target.files[0];
    formData.value.image = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.value = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  } else {
    formData.value[e.target.name] = e.target.value;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  Swal.showLoading();

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.value.name);
  formDataToSend.append("image", formData.value.image);
  formDataToSend.append("position", formData.value.position);
  formDataToSend.append("partylist", formData.value.partylist);
  formDataToSend.append("credentials", formData.value.credentials);
  formDataToSend.append("platform", formData.value.platform);

  axios
    .post(`${apiHost}api/candidates/`, formDataToSend, { headers })
    .then((response) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        showConfirmButton: false,
        timer: 1000,
      });

      setTimeout(() => {
        props.toggleAddCandidateModal();
      }, 1500);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
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
            <div class="absolute left-0 top-0 w-60 mx-auto">
              <div>
                <select
                  id="position"
                  name="position"
                  v-model="formData.position"
                  class="bg-orange-600 rounded-none focus:ring-primary-600 focus:border-primary-600 text-lg p-1 pr-2 text-center text-white font-bold"
                >
                  <option :value="null">Select Position</option>
                  <option value="President">President</option>
                  <option value="Vice_President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Peace_Officer">Peace Officer</option>
                </select>
              </div>
            </div>
            <a
              class="icon absolute top-5 right-10 cursor-pointer"
              @click="toggleAddCandidateModal"
            >
              <img src="/closeModal.png" alt="" />
            </a>
            <div
              class="relative mx-auto bg-orange-600 w-[137px] h-[137px] flex items-center rounded-full"
            >
              <div
                class="w-32 h-32 bg-orange-100 rounded-full overflow-hidden border-4 border-white flex justify-center items-center mx-auto"
              >
                <div>
                  <img
                    id="imagePreview"
                    :src="imagePreview || '/profile.png'"
                    alt=""
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
                    alt=""
                  />
                  <span class="sr-only">Choose an image to upload</span>
                </label>
                <input
                  type="file"
                  name="image"
                  id="imageInput"
                  class="hidden h-full w-full cursor-pointer"
                  accept=".png, .jpg, .jpeg"
                  @change="handleChange"
                />
              </div>
            </div>
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
            <div class="pt-3">
              <div class="w-80 bg-gray-500 h-0.5 mx-auto"></div>
            </div>
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
            <div class="pt-3">
              <div class="w-80 bg-gray-500 h-0.5 mx-auto"></div>
            </div>
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
            <button
              type="submit"
              class="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-1 font-medium rounded-lg text-lg px-5 py-2.5 text-center"
            >
              Add Candidate
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add your scoped styles here */
</style>
